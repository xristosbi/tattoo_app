-- ============================================================
-- EXTENSIONS
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type public.subscription_tier as enum ('free', 'pro', 'studio');
create type public.subscription_status as enum (
  'active', 'canceled', 'past_due', 'trialing',
  'incomplete', 'incomplete_expired', 'unpaid', 'paused'
);
create type public.generation_type as enum ('image_to_stencil', 'text_to_stencil');
create type public.generation_status as enum ('pending', 'processing', 'completed', 'failed');
create type public.team_member_status as enum ('pending', 'active', 'revoked');

-- ============================================================
-- PROFILES
-- ============================================================
create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
create table public.subscriptions (
  id                      uuid primary key default uuid_generate_v4(),
  user_id                 uuid not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id      text unique,
  stripe_subscription_id  text unique,
  stripe_price_id         text,
  tier                    public.subscription_tier not null default 'free',
  status                  public.subscription_status not null default 'active',
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  cancel_at_period_end    boolean not null default false,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ============================================================
-- GENERATION QUOTAS
-- ============================================================
create table public.generation_quotas (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid not null unique references public.profiles(id) on delete cascade,
  count        integer not null default 0,
  period_start timestamptz not null default date_trunc('month', now()),
  period_end   timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- GENERATIONS
-- ============================================================
create table public.generations (
  id                  uuid primary key default uuid_generate_v4(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  quota_owner_id      uuid not null references public.profiles(id) on delete cascade,
  type                public.generation_type not null,
  status              public.generation_status not null default 'pending',
  prompt              text,
  input_storage_path  text,
  output_storage_path text,
  replicate_id        text,
  error_message       text,
  metadata            jsonb not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_generations_user_id    on public.generations(user_id);
create index idx_generations_created_at on public.generations(created_at desc);
create index idx_generations_status     on public.generations(status);

-- ============================================================
-- TEAM MEMBERS
-- ============================================================
create table public.team_members (
  id            uuid primary key default uuid_generate_v4(),
  owner_id      uuid not null references public.profiles(id) on delete cascade,
  member_id     uuid references public.profiles(id) on delete set null,
  invite_email  text not null,
  invite_token  text not null unique default encode(gen_random_bytes(32), 'hex'),
  status        public.team_member_status not null default 'pending',
  invited_at    timestamptz not null default now(),
  accepted_at   timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique(owner_id, invite_email)
);

create index idx_team_members_owner_id     on public.team_members(owner_id);
create index idx_team_members_member_id    on public.team_members(member_id);
create index idx_team_members_invite_token on public.team_members(invite_token);

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-create profile and subscription on auth.users insert
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_period_start timestamptz := date_trunc('month', now());
  v_period_end   timestamptz := date_trunc('month', now()) + interval '1 month';
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );

  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');

  insert into public.generation_quotas (user_id, count, period_start, period_end)
  values (new.id, 0, v_period_start, v_period_end);

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Atomic quota increment
create or replace function public.increment_generation_count(p_user_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update public.generation_quotas
  set count = count + 1, updated_at = now()
  where user_id = p_user_id;
end;
$$;

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

create trigger handle_generations_updated_at
  before update on public.generations
  for each row execute procedure public.handle_updated_at();

create trigger handle_quotas_updated_at
  before update on public.generation_quotas
  for each row execute procedure public.handle_updated_at();

create trigger handle_team_members_updated_at
  before update on public.team_members
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles          enable row level security;
alter table public.subscriptions     enable row level security;
alter table public.generations       enable row level security;
alter table public.generation_quotas enable row level security;
alter table public.team_members      enable row level security;

-- PROFILES
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Studio owners can view member profiles"
  on public.profiles for select using (
    exists (
      select 1 from public.team_members tm
      where tm.owner_id = auth.uid()
        and tm.member_id = profiles.id
        and tm.status = 'active'
    )
  );

-- SUBSCRIPTIONS
create policy "Users can view own subscription"
  on public.subscriptions for select using (auth.uid() = user_id);

-- GENERATIONS
create policy "Users can view own generations"
  on public.generations for select using (auth.uid() = user_id);

create policy "Users can insert own generations"
  on public.generations for insert with check (auth.uid() = user_id);

create policy "Users can update own generations"
  on public.generations for update using (auth.uid() = user_id);

-- GENERATION QUOTAS
create policy "Users can view own quota"
  on public.generation_quotas for select using (auth.uid() = user_id);

create policy "Studio owners can view member quotas"
  on public.generation_quotas for select using (
    exists (
      select 1 from public.team_members tm
      where tm.owner_id = auth.uid()
        and tm.member_id = generation_quotas.user_id
        and tm.status = 'active'
    )
  );

-- TEAM MEMBERS
create policy "Owners can manage their team"
  on public.team_members for all using (auth.uid() = owner_id);

create policy "Members can view their invites"
  on public.team_members for select using (auth.uid() = member_id);

-- ============================================================
-- STORAGE BUCKETS
-- Run these in the Supabase dashboard SQL editor or via the API
-- after running this migration:
--
-- insert into storage.buckets (id, name, public) values ('inputs', 'inputs', false);
-- insert into storage.buckets (id, name, public) values ('stencils', 'stencils', false);
--
-- Storage RLS (inputs bucket):
-- create policy "Users upload own inputs" on storage.objects
--   for insert with check (bucket_id = 'inputs' and auth.uid()::text = (storage.foldername(name))[1]);
-- create policy "Users read own inputs" on storage.objects
--   for select using (bucket_id = 'inputs' and auth.uid()::text = (storage.foldername(name))[1]);
--
-- Storage RLS (stencils bucket):
-- create policy "Users read own stencils" on storage.objects
--   for select using (bucket_id = 'stencils' and auth.uid()::text = (storage.foldername(name))[1]);
-- ============================================================
