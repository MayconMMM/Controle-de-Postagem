// This service worker is intentionally simple.
// Its presence allows the main application to use the `navigator.serviceWorker.ready`
// promise to show notifications, which is the modern and reliable way to
// trigger notifications that work even when the app tab is in the background.

self.addEventListener('install', (event) => {
  // We can skip waiting, as there's no complex caching to manage.
  event.waitUntil(self.skipWaiting());
  console.log('Service Worker: Installed');
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  // Take control of all clients as soon as the service worker activates.
  event.waitUntil(self.clients.claim());
});

// When the user clicks on the notification
self.addEventListener('notificationclick', (event) => {
  // Close the notification
  event.notification.close();

  // Focus the app's window or open a new one
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window open and focus it
      for (const client of clientList) {
        if ('focus' in client) {
          return client.focus();
        }
      }
      // If not, open a new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});