
const CACHE_NAME = 'gym-pwa-v1';
const PRECACHE_URLS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "assets/image1.jpeg",
  "assets/image10.gif",
  "assets/image11.gif",
  "assets/image12.gif",
  "assets/image13.gif",
  "assets/image14.gif",
  "assets/image15.gif",
  "assets/image16.gif",
  "assets/image17.gif",
  "assets/image18.gif",
  "assets/image19.gif",
  "assets/image2.jpeg",
  "assets/image20.gif",
  "assets/image21.gif",
  "assets/image22.gif",
  "assets/image23.gif",
  "assets/image24.gif",
  "assets/image25.jpeg",
  "assets/image26.gif",
  "assets/image27.gif",
  "assets/image28.png",
  "assets/image3.gif",
  "assets/image4.jpeg",
  "assets/image5.gif",
  "assets/image6.jpeg",
  "assets/image7.gif",
  "assets/image8.jpeg",
  "assets/image9.gif"
];

// Install: cache essential files for offline
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)).then(self.skipWaiting())
  );
});

// Activate: cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(self.clients.claim())
  );
});

// Fetch: try network first for HTML, fallback to cache; cache-first for assets
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.destination === 'document' || req.headers.get('accept')?.includes('text/html')) {
    // Network-first for HTML
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(r => r || caches.match('index.html')))
    );
    return;
  }

  // Cache-first for other assets
  event.respondWith(
    caches.match(req).then((cached) => cached || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      return res;
    }))
  );
});
