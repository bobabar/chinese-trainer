create table public.billing_customers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  stripe_price_id text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  stripe_event_created bigint not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint subscriptions_status_check check (
    status in (
      'active',
      'canceled',
      'incomplete',
      'incomplete_expired',
      'inactive',
      'past_due',
      'paused',
      'trialing',
      'unpaid'
    )
  )
);

create table public.stripe_webhook_events (
  event_id text primary key,
  event_type text not null,
  event_created bigint not null,
  processed_at timestamptz not null default now()
);

create index subscriptions_customer_idx on public.subscriptions (stripe_customer_id);
create index subscriptions_status_idx on public.subscriptions (status);

alter table public.billing_customers enable row level security;
alter table public.subscriptions enable row level security;
alter table public.stripe_webhook_events enable row level security;

revoke all on public.billing_customers from anon, authenticated;
revoke all on public.subscriptions from anon, authenticated;
revoke all on public.stripe_webhook_events from anon, authenticated;
grant select on public.subscriptions to authenticated;

create policy "Users can read their own subscription"
on public.subscriptions
for select
to authenticated
using ((select auth.uid()) = user_id);

create or replace function public.apply_stripe_subscription_event(
  p_event_id text,
  p_event_type text,
  p_event_created bigint,
  p_user_id uuid,
  p_stripe_customer_id text,
  p_stripe_subscription_id text,
  p_stripe_price_id text,
  p_status text,
  p_current_period_end timestamptz,
  p_cancel_at_period_end boolean
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.stripe_webhook_events (event_id, event_type, event_created)
  values (p_event_id, p_event_type, p_event_created)
  on conflict (event_id) do nothing;

  if not found then
    return false;
  end if;

  insert into public.billing_customers (user_id, stripe_customer_id)
  values (p_user_id, p_stripe_customer_id)
  on conflict (user_id) do update
  set stripe_customer_id = excluded.stripe_customer_id,
      updated_at = now();

  insert into public.subscriptions (
    user_id,
    stripe_customer_id,
    stripe_subscription_id,
    stripe_price_id,
    status,
    current_period_end,
    cancel_at_period_end,
    stripe_event_created
  )
  values (
    p_user_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_stripe_price_id,
    p_status,
    p_current_period_end,
    coalesce(p_cancel_at_period_end, false),
    p_event_created
  )
  on conflict (user_id) do update
  set stripe_customer_id = excluded.stripe_customer_id,
      stripe_subscription_id = excluded.stripe_subscription_id,
      stripe_price_id = excluded.stripe_price_id,
      status = excluded.status,
      current_period_end = excluded.current_period_end,
      cancel_at_period_end = excluded.cancel_at_period_end,
      stripe_event_created = excluded.stripe_event_created,
      updated_at = now()
  where excluded.stripe_event_created >= public.subscriptions.stripe_event_created;

  return true;
end;
$$;

revoke all on function public.apply_stripe_subscription_event(
  text,
  text,
  bigint,
  uuid,
  text,
  text,
  text,
  text,
  timestamptz,
  boolean
) from public, anon, authenticated;
grant execute on function public.apply_stripe_subscription_event(
  text,
  text,
  bigint,
  uuid,
  text,
  text,
  text,
  text,
  timestamptz,
  boolean
) to service_role;
