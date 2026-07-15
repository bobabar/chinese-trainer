import {
  errorResponse,
  getBillingCustomer,
  handleOptions,
  HttpError,
  jsonResponse,
  requireUser,
  stripeRequest,
} from "../_shared/server.ts";

Deno.serve(async (req: Request) => {
  try {
    const optionsResponse = handleOptions(req);
    if (optionsResponse) return optionsResponse;
    if (req.method !== "POST") throw new HttpError(405, "Method not allowed.");

    const user = await requireUser(req);
    const customerId = await getBillingCustomer(user.id);
    if (!customerId) throw new HttpError(404, "This account does not have a billing profile yet.");
    const configurationId = Deno.env.get("STRIPE_PORTAL_CONFIGURATION_ID") || "";
    if (!configurationId) throw new HttpError(503, "Premium billing is not configured yet.");
    const session = await stripeRequest("billing_portal/sessions", {
      method: "POST",
      form: {
        customer: customerId,
        configuration: configurationId,
        return_url: "https://brownsugarboba.com/",
      },
    });
    const url = String(session.url || "");
    if (!url) throw new HttpError(502, "Stripe did not return a billing portal URL.");
    return jsonResponse(req, { url });
  } catch (error) {
    return errorResponse(req, error);
  }
});
