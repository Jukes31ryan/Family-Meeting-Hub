// Offline cache for Family Meeting (root page only).
// Sub-apps in folders (game-day/, patrol-kit/, endless-appetizers/) have their own workers; this one ignores them.
const CACHE = "fm-v1";
const CORE = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];
const ROOT = new URL("./", self.location).pathname;
const mine = p => p === ROOT || p === ROOT + "index.html" || (p.startsWith(ROOT) && !p.slice(ROOT.length).includes("/"));
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith("fm-") && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  const fonts = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (url.origin === location.origin && !mine(url.pathname)) return; // leave sub-apps alone
  if (url.origin !== location.origin && !fonts) return;
  if (req.mode === "navigate") {
    e.respondWith(fetch(req, { cache: "no-store" }).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put("./index.html", c)); return r; }).catch(() => caches.match("./index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { if (r.ok || r.type === "opaque") { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); } return r; })));
});
