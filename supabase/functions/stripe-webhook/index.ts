import {
  applySubscriptionEvent,
  getBillingUserId,
  HttpError,
  stripeRequest,
  upsertBillingCustomer,
} from "../_shared/server.ts";

const SIGNATURE_TOLERANCE_SECONDS = 300;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  try {
    const payload = await req.text();
    await verifyStripeSignature(payload, req.headers.get("stripe-signature") || "");
    const event = JSON.parse(payload);
    await processStripeEvent(event);
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error(error);
    const status = error instanceof HttpError ? error.status : 400;
    const message = error instanceof Error ? error.message : "Invalid webhook.";
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }
});

async function processStripeEvent(event: Record<string, any>): Promise<void> {
  const type = String(event.type || "");
  if (type === "checkout.session.completed") {
    const session = event.data?.object || {};
    const userId = String(session.client_reference_id || session.metadata?.supabase_user_id || "");
    const customerId = String(session.customer || "");
    const subscriptionId = String(session.subscription || "");
    if (userId && customerId) await upsertBillingCustomer(userId, customerId);
    if (userId && subscriptionId) {
      const subscription = await stripeRequest(`subscriptions/${encodeURIComponent(subscriptionId)}`);
      await storeSubscription(event, subscription, userId);
    }
    return;
  }

  if ([
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "customer.subscription.paused",
    "customer.subscription.resumed",
  ].includes(type)) {
    const subscription = event.data?.object || {};
    const customerId = String(subscription.customer || "");
    const userId = String(subscription.metadata?.supabase_user_id || "") || await getBillingUserId(customerId);
    if (userId) await storeSubscription(event, subscription, userId);
  }
}

async function storeSubscription(
  event: Record<string, any>,
  subscription: Record<string, any>,
  userId: string,
): Promise<void> {
  const customerId = String(subscription.customer || "");
  if (!customerId || !subscription.id) throw new HttpError(400, "Subscription metadata is incomplete.");
  const items = Array.isArray(subscription.items?.data) ? subscription.items.data : [];
  const periodEndEpoch = Number(
    subscription.current_period_end ||
    Math.max(0, ...items.map((item: Record<string, any>) => Number(item.current_period_end) || 0)),
  );
  const status = String(subscription.status || (event.type === "customer.subscription.deleted" ? "canceled" : "inactive"));
  await applySubscriptionEvent({
    p_event_id: String(event.id || ""),
    p_event_type: String(event.type || ""),
    p_event_created: Number(event.created) || Math.floor(Date.now() / 1000),
    p_user_id: userId,
    p_stripe_customer_id: customerId,
    p_stripe_subscription_id: String(subscription.id),
    p_stripe_price_id: String(items[0]?.price?.id || ""),
    p_status: status,
    p_current_period_end: periodEndEpoch ? new Date(periodEndEpoch * 1000).toISOString() : null,
    p_cancel_at_period_end: Boolean(subscription.cancel_at_period_end),
  });
}

async function verifyStripeSignature(payload: string, signatureHeader: string): Promise<void> {
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
  if (!webhookSecret) throw new HttpError(503, "Webhook verification is not configured.");
  const entries = signatureHeader.split(",").map((entry) => entry.trim().split("=", 2));
  const timestamp = Number(entries.find(([key]) => key === "t")?.[1] || 0);
  const signatures = entries.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !signatures.length || Math.abs(Math.floor(Date.now() / 1000) - timestamp) > SIGNATURE_TOLERANCE_SECONDS) {
    throw new HttpError(400, "Invalid Stripe signature timestamp.");
  }
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${timestamp}.${payload}`));
  const expected = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  if (!signatures.some((signature) => timingSafeEqual(signature, expected))) {
    throw new HttpError(400, "Invalid Stripe signature.");
  }
}

function timingSafeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}
