// CitizenAIR Service Worker for offline functionality and caching
const CACHE_NAME = "citizenair-v1";
const STATIC_CACHE = "citizenair-static-v1";
const DATA_CACHE = "citizenair-data-v1";

// Assets to cache for offline use
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/favicon.png",
  "/manifest.json",
  // Add your main JS/CSS bundles here when built
];

// API endpoints to cache
const DATA_ENDPOINTS = [
  "/926-amphoe-1.csv",
  "/thai-boundary.geojson",
  // Add other data endpoints
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing CitizenAIR Service Worker");

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DATA_CACHE).then((cache) => {
        console.log("[SW] Caching data endpoints");
        return cache.addAll(DATA_ENDPOINTS);
      }),
    ])
  );

  // Force activation of new service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating CitizenAIR Service Worker");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
            console.log("[SW] Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );

  // Take control of all pages
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (request.method === "GET") {
    // Handle static assets
    if (STATIC_ASSETS.some((asset) => url.pathname.endsWith(asset))) {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request);
        })
      );
      return;
    }

    // Handle data files (CSV, GeoJSON)
    if (request.url.includes(".csv") || request.url.includes(".geojson")) {
      event.respondWith(
        caches.open(DATA_CACHE).then((cache) => {
          return cache.match(request).then((response) => {
            if (response) {
              // Serve from cache
              return response;
            }

            // Fetch and cache
            return fetch(request).then((fetchResponse) => {
              if (fetchResponse.status === 200) {
                cache.put(request, fetchResponse.clone());
              }
              return fetchResponse;
            });
          });
        })
      );
      return;
    }

    // Handle API requests with network-first strategy
    if (request.url.includes("/api/")) {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // If online, cache the response
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(DATA_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            return response;
          })
          .catch(() => {
            // If offline, serve from cache
            return caches.match(request);
          })
      );
      return;
    }

    // Handle navigation requests
    if (request.mode === "navigate") {
      event.respondWith(
        fetch(request).catch(() => {
          return caches.match("/index.html");
        })
      );
      return;
    }
  }

  // Default: try network first, fall back to cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background sync for data updates
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync-air-quality") {
    console.log("[SW] Background syncing air quality data");
    event.waitUntil(
      // Update air quality data in background
      updateAirQualityData()
    );
  }
});

// Push notifications (for air quality alerts)
self.addEventListener("push", (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/favicon.png",
      badge: "/favicon.png",
      tag: "air-quality-alert",
      requireInteraction: true,
      actions: [
        {
          action: "view",
          title: "ดูรายละเอียด",
        },
        {
          action: "dismiss",
          title: "ปิด",
        },
      ],
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "view") {
    event.waitUntil(self.clients.openWindow("/"));
  }
});

// Helper function to update air quality data
async function updateAirQualityData() {
  try {
    const cache = await caches.open(DATA_CACHE);
    const dataEndpoints = ["/926-amphoe-1.csv"];

    for (const endpoint of dataEndpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.status === 200) {
          await cache.put(endpoint, response);
          console.log(`[SW] Updated cache for ${endpoint}`);
        }
      } catch (error) {
        console.log(`[SW] Failed to update ${endpoint}:`, error);
      }
    }
  } catch (error) {
    console.log("[SW] Background sync failed:", error);
  }
}
