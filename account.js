(() => {
  "use strict";

  const config = window.CHINESE_TRAINER_CONFIG || {};
  const sessionMarkerKey = `mandarin-trainer-appwrite-session:${config.appwriteProjectId || "default"}`;
  const listeners = new Set();
  const state = {
    ready: false,
    available: false,
    loading: false,
    user: null,
    session: null,
    view: "signin",
    message: "",
    messageType: "",
    busy: false,
  };
  let client = null;
  let account = null;
  let accountButton = null;
  let dialog = null;
  let shellBound = false;
  let initPromise = null;

  const api = {
    bind,
    init,
    open,
    close,
    subscribe,
    getState: () => ({ ...state }),
  };
  window.ChineseTrainerAccount = api;

  function bind() {
    if (shellBound) return;
    shellBound = true;
    accountButton = document.querySelector("#accountTrigger");
    dialog = document.querySelector("#accountDialog");
    bindShell();
    updateAccountButton();
    if (shouldRestoreAccountOnLoad()) {
      void init();
    }
  }

  function shouldRestoreAccountOnLoad() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("account") === "recovery" || (params.has("userId") && params.has("secret"))) {
      return true;
    }
    try {
      return localStorage.getItem(sessionMarkerKey) === "active";
    } catch {
      return false;
    }
  }

  function init() {
    bind();
    if (initPromise) return initPromise;
    state.ready = true;
    state.loading = true;
    updateAccountButton();
    initPromise = initializeAccount();
    return initPromise;
  }

  async function initializeAccount() {
    try {
      await loadAppwriteLibrary();
    } catch {
      state.loading = false;
      state.available = false;
      state.message = "Accounts are temporarily unavailable.";
      state.messageType = "error";
      updateAccountButton();
      renderDialogIfOpen();
      return;
    }
    if (!window.Appwrite?.Client || !window.Appwrite?.Account || !window.Appwrite?.ID || !config.appwriteEndpoint || !config.appwriteProjectId) {
      state.loading = false;
      state.available = false;
      state.message = "Accounts are temporarily unavailable.";
      state.messageType = "error";
      updateAccountButton();
      return;
    }

    state.available = true;
    client = new window.Appwrite.Client()
      .setEndpoint(config.appwriteEndpoint)
      .setProject(config.appwriteProjectId);
    account = new window.Appwrite.Account(client);

    try {
      state.user = await account.get();
      state.session = { provider: "appwrite" };
      rememberSession();
    } catch (error) {
      state.user = null;
      state.session = null;
      forgetSession();
      if (!isUnauthorizedError(error)) {
        setMessage(accountErrorMessage(error), "error");
      }
    }
    state.loading = false;
    updateAccountButton();
    handleAccountReturn();
    notify();
  }

  function loadAppwriteLibrary() {
    if (window.Appwrite?.Client) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-appwrite-client]');
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = "./assets/vendor/appwrite-26.2.0.js";
      script.async = true;
      script.dataset.appwriteClient = "true";
      script.addEventListener("load", resolve, { once: true });
      script.addEventListener("error", reject, { once: true });
      document.head.append(script);
    });
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

  function open(view = "account", message = "") {
    const initialization = init();
    state.view = view === "account" && !state.user ? "signin" : view;
    state.message = message;
    state.messageType = message ? "info" : "";
    renderDialog();
    if (dialog && !dialog.open) dialog.showModal();
    void initialization.then(() => renderDialogIfOpen());
  }

  function close() {
    if (dialog?.open) dialog.close();
  }

  function renderDialogIfOpen() {
    if (dialog?.open) renderDialog();
  }

  function renderDialog() {
    if (!dialog) return;
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
          isReset ? "We will email you a secure recovery link." : "Secure your Mandarin Trainer account.",
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
    dialog.innerHTML = `
      <div class="account-dialog-shell">
        ${dialogHeader("Your account", "Manage sign-in and account settings.")}
        ${messageMarkup()}
        <section class="account-plan">
          <div class="account-plan-heading">
            <span>Free learning</span>
            <strong>${escapeMarkup(state.user.email || "Mandarin Trainer account")}</strong>
          </div>
          <p>Every learning tool is free. Voluntary donations help fund lessons, infrastructure, and wider access.</p>
        </section>
        <div class="account-action-stack">
          <a class="primary-btn account-donation-link" href="${escapeMarkup(config.donationUrl || "https://buy.stripe.com/fZudRa5Ezgu769Y72pdby01")}" target="_blank" rel="noopener noreferrer">Donate with Stripe</a>
          <button class="ghost-btn" type="button" id="signOutAccount" ${state.busy ? "disabled" : ""}>Sign out</button>
        </div>
        <p class="account-security-note">Payments are handled by Stripe. Mandarin Trainer never receives or stores your card details.</p>
      </div>
    `;
    bindDialogCommon();
    dialog.querySelector("#signOutAccount")?.addEventListener("click", signOut);
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
    if (!account || state.busy) return;
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("passwordConfirmation") || "");
    state.busy = true;
    setMessage("", "");
    renderDialog();
    try {
      if (state.view === "reset") {
        const redirectUrl = new URL(window.location.pathname, window.location.origin);
        redirectUrl.searchParams.set("account", "recovery");
        await account.createRecovery({ email, url: redirectUrl.toString() });
        state.busy = false;
        setMessage("Check your email for the secure recovery link.", "success");
        renderDialog();
        return;
      }
      if (state.view === "signup") {
        if (password !== confirmation) throw new Error("The passwords do not match.");
        await account.create({ userId: window.Appwrite.ID.unique(), email, password });
        state.session = await account.createEmailPasswordSession({ email, password });
        state.user = await account.get();
        rememberSession();
        state.busy = false;
        state.view = "account";
        setMessage("Your account is ready.", "success");
        updateAccountButton();
        renderDialog();
        notify();
        return;
      }
      state.session = await account.createEmailPasswordSession({ email, password });
      state.user = await account.get();
      rememberSession();
      state.busy = false;
      updateAccountButton();
      notify();
      close();
    } catch (error) {
      state.busy = false;
      setMessage(accountErrorMessage(error), "error");
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
    const recovery = getRecoveryCredentials();
    if (!recovery || !account) {
      state.busy = false;
      state.view = "reset";
      setMessage("This recovery link is missing or invalid. Request a new one.", "error");
      renderDialog();
      return;
    }
    try {
      await account.updateRecovery({ ...recovery, password });
      state.busy = false;
      state.view = "signin";
      clearRecoveryParameters();
      setMessage("Your password has been updated. Sign in with your new password.", "success");
      renderDialog();
    } catch (error) {
      state.busy = false;
      setMessage(accountErrorMessage(error), "error");
      renderDialog();
    }
  }

  async function signOut() {
    if (!account || state.busy) return;
    state.busy = true;
    renderDialog();
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch (error) {
      state.busy = false;
      setMessage(accountErrorMessage(error), "error");
      renderDialog();
      return;
    }
    state.busy = false;
    state.user = null;
    state.session = null;
    forgetSession();
    updateAccountButton();
    notify();
    close();
  }

  function handleAccountReturn() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("account") !== "recovery") return;
    if (getRecoveryCredentials()) {
      open("recovery");
      return;
    }
    open("reset", "This recovery link is missing or invalid. Request a new one.");
  }

  function getRecoveryCredentials() {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");
    const secret = params.get("secret");
    return userId && secret ? { userId, secret } : null;
  }

  function clearRecoveryParameters() {
    const url = new URL(window.location.href);
    ["account", "userId", "secret"].forEach((name) => url.searchParams.delete(name));
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function rememberSession() {
    try {
      localStorage.setItem(sessionMarkerKey, "active");
    } catch {
      // Appwrite still maintains the secure session when storage is unavailable.
    }
  }

  function forgetSession() {
    try {
      localStorage.removeItem(sessionMarkerKey);
    } catch {
      // Nothing else is required when storage is unavailable.
    }
  }

  function isUnauthorizedError(error) {
    return error?.code === 401 || ["general_unauthorized", "user_unauthorized", "user_session_not_found"].includes(error?.type);
  }

  function accountErrorMessage(error) {
    const messages = {
      user_already_exists: "An account with this email already exists.",
      user_invalid_credentials: "The email or password is incorrect.",
      user_password_mismatch: "The current password is incorrect.",
      user_recovery_token_invalid: "This recovery link is invalid or has expired. Request a new one.",
      general_rate_limit_exceeded: "Too many attempts. Please wait a moment and try again.",
    };
    return messages[error?.type] || error?.message || "The account request could not be completed.";
  }

  function updateAccountButton() {
    if (!accountButton) return;
    const label = accountButton.querySelector(".account-trigger-label");
    if (label) label.textContent = state.loading ? "Account" : state.user ? "Account" : "Sign in";
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
