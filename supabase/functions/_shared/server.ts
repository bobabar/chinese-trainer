const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "https://pdhpqqqkgsurwnzgetnx.supabase.co";
const PUBLIC_API_KEY = "sb_publishable_BuNWavxoX6GlUMz_WYX9KA_j6MRSDbN";
const STRIPE_API_VERSION = "2026-02-25.clover";
const PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);
const ALLOWED_ORIGINS = new Set([
  "https://mandarintrainer.com",
  "https://www.mandarintrainer.com",
  "http://127.0.0.1:4173",
  "http://localhost:4173",
]);

export type AuthUser = {
  id: string;
  email?: string;
};

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.has(origin) ? origin : "https://mandarintrainer.com";
  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

export function handleOptions(req: Request): Response | null {
  if (req.method !== "OPTIONS") return null;
  assertAllowedOrigin(req);
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

export function jsonResponse(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(req),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}

export function errorResponse(req: Request, error: unknown): Response {
  if (error instanceof HttpError) {
    return jsonResponse(req, { error: error.message }, error.status);
  }
  console.error(error);
  return jsonResponse(req, { error: "The billing service could not complete this request." }, 500);
}

export function assertAllowedOrigin(req: Request): void {
  const origin = req.headers.get("origin");
  if (origin && !ALLOWED_ORIGINS.has(origin)) {
    throw new HttpError(403, "This origin is not allowed.");
  }
}

export async function requireUser(req: Request): Promise<AuthUser> {
  assertAllowedOrigin(req);
  const apiKey = req.headers.get("apikey") || "";
  const authorization = req.headers.get("authorization") || "";
  const legacyAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
  if (![PUBLIC_API_KEY, legacyAnonKey].includes(apiKey) || !authorization.startsWith("Bearer ")) {
    throw new HttpError(401, "Sign in to continue.");
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: apiKey,
      authorization,
    },
  });
  if (!response.ok) {
    throw new HttpError(401, "Your session has expired. Sign in again.");
  }
  const user = await response.json();
  if (!user?.id) {
    throw new HttpError(401, "Sign in to continue.");
  }
  return { id: user.id, email: user.email };
}

function serviceRoleKey(): string {
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!key) throw new HttpError(503, "Account billing is not configured yet.");
  return key;
}

export async function serviceRequest(path: string, init: RequestInit = {}): Promise<Response> {
  const key = serviceRoleKey();
  const headers = new Headers(init.headers);
  headers.set("apikey", key);
  headers.set("authorization", `Bearer ${key}`);
  if (init.body && !headers.has("content-type")) headers.set("content-type", "application/json");
  return fetch(`${SUPABASE_URL}${path}`, { ...init, headers });
}

export async function getBillingCustomer(userId: string): Promise<string> {
  const response = await serviceRequest(
    `/rest/v1/billing_customers?select=stripe_customer_id&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );
  if (!response.ok) throw new HttpError(502, "The account record could not be loaded.");
  const rows = await response.json();
  return rows[0]?.stripe_customer_id || "";
}

export async function getBillingUserId(customerId: string): Promise<string> {
  const response = await serviceRequest(
    `/rest/v1/billing_customers?select=user_id&stripe_customer_id=eq.${encodeURIComponent(customerId)}&limit=1`,
  );
  if (!response.ok) throw new HttpError(502, "The billing account could not be resolved.");
  const rows = await response.json();
  return rows[0]?.user_id || "";
}

export async function upsertBillingCustomer(userId: string, customerId: string): Promise<void> {
  const response = await serviceRequest("/rest/v1/billing_customers?on_conflict=user_id", {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify({ user_id: userId, stripe_customer_id: customerId, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new HttpError(502, "The billing account could not be saved.");
}

export async function hasPremiumSubscription(userId: string): Promise<boolean> {
  const response = await serviceRequest(
    `/rest/v1/subscriptions?select=status&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
  );
  if (!response.ok) return false;
  const rows = await response.json();
  return PREMIUM_STATUSES.has(rows[0]?.status || "");
}

export async function stripeRequest(
  path: string,
  options: { method?: string; form?: Record<string, string>; idempotencyKey?: string } = {},
): Promise<Record<string, unknown>> {
  const secretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
  if (!secretKey) throw new HttpError(503, "Premium billing is not configured yet.");
  const headers: HeadersInit = {
    Authorization: `Bearer ${secretKey}`,
    "Stripe-Version": STRIPE_API_VERSION,
  };
  let body: string | undefined;
  if (options.form) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    body = new URLSearchParams(options.form).toString();
  }
  if (options.idempotencyKey) headers["Idempotency-Key"] = options.idempotencyKey;
  const response = await fetch(`https://api.stripe.com/v1/${path.replace(/^\//, "")}`, {
    method: options.method || "GET",
    headers,
    body,
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("Stripe API error", response.status, payload);
    throw new HttpError(response.status >= 500 ? 502 : 400, payload?.error?.message || "Stripe rejected the request.");
  }
  return payload;
}

export async function applySubscriptionEvent(args: Record<string, unknown>): Promise<void> {
  const response = await serviceRequest("/rest/v1/rpc/apply_stripe_subscription_event", {
    method: "POST",
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    console.error("Subscription event failed", response.status, await response.text());
    throw new HttpError(502, "The subscription update could not be stored.");
  }
}

export function getPremiumPriceId(): string {
  const priceId = Deno.env.get("STRIPE_PREMIUM_PRICE_ID") || "";
  if (!priceId) throw new HttpError(503, "Premium billing is not configured yet.");
  return priceId;
}
