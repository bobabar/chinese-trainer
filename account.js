(() => {
  "use strict";

  const PREMIUM_STATUSES = new Set(["active", "trialing", "past_due"]);
  const config = window.CHINESE_TRAINER_CONFIG || {};
  const listeners = new Set();
  const state = {
    ready: false,
    available: false,
    loading: true,
    user: null,
    session: null,
    subscription: null,
    view: "signin",
    message: "",
    messageType: "",
    busy: false,
  };
  let client = null;
  let accountButton = null;
  let dialog = null;

  const api = {
    init,
    open,
    close,
    subscribe,
    getState: () => ({ ...state, isPremium: isPremium() }),
    isPremium,
    requirePremium,
    refreshSubscription,
  };
  window.ChineseTrainerAccount = api;

  async function init() {
    if (state.ready) return;
    state.ready = true;
    accountButton = document.querySelector("#accountTrigger");
    dialog = document.querySelector("#accountDialog");
    bindShell();

    if (!window.supabase?.createClient || !config.supabaseUrl || !config.supabasePublishableKey) {
      state.loading = false;
      state.available = false;
      state.message = "Accounts are temporarily unavailable.";
      state.messageType = "error";
      updateAccountButton();
      return;
    }

    state.available = true;
    client = window.supabase.createClient(config.supabaseUrl, config.supabasePublishableKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
    });

    client.auth.onAuthStateChange((event, session) => {
      window.setTimeout(async () => {
        state.session = session || null;
        state.user = session?.user || null;
        if (event === "PASSWORD_RECOVERY") state.view = "recovery";
        if (state.user) await refreshSubscription();
        else state.subscription = null;
        state.loading = false;
        updateAccountButton();
        renderDialogIfOpen();
        notify();
      }, 0);
    });

    const { data, error } = await client.auth.getSession();
    if (error) setMessage(error.message, "error");
    state.session = data?.session || null;
    state.user = data?.session?.user || null;
    if (state.user) await refreshSubscription();
    state.loading = false;
    updateAccountButton();
    await handleBillingReturn();
    notify();
  }

  function bindShell() {
    accountButton?.addEventListener("click", () => open(state.user ? "account" : "signin"));
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });
    dialog?.addEventListener("close", () => {
      state.message = "";
      state.messageType = "";
    });
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function notify() {
    const snapshot = api.getState();
    listeners.forEach((listener) => listener(snapshot));
    window.dispatchEvent(new CustomEvent("chinese-trainer-account-change", { detail: snapshot }));
  }

  function isPremium() {
    return PREMIUM_STATUSES.has(state.subscription?.status || "");
  }

  function requirePremium(reason = "Unlock this Premium feature.") {
    if (isPremium()) return true;
    open("premium", reason);
    return false;
  }

  function open(view = "account", message = "") {
    state.view = view === "account" && !state.user ? "signin" : view;
    state.message = message;
    state.messageType = message ? "info" : "";
    renderDialog();
    if (dialog && !dialog.open) dialog.showModal();
  }

  function close() {
    if (dialog?.open) dialog.close();
  }

  function renderDialogIfOpen() {
    if (dialog?.open) renderDialog();
  }

  function renderDialog() {
    if (!dialog) return;
    if (state.view === "premium") {
      renderPremiumView();
      return;
    }
    if (state.view === "recovery") {
      renderRecoveryView();
      return;
    }
    if (state.user) {
      renderAccountView();
      return;
    }
    renderAuthView();
  }

  function dialogHeader(title, copy) {
    return `
      <header class="account-dialog-header">
        <div><h2>${escapeMarkup(title)}</h2><p>${escapeMarkup(copy)}</p></div>
        <button class="icon-btn account-dialog-close" type="button" data-account-close aria-label="Close">
          <svg class="button-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"></path></svg>
        </button>
      </header>
    `;
  }

  function renderAuthView() {
    const isSignup = state.view === "signup";
    const isReset = state.view === "reset";
    dialog.innerHTML = `
      <div class="account-dialog-shell">
        ${dialogHeader(
          isReset ? "Reset your password" : isSignup ? "Create your account" : "Welcome back",
          isReset ? "We will email you a secure recovery link." : "Keep Premium access tied securely to your Chinese Trainer account.",
        )}
        ${isReset ? "" : `
          <div class="account-auth-tabs" role="tablist" aria-label="Account action">
            <button type="button" role="tab" data-auth-view="signin" aria-selected="${!isSignup}" class="${!isSignup ? "active" : ""}">Sign in</button>
            <button type="button" role="tab" data-auth-view="signup" aria-selected="${isSignup}" class="${isSignup ? "active" : ""}">Create account</button>
          </div>
        `}
        ${messageMarkup()}
        <form class="account-form" id="accountAuthForm">
          <label><span>Email</span><input type="email" name="email" autocomplete="email" required></label>
          ${isReset ? "" : `
            <label><span>Password</span><input type="password" name="password" autocomplete="${isSignup ? "new-password" : "current-password"}" minlength="8" required></label>
            ${isSignup ? `<label><span>Confirm password</span><input type="password" name="passwordConfirmation" autocomplete="new-password" minlength="8" required></label>` : ""}
          `}
          <button class="primary-btn account-submit" type="submit" ${state.busy ? "disabled" : ""}>
            ${state.busy ? "Please wait…" : isReset ? "Send recovery email" : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>
        <div class="account-form-footer">
          ${isReset
            ? `<button type="button" class="text-button" data-auth-view="signin">Back to sign in</button>`
            : isSignup
              ? ""
              : `<button type="button" class="text-button" data-auth-view="reset">Forgot password?</button>`}
        </div>
      </div>
    `;
    bindDialogCommon();
    dialog.querySelector("#accountAuthForm")?.addEventListener("submit", submitAuthForm);
  }

  function renderAccountView() {
    const premium = isPremium();
    const periodEnd = state.subscription?.current_period_end
      ? new Date(state.subscription.current_period_end).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })
      : "";
    dialog.innerHTML = `
      <div class="account-dialog-shell">
        ${dialogHeader("Your account", "Manage access and billing without leaving your learning history behind.")}
        ${messageMarkup()}
        <section class="account-plan ${premium ? "is-premium" : ""}">
          <div class="account-plan-heading">
            <span>${premium ? "Premium" : "Free plan"}</span>
            <strong>${escapeMarkup(state.user.email || "Chinese Trainer account")}</strong>
          </div>
          <p>${premium
            ? `All mock exams and every graded reader are unlocked${periodEnd ? ` through ${escapeMarkup(periodEnd)}` : ""}.`
            : "Includes New HSK 1 practice and the complete HSK 1 reader shelf."}</p>
        </section>
        <div class="account-action-stack">
          ${premium
            ? `<button class="secondary-btn" type="button" id="manageBilling" ${state.busy ? "disabled" : ""}>Manage billing</button>`
            : `<button class="primary-btn" type="button" id="openPremium">Upgrade to Premium</button>`}
          <button class="ghost-btn" type="button" id="signOutAccount" ${state.busy ? "disabled" : ""}>Sign out</button>
        </div>
        <p class="account-security-note">Payments are handled by Stripe. Chinese Trainer never receives or stores your card details.</p>
      </div>
    `;
    bindDialogCommon();
    dialog.querySelector("#openPremium")?.addEventListener("click", () => open("premium"));
    dialog.querySelector("#manageBilling")?.addEventListener("click", openBillingPortal);
    dialog.querySelector("#signOutAccount")?.addEventListener("click", signOut);
  }

  function renderPremiumView() {
    dialog.innerHTML = `
      <div class="account-dialog-shell premium-dialog-shell">
        ${dialogHeader("Chinese Trainer Premium", "Move beyond the foundation with complete exam and reading practice.")}
        ${messageMarkup()}
        <div class="premium-price"><strong>${escapeMarkup(config.premiumPriceLabel || "$9 / month")}</strong><span>Cancel anytime in the secure billing portal</span></div>
        <div class="premium-comparison" aria-label="Premium features">
          <div><span>Mock exams</span><strong>New HSK 1, 2 and 3</strong></div>
          <div><span>Graded readers</span><strong>Complete HSK 1–3 shelf</strong></div>
          <div><span>Account access</span><strong>Premium follows your sign-in</strong></div>
        </div>
        <button class="primary-btn premium-checkout" type="button" id="premiumCheckout" ${state.busy ? "disabled" : ""}>
          ${state.busy ? "Opening secure checkout…" : state.user ? "Upgrade with Stripe" : "Create an account to upgrade"}
        </button>
        ${state.user ? `<button class="text-button premium-account-back" type="button" data-auth-view="account">Back to account</button>` : ""}
        <p class="account-security-note">New HSK 1 and the HSK 1 reader shelf remain free. Checkout opens on Stripe’s secure website.</p>
      </div>
    `;
    bindDialogCommon();
    dialog.querySelector("#premiumCheckout")?.addEventListener("click", () => {
      if (!state.user) {
        state.view = "signup";
        state.message = "Create an account first, then Premium will stay linked to it.";
        state.messageType = "info";
        renderDialog();
        return;
      }
      startCheckout();
    });
  }

  function renderRecoveryView() {
    dialog.innerHTML = `
      <div class="account-dialog-shell">
        ${dialogHeader("Choose a new password", "Use at least eight characters.")}
        ${messageMarkup()}
        <form class="account-form" id="accountRecoveryForm">
          <label><span>New password</span><input type="password" name="password" autocomplete="new-password" minlength="8" required></label>
          <label><span>Confirm password</span><input type="password" name="passwordConfirmation" autocomplete="new-password" minlength="8" required></label>
          <button class="primary-btn account-submit" type="submit" ${state.busy ? "disabled" : ""}>Update password</button>
        </form>
      </div>
    `;
    bindDialogCommon();
    dialog.querySelector("#accountRecoveryForm")?.addEventListener("submit", updatePassword);
  }

  function bindDialogCommon() {
    dialog.querySelectorAll("[data-account-close]").forEach((button) => button.addEventListener("click", close));
    dialog.querySelectorAll("[data-auth-view]").forEach((button) => {
      button.addEventListener("click", () => {
        const nextView = button.dataset.authView;
        state.view = nextView === "account" && !state.user ? "signin" : nextView;
        state.message = "";
        state.messageType = "";
        renderDialog();
      });
    });
  }

  async function submitAuthForm(event) {
    event.preventDefault();
    if (!client || state.busy) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("passwordConfirmation") || "");
    state.busy = true;
    setMessage("", "");
    renderDialog();
    try {
      if (state.view === "reset") {
        const redirectTo = `${window.location.origin}${window.location.pathname}?account=recovery`;
        const { error } = await client.auth.resetPasswordForEmail(email, { redirectTo });
        if (error) throw error;
        state.busy = false;
        setMessage("Check your email for the secure recovery link.", "success");
        renderDialog();
        return;
      }
      if (state.view === "signup") {
        if (password !== confirmation) throw new Error("The passwords do not match.");
        const emailRedirectTo = `${window.location.origin}${window.location.pathname}`;
        const { data, error } = await client.auth.signUp({ email, password, options: { emailRedirectTo } });
        if (error) throw error;
        state.busy = false;
        if (!data.session) {
          setMessage("Account created. Check your email to confirm your address, then sign in.", "success");
          state.view = "signin";
          renderDialog();
        }
        return;
      }
      const { error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      state.busy = false;
      close();
    } catch (error) {
      state.busy = false;
      setMessage(error?.message || "The account request could not be completed.", "error");
      renderDialog();
    }
  }

  async function updatePassword(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("passwordConfirmation") || "");
    if (password !== confirmation) {
      setMessage("The passwords do not match.", "error");
      renderDialog();
      return;
    }
    state.busy = true;
    renderDialog();
    const { error } = await client.auth.updateUser({ password });
    state.busy = false;
    if (error) {
      setMessage(error.message, "error");
      renderDialog();
      return;
    }
    state.view = "account";
    setMessage("Your password has been updated.", "success");
    renderDialog();
  }

  async function signOut() {
    if (!client || state.busy) return;
    state.busy = true;
    renderDialog();
    const { error } = await client.auth.signOut();
    state.busy = false;
    if (error) {
      setMessage(error.message, "error");
      renderDialog();
      return;
    }
    close();
  }

  async function refreshSubscription() {
    if (!client || !state.user) {
      state.subscription = null;
      return null;
    }
    const { data, error } = await client
      .from("subscriptions")
      .select("status,current_period_end,cancel_at_period_end,stripe_price_id,updated_at")
      .eq("user_id", state.user.id)
      .maybeSingle();
    if (error) {
      console.warn("Subscription refresh failed", error.message);
      state.subscription = null;
      return null;
    }
    state.subscription = data || null;
    updateAccountButton();
    notify();
    return state.subscription;
  }

  async function startCheckout() {
    if (!client || !state.user || state.busy) return;
    state.busy = true;
    setMessage("", "");
    renderDialog();
    const { data, error } = await client.functions.invoke("create-checkout-session", { body: {} });
    if (error || !data?.url) {
      state.busy = false;
      setMessage(await functionErrorMessage(error, data), "error");
      renderDialog();
      return;
    }
    window.location.assign(data.url);
  }

  async function openBillingPortal() {
    if (!client || !state.user || state.busy) return;
    state.busy = true;
    setMessage("", "");
    renderDialog();
    const { data, error } = await client.functions.invoke("create-portal-session", { body: {} });
    if (error || !data?.url) {
      state.busy = false;
      setMessage(await functionErrorMessage(error, data), "error");
      renderDialog();
      return;
    }
    window.location.assign(data.url);
  }

  async function functionErrorMessage(error, data) {
    if (data?.error) return data.error;
    try {
      const payload = await error?.context?.json?.();
      if (payload?.error) return payload.error;
    } catch {
      // Fall back to the client error below.
    }
    return error?.message || "Premium billing is not available yet.";
  }

  async function handleBillingReturn() {
    const params = new URLSearchParams(window.location.search);
    const billing = params.get("billing");
    const account = params.get("account");
    if (account === "recovery") open("recovery");
    if (!billing) return;
    params.delete("billing");
    const nextUrl = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    window.history.replaceState({}, "", nextUrl);
    if (billing === "canceled") {
      open(state.user ? "premium" : "signin", "Checkout was canceled. Nothing was charged.");
      return;
    }
    if (!state.user) {
      open("signin", "Sign in to refresh the Premium access linked to your payment.");
      return;
    }
    open("account", "Payment received. Premium access is being confirmed.");
    for (let attempt = 0; attempt < 6 && !isPremium(); attempt += 1) {
      await refreshSubscription();
      if (!isPremium()) await new Promise((resolve) => window.setTimeout(resolve, 1500));
    }
    setMessage(isPremium() ? "Premium is active on this account." : "Payment is processing. Refresh your account shortly.", isPremium() ? "success" : "info");
    renderDialogIfOpen();
  }

  function updateAccountButton() {
    if (!accountButton) return;
    const label = accountButton.querySelector(".account-trigger-label");
    const badge = accountButton.querySelector(".account-trigger-badge");
    if (label) label.textContent = state.loading ? "Account" : state.user ? (isPremium() ? "Premium" : "Account") : "Sign in";
    if (badge) badge.hidden = !isPremium();
    accountButton.classList.toggle("is-premium", isPremium());
    accountButton.setAttribute("aria-label", state.user ? `Open account for ${state.user.email || "signed-in user"}` : "Sign in or create an account");
  }

  function messageMarkup() {
    if (!state.message) return "";
    return `<p class="account-message is-${escapeMarkup(state.messageType || "info")}" role="status">${escapeMarkup(state.message)}</p>`;
  }

  function setMessage(message, type = "info") {
    state.message = message || "";
    state.messageType = message ? type : "";
  }

  function escapeMarkup(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
