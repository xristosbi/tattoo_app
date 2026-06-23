import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import stripe from '@/lib/stripe/client'
import { createAdminClient } from '@/lib/supabase/server'
import type { SubscriptionTier } from '@/types'

export const dynamic = 'force-dynamic'

function tierFromPriceId(priceId: string | null): SubscriptionTier {
  if (!priceId) return 'free'
  if (priceId === process.env.STRIPE_STUDIO_PRICE_ID) return 'studio'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'free'
}

async function getUserIdFromCustomer(
  supabase: ReturnType<typeof createAdminClient>,
  stripeCustomerId: string
): Promise<string | null> {
  const { data } = await supabase
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()
  return data?.user_id ?? null
}

async function resetQuota(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  periodStart: number,
  periodEnd: number
) {
  await supabase
    .from('generation_quotas')
    .update({
      count: 0,
      period_start: new Date(periodStart * 1000).toISOString(),
      period_end: new Date(periodEnd * 1000).toISOString(),
    })
    .eq('user_id', userId)
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Webhook error'
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode !== 'subscription') break

        const userId = session.client_reference_id
        if (!userId) break

        const stripeCustomerId = session.customer as string
        const stripeSubscriptionId = session.subscription as string

        const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId)
        const priceId = subscription.items.data[0]?.price.id ?? null
        const tier = tierFromPriceId(priceId)

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: stripeSubscriptionId,
            stripe_price_id: priceId,
            tier,
            status: subscription.status as SubscriptionTier,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
          { onConflict: 'user_id' }
        )

        await resetQuota(
          supabase,
          userId,
          subscription.current_period_start,
          subscription.current_period_end
        )
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string
        const userId = await getUserIdFromCustomer(supabase, stripeCustomerId)
        if (!userId) break

        const priceId = subscription.items.data[0]?.price.id ?? null
        const tier = tierFromPriceId(priceId)

        await supabase.from('subscriptions').upsert(
          {
            user_id: userId,
            stripe_customer_id: stripeCustomerId,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            tier,
            status: subscription.status as SubscriptionTier,
            current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
          },
          { onConflict: 'user_id' }
        )
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const stripeCustomerId = subscription.customer as string
        const userId = await getUserIdFromCustomer(supabase, stripeCustomerId)
        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({
            tier: 'free',
            status: 'canceled',
            stripe_subscription_id: null,
            stripe_price_id: null,
            cancel_at_period_end: false,
          })
          .eq('user_id', userId)

        // Revoke all team members
        await supabase
          .from('team_members')
          .update({ status: 'revoked' })
          .eq('owner_id', userId)
          .eq('status', 'active')
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string
        const userId = await getUserIdFromCustomer(supabase, stripeCustomerId)
        if (!userId) break

        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription as string
          )
          await resetQuota(
            supabase,
            userId,
            subscription.current_period_start,
            subscription.current_period_end
          )
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const stripeCustomerId = invoice.customer as string
        const userId = await getUserIdFromCustomer(supabase, stripeCustomerId)
        if (!userId) break

        await supabase
          .from('subscriptions')
          .update({ status: 'past_due' })
          .eq('user_id', userId)
        break
      }

      default:
        break
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err)
    return NextResponse.json({ error: 'Handler error' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
