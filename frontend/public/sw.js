// Service Worker for Airbnb Clone PWA
const CACHE_NAME = 'airbnb-clone-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const OFFLINE_PAGE = '/offline.html';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/logo192.png',
  '/logo512.png',
  '/favicon.ico',
  '/offline.html'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Static files cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static files:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (url.pathname === '/') {
    // Homepage - cache first, then network
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/static/') || url.pathname.startsWith('/manifest') || url.pathname.endsWith('.png') || url.pathname.endsWith('.ico')) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (url.pathname.startsWith('/api/')) {
    // API requests - network first, then cache
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  } else {
    // Other pages - network first, then cache
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
  }
});

// Cache first strategy
async function cacheFirst(request, cacheName) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.error('Cache first strategy failed:', error);
    return getOfflinePage();
  }
}

// Network first strategy
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If it's a page request, return offline page
    if (request.destination === 'document') {
      return getOfflinePage();
    }
    
    // For other requests, return a fallback
    return new Response('Network error', { status: 503 });
  }
}

// Get offline page
async function getOfflinePage() {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const offlineResponse = await cache.match(OFFLINE_PAGE);
    if (offlineResponse) {
      return offlineResponse;
    }
  } catch (error) {
    console.error('Failed to get offline page:', error);
  }
  
  // Fallback offline page
  return new Response(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>Offline - Airbnb Clone</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
          text-align: center;
        }
        .offline-content {
          max-width: 500px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; margin-bottom: 2rem; opacity: 0.9; }
        .retry-btn {
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .retry-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }
      </style>
    </head>
    <body>
      <div class="offline-content">
        <h1>🌐 You're Offline</h1>
        <p>It looks like you've lost your internet connection. Don't worry, you can still browse previously viewed content.</p>
        <button class="retry-btn" onclick="window.location.reload()">Try Again</button>
      </div>
    </body>
    </html>
  `, {
    headers: { 'Content-Type': 'text/html' }
  });
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Handle background sync
async function doBackgroundSync() {
  try {
    // Get queued actions from IndexedDB or other storage
    const queuedActions = await getQueuedActions();
    
    for (const action of queuedActions) {
      try {
        await processQueuedAction(action);
        await removeQueuedAction(action.id);
      } catch (error) {
        console.error('Failed to process queued action:', error);
      }
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Get queued actions (placeholder implementation)
async function getQueuedActions() {
  // This would typically read from IndexedDB
  // For now, return empty array
  return [];
}

// Process queued action (placeholder implementation)
async function processQueuedAction(action) {
  // This would typically make the actual API call
  console.log('Processing queued action:', action);
}

// Remove queued action (placeholder implementation)
async function removeQueuedAction(actionId) {
  // This would typically remove from IndexedDB
  console.log('Removing queued action:', actionId);
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/logo192.png',
      badge: '/logo192.png',
      image: data.image,
      data: data.data || {},
      actions: data.actions || [],
      requireInteraction: data.requireInteraction || false,
      tag: data.tag || 'default',
      renotify: data.renotify || false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Airbnb Clone', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action) {
    // Handle specific action clicks
    console.log('Action clicked:', event.action);
  } else {
    // Default click behavior - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});
