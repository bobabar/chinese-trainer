"use strict";

if (window.self !== window.top) {
  document.documentElement.style.display = "none";
  try {
    window.top.location.replace(window.location.href);
  } catch {
    // Cross-origin parents cannot be navigated without browser permission.
  }
}
