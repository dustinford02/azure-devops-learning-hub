const CACHE_NAME = "ado-learning-hub-v9";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./content.js",
  "./catalog-snapshot.js",
  "./mindmaps.js",
  "./learning-aids.js",
  "./workflows/workflow-1-restaurant-order.jpg",
  "./workflows/workflow-2-building-a-house.jpg",
  "./workflows/workflow-3-training-course.jpg",
  "./guided-path/step-01-program-brief.jpg",
  "./guided-path/step-02-project-access.jpg",
  "./guided-path/step-03-project-setup.jpg",
  "./guided-path/step-04-access-review.jpg",
  "./guided-path/step-05-delivery-plan.jpg",
  "./guided-path/step-06-engineering-handoff.jpg",
  "./guided-path/step-07-release-control.jpg",
  "./guided-path/step-08-personal-setup.jpg",
  "./guided-path/step-09-tool-navigation.jpg",
  "./guided-path/step-10-incident-triage.jpg",
  "./guided-path/step-11-quality-and-evidence.jpg",
  "./guided-path/step-12-platform-edges.jpg",
  "./app.js",
  "./DevOps_Identity_and_Governance_Map.png",
  "./manifest.webmanifest",
  "./icon.svg"
];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put("./index.html", copy));
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      }
      return response;
    }))
  );
});
