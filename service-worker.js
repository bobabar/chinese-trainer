"use strict";

const APP_CACHE_PREFIX = "chinese-trainer-shell-";
const APP_CACHE_NAME = `${APP_CACHE_PREFIX}__BUILD_HASH__`;
const APP_SHELL_URLS = [
  "./",
  "./index.html",
  "./styles.css",
  "./modern.css",
  "./app-config.js",
  "./account.js",
  "./app.js",
  "./vocab-data.js",
  "./grammar-data.js",
  "./exam-data.js",
  "./reader-data.js",
  "./china-map-data.js",
  "./sentence-data.js",
  "./word-data.js",
  "./manifest.webmanifest",
  "./assets/logo-mandarin.svg",
  "./assets/logo-mandarin.png",
  "./assets/panda-mascot.png",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/apple-touch-icon.png",
  "./assets/vendor/supabase-2.110.5.js",
  "./assets/vendor/SUPABASE-LICENSE.txt",
  "./assets/exam/hsk-scenes-1.webp",
  "./assets/exam/hsk-scenes-2.webp",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(APP_CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_URLS)),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(
        names
          .filter((name) => name.startsWith(APP_CACHE_PREFIX) && name !== APP_CACHE_NAME)
          .map((name) => caches.delete(name)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    request.mode === "navigate"
      ? handleNavigationRequest(request)
      : handleAssetRequest(request),
  );
});

async function handleNavigationRequest(request) {
  const cache = await caches.open(APP_CACHE_NAME);
  const indexRequest = new Request(new URL("./index.html", self.registration.scope));
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(indexRequest, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(indexRequest)) || Response.error();
  }
}

async function handleAssetRequest(request) {
  const cache = await caches.open(APP_CACHE_NAME);
  const url = new URL(request.url);
  const exactMatch = await cache.match(request);
  if (exactMatch) {
    return exactMatch;
  }

  try {
    const response = await fetch(request);
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    url.search = "";
    url.hash = "";
    return (await cache.match(new Request(url))) || Response.error();
  }
}
