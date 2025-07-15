// Service Worker aprimorado para notificações em background
const CACHE_NAME = 'youtube-post-manager-v1';

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// Escutar mensagens da aplicação principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { channelName, channelImage, delay } = event.data;
    
    // Agendar notificação
    setTimeout(() => {
      self.registration.showNotification('Postagem Liberada!', {
        body: `Você já pode postar novamente. O último canal foi "${channelName}".`,
        icon: channelImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=1a202c&color=fff&size=128`,
        tag: 'post-manager-cooldown-finished',
        badge: channelImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=1a202c&color=fff&size=128`,
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
          {
            action: 'open',
            title: 'Abrir App'
          }
        ]
      });
    }, delay);
  }
});

// Quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  // Fechar a notificação
  event.notification.close();

  // Focar ou abrir a janela da aplicação
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then((clientList) => {
      // Procurar por uma janela já aberta
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Se não encontrou, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Escutar quando a notificação é fechada
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event);
});