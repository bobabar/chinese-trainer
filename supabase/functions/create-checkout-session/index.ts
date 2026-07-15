import {
  errorResponse,
  getBillingCustomer,
  getPremiumPriceId,
  handleOptions,
  hasPremiumSubscription,
  HttpError,
  jsonResponse,
  requireUser,
  stripeRequest,
  upsertBillingCustomer,
} from "../_shared/server.ts";

Deno.serve(async (req: Request) => {
  try {
    const optionsResponse = handleOptions(req);
    if (optionsResponse) return optionsResponse;
    if (req.method !== "POST") throw new HttpError(405, "Method not allowed.");

    const user = await requireUser(req);
    if (await hasPremiumSubscription(user.id)) {
      throw new HttpError(409, "This account already has Premium access.");
    }

    let customerId = await getBillingCustomer(user.id);
    if (!customerId) {
      const customer = await stripeRequest("customers", {
        method: "POST",
        idempotencyKey: `chinese-trainer-customer-${user.id}`,
        form: {
          email: user.email || "",
          "metadata[supabase_user_id]": user.id,
          "metadata[product]": "chinese_trainer",
        },
      });
      customerId = String(customer.id || "");
      if (!customerId) throw new HttpError(502, "Stripe did not create a customer.");
      await upsertBillingCustomer(user.id, customerId);
    }

    const fiveMinuteWindow = Math.floor(Date.now() / 300000);
    const session = await stripeRequest("checkout/sessions", {
      method: "POST",
      idempotencyKey: `chinese-trainer-checkout-${user.id}-${fiveMinuteWindow}`,
      form: {
        mode: "subscription",
        customer: customerId,
        client_reference_id: user.id,
        success_url: "https://brownsugarboba.com/?billing=success",
        cancel_url: "https://brownsugarboba.com/?billing=canceled",
        "line_items[0][price]": getPremiumPriceId(),
        "line_items[0][quantity]": "1",
        "subscription_data[metadata][supabase_user_id]": user.id,
        "metadata[supabase_user_id]": user.id,
        allow_promotion_codes: "true",
        billing_address_collection: "auto",
      },
    });
    const url = String(session.url || "");
    if (!url) throw new HttpError(502, "Stripe did not return a checkout URL.");
    return jsonResponse(req, { url });
  } catch (error) {
    return errorResponse(req, error);
  }
});
