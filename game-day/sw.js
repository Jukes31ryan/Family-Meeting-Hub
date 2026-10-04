/* Game Day service worker — offline app shell.
   Bump CACHE on every release: the name is the version, and a new name is
   what evicts the old files and tells open tabs an update is waiting. */
const CACHE = 'game-day-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png'
];

/* Other apps live on this same origin (jukes31ryan.github.io), and cache
   storage is shared by the whole origin, not per app. So this worker only ever
   cleans up its own old caches, and leaves requests outside its own folder to
   whoever owns them. */
const FAMILY = [CACHE.replace(/-v\d+$/, '-v')];
const HOME = new URL('./', self.registration.scope).pathname;
function mine(url) {
  const u = new URL(url);
  if (u.origin !== self.location.origin || u.pathname.indexOf(HOME) !== 0) return false;
  return u.pathname.slice(HOME.length).indexOf('/') < 0;
}

self.addEventListener('install', e => {
  e.waitUntil(
    // No skipWaiting here on purpose: the new worker waits until the user
    // taps "update", so a release never reloads the page mid-sentence.
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))
  );
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(k => k !== CACHE && FAMILY.some(f => k.indexOf(f) === 0))
        .map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !mine(req.url)) return;

  // Navigations: network first, fall back to the cached shell so it opens offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put('./index.html', copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.open(CACHE).then(c => c.match('./index.html').then(r => r || c.match('./'))))
    );
    return;
  }

  // Everything else (icons, fonts): cache first, then network, then cache the result.
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res && (res.status === 200 || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() => hit))
  );
});
