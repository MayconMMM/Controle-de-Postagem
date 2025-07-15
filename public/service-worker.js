// Service Worker aprimorado para notificações visuais em background
const CACHE_NAME = 'youtube-post-manager-v2';

// Instalar service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(self.skipWaiting());
});

// Ativar service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// Armazenar timers de notificação
const notificationTimers = new Map();

// Escutar mensagens da aplicação principal
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { channelName, channelImage, delay, channelId } = event.data;
    
    // Cancelar timer anterior se existir
    if (notificationTimers.has(channelId)) {
      clearTimeout(notificationTimers.get(channelId));
    }
    
    // Agendar nova notificação
    const timerId = setTimeout(async () => {
      console.log('Showing notification for:', channelName);
      
      try {
        const iconUrl = channelImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=ef4444&color=fff&size=128`;
        
        await self.registration.showNotification('🎉 Postagem Liberada!', {
          body: `Você já pode postar novamente no canal "${channelName}". Clique para abrir o app.`,
          icon: iconUrl,
          badge: iconUrl,
          tag: `post-manager-${channelId}`,
          vibrate: [200, 100, 200, 100, 200],
          requireInteraction: true,
          silent: false,
          timestamp: Date.now(),
          actions: [
            {
              action: 'open',
              title: '📱 Abrir App',
              icon: iconUrl
            },
            {
              action: 'dismiss',
              title: '❌ Dispensar'
            }
          ],
          data: {
            channelName,
            channelId,
            url: self.location.origin
          }
        });
        
        // Remover timer do mapa
        notificationTimers.delete(channelId);
        
      } catch (error) {
        console.error('Error showing notification:', error);
      }
    }, delay);
    
    // Armazenar timer
    notificationTimers.set(channelId, timerId);
    
    console.log(`Notification scheduled for ${channelName} in ${delay}ms`);
  }
  
  if (event.data && event.data.type === 'CANCEL_NOTIFICATION') {
    const { channelId } = event.data;
    if (notificationTimers.has(channelId)) {
      clearTimeout(notificationTimers.get(channelId));
      notificationTimers.delete(channelId);
      console.log(`Notification cancelled for channel ${channelId}`);
    }
  }
  
  if (event.data && event.data.type === 'TEST_NOTIFICATION') {
    const { channelName, channelImage } = event.data;
    
    const iconUrl = channelImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(channelName)}&background=22c55e&color=fff&size=128`;
    
    self.registration.showNotification('🧪 Teste de Notificação', {
      body: `Esta é uma notificação de teste para o canal "${channelName}". Se você está vendo isso, as notificações estão funcionando!`,
      icon: iconUrl,
      badge: iconUrl,
      tag: 'test-notification',
      vibrate: [100, 50, 100],
      requireInteraction: false,
      silent: false,
      actions: [
        {
          action: 'open',
          title: '👍 Funcionando!',
          icon: iconUrl
        }
      ],
      data: {
        channelName,
        isTest: true,
        url: self.location.origin
      }
    });
  }
});

// Quando o usuário clica na notificação
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  const notification = event.notification;
  const action = event.action;
  
  // Fechar a notificação
  notification.close();
  
  if (action === 'dismiss') {
    return; // Apenas fechar
  }
  
  // Focar ou abrir a janela da aplicação
  event.waitUntil(
    clients.matchAll({ 
      type: 'window', 
      includeUncontrolled: true 
    }).then((clientList) => {
      const appUrl = notification.data?.url || self.location.origin;
      
      // Procurar por uma janela já aberta
      for (const client of clientList) {
        if (client.url.includes(appUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Se não encontrou, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(appUrl);
      }
    })
  );
});

// Quando a notificação é fechada
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

// Tratar push events (para futuras melhorias)
self.addEventListener('push', (event) => {
  console.log('Push event received:', event);
});