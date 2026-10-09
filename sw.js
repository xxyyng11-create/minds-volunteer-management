// Network-first: always the newest version when online, cached copy when offline. API (POST) is never cached.
const V = 'minds-v2', SHELL = ['./', './index.html', './config.js', './manifest.json'];
self.addEventListener('install', e => { self.skipWaiting(); e.waitUntil(caches.open(V).then(c => c.addAll(SHELL))); });
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const same = new URL(e.request.url).origin === location.origin;
  e.respondWith((same ? fetch(e.request.url, {cache: 'no-cache'}) : fetch(e.request))
    .then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request)));
});
