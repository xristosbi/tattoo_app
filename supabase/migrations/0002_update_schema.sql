-- ============================================================
-- MIGRATION 0002: New subscription tiers + profile-based quota
-- ============================================================

-- Add new tier values to the enum
alter type public.subscription_tier add value if not exists 'starter';
alter type public.subscription_tier add value if not exists 'plus';
alter type public.subscription_tier add value if not exists 'professional';

-- Add quota + tier fields to profiles
alter table public.profiles
  add column if not exists subscription_tier public.subscription_tier not null default 'free',
  add column if not exists generations_used   integer not null default 0,
  add column if not exists generations_limit  integer not null default 3,
  add column if not exists generations_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month');

-- Backfill existing users from subscriptions + generation_quotas
update public.profiles p
set
  subscription_tier = coalesce(s.tier, 'free'),
  generations_used  = coalesce(q.count, 0),
  generations_limit = case coalesce(s.tier, 'free')
    when 'free'   then 3
    when 'starter' then 20
    when 'plus'   then 60
    when 'pro'    then 100
    when 'professional' then 999999
    when 'studio' then 999999
    else 3
  end,
  generations_reset_at = coalesce(q.period_end, date_trunc('month', now()) + interval '1 month')
from
  public.subscriptions s,
  public.generation_quotas q
where s.user_id = p.id
  and q.user_id = p.id;

-- Atomic increment on profiles
create or replace function public.increment_profile_generation_count(p_user_id uuid)
returns void language plpgsql security definer set search_path = public
as $$
begin
  update public.profiles
  set generations_used = generations_used + 1, updated_at = now()
  where id = p_user_id;
end;
$$;

-- Update handle_new_user to also set profile quota defaults
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
declare
  v_period_start timestamptz := date_trunc('month', now());
  v_period_end   timestamptz := date_trunc('month', now()) + interval '1 month';
begin
  insert into public.profiles (id, email, full_name, subscription_tier, generations_used, generations_limit, generations_reset_at)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'free',
    0,
    3,
    v_period_end
  );

  insert into public.subscriptions (user_id, tier, status)
  values (new.id, 'free', 'active');

  insert into public.generation_quotas (user_id, count, period_start, period_end)
  values (new.id, 0, v_period_start, v_period_end);

  return new;
end;
$$;
