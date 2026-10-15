const CACHE_NAME = "medibridge-offline-v1";
const OFFLINE_URL = "/en/offline";
const PRIVATE_PATHS = [
  "/api/",
  "/en/dashboard",
  "/en/admin",
  "/en/login",
  "/en/register",
  "/en/quote",
  "/en/reset-password",
  "/en/verify-email",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key.startsWith("medibridge-") && key !== CACHE_NAME)
        .map((key) => caches.delete(key)),
    )),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;
  if (PRIVATE_PATHS.some((path) => url.pathname.startsWith(path))) return;
  if (request.mode !== "navigate") return;

  event.respondWith(
    fetch(request).catch(async () => (await caches.match(OFFLINE_URL)) || Response.error()),
  );
});
