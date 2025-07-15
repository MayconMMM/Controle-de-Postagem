import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Header } from './components/Header';
import { AddChannelForm } from './components/AddChannelForm';
import { ChannelCard } from './components/ChannelCard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { Icon } from './components/Icon';
import { useChannels } from './hooks/useChannels';
import type { Channel } from './types';

const COOLDOWN_STORAGE_KEY = 'youtubePostManagerCooldown';
const DEFAULT_COOLDOWN_MINUTES = 45;

interface LastPostInfo {
  channel: Channel;
  timestamp: number;
}

type ConfirmationAction = {
  title: string;
  message: React.ReactNode;
  onConfirm: () => void;
  confirmButtonText?: string;
  confirmButtonClass?: string;
};

const getPlaceholderAvatar = (name: string) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=1a202c&color=fff&size=128`;

function App() {
  const { channels, addChannel, removeChannel, incrementPostCount, resetPostCount, resetAllPostCounts } = useChannels();
  const [notificationPermission, setNotificationPermission] = useState(Notification.permission);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);

  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Global Cooldown State
  const [cooldownMinutes, setCooldownMinutes] = useState<number>(() => {
    try {
      const storedMinutes = localStorage.getItem(COOLDOWN_STORAGE_KEY);
      return storedMinutes ? parseInt(storedMinutes, 10) : DEFAULT_COOLDOWN_MINUTES;
    } catch {
      return DEFAULT_COOLDOWN_MINUTES;
    }
  });

  const [globalCooldownEndTime, setGlobalCooldownEndTime] = useState<number | null>(null);
  const [lastPostInfo, setLastPostInfo] = useState<LastPostInfo | null>(null);
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
          .then(registration => console.log('Service Worker registered with scope:', registration.scope))
          .catch(error => console.error('Service Worker registration failed:', error));
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(COOLDOWN_STORAGE_KEY, String(cooldownMinutes));
    } catch (error) {
      console.error("Failed to save cooldown to localStorage", error);
    }
  }, [cooldownMinutes]);

  const requestNotificationPermission = useCallback(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission().then(setNotificationPermission);
    }
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'default') {
        setNotificationPermission(Notification.permission);
    }
  }, []);

  const playNotificationSound = useCallback(() => {
    const audioContext = audioContextRef.current;
    if (!audioContext) {
      console.warn("AudioContext not initialized. User interaction needed to enable sound.");
      return;
    }
    
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.5);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Web Audio API playback failed:", error);
    }
  }, []);
  
  const showBrowserNotification = useCallback(async (channelName: string, channelImage: string) => {
    if (notificationPermission !== 'granted') return;

    try {
        // Primeiro tentar com service worker (mais confiável)
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            if (registration.active) {
                registration.active.postMessage({
                    type: 'TEST_NOTIFICATION',
                    channelName,
                    channelImage
                });
                return;
            }
        }
        
        // Fallback direto
        const iconUrl = channelImage || getPlaceholderAvatar(channelName);
        const notification = new Notification('🧪 Teste de Notificação', {
            body: `Esta é uma notificação de teste para o canal "${channelName}". Se você está vendo isso, as notificações estão funcionando!`,
            icon: iconUrl,
            tag: 'test-notification',
            vibrate: [100, 50, 100],
            requireInteraction: false
        });
        
        // Auto-fechar após 5 segundos
        setTimeout(() => {
            notification.close();
        }, 5000);
        
    } catch (error) {
        console.error('Error showing notification:', error);
    }
}, [notificationPermission]);
  
  const handleCooldownEnd = useCallback(async () => {
    if (lastPostInfo) {
        playNotificationSound();
        await showBrowserNotification(lastPostInfo.channel.name, lastPostInfo.channel.imageUrl);
        setLastPostInfo(null);
    }
  }, [lastPostInfo, playNotificationSound, showBrowserNotification]);

  useEffect(() => {
    let intervalId: number | undefined;
    const updateTimer = () => {
      if (globalCooldownEndTime) {
        const remaining = Math.max(0, globalCooldownEndTime - Date.now());
        setRemainingTime(remaining);
        if (remaining === 0) {
          handleCooldownEnd();
          setGlobalCooldownEndTime(null);
        }
      } else {
        setRemainingTime(0);
      }
    };
    updateTimer();
    intervalId = window.setInterval(updateTimer, 1000);
    return () => window.clearInterval(intervalId);
  }, [globalCooldownEndTime, handleCooldownEnd]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch(e) {
        console.error("Web Audio API is not supported by this browser.");
      }
    }
  };

  const handleRecordPost = useCallback((channelId: string) => {
    initAudioContext();
    const now = Date.now();
    const endTime = now + cooldownMinutes * 60 * 1000;
    setGlobalCooldownEndTime(endTime);
    incrementPostCount(channelId);

    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      setLastPostInfo({ channel, timestamp: now });
      
      // Agendar notificação via service worker
      if ('serviceWorker' in navigator && notificationPermission === 'granted') {
        navigator.serviceWorker.ready.then(registration => {
          if (registration.active) {
            registration.active.postMessage({
              type: 'SCHEDULE_NOTIFICATION',
              channelName: channel.name,
              channelImage: channel.imageUrl,
              channelId: channel.id,
              delay: cooldownMinutes * 60 * 1000
            });
            console.log(`Notification scheduled for ${channel.name} in ${cooldownMinutes} minutes`);
          }
        }).catch(error => {
          console.error('Error scheduling notification:', error);
        });
      }
    }
  }, [cooldownMinutes, channels, incrementPostCount]);

  const handleFetchAndAddChannel = useCallback(async (url: string) => {
    initAudioContext();
    setIsLoading(true);
    setError(null);

    if (!url.includes('youtube.com/')) {
        setError('Por favor, insira uma URL válida de um canal do YouTube.');
        setIsLoading(false);
        return;
    }

    try {
        const encodedUrl = encodeURIComponent(url);
        const proxyUrl = `https://corsproxy.io/?${encodedUrl}`;
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error(`Falha ao buscar dados do canal (status: ${response.status}).`);
        const htmlContent = await response.text();
        if (!htmlContent) throw new Error('Não foi possível obter o conteúdo da página.');

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');

        const name = doc.querySelector('meta[property="og:title"]')?.getAttribute('content');
        const imageUrl = doc.querySelector('meta[property="og:image"]')?.getAttribute('content');
        
        if (!name || !imageUrl) throw new Error('Não foi possível extrair o nome e a imagem do canal.');
        if (channels.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            setError(`O canal "${name}" já foi adicionado.`);
        } else {
            addChannel(name, imageUrl);
        }
    } catch (err: any) {
        console.error(err);
        setError(err.message || 'Ocorreu um erro desconhecido.');
    } finally {
        setIsLoading(false);
    }
}, [addChannel, channels]);

  const handleEnableNotificationsClick = () => {
    initAudioContext();
    requestNotificationPermission();
  }

  const handleTestNotification = () => {
    initAudioContext();
    if (notificationPermission !== 'granted') return;
    const testChannelName = channels.length > 0 ? channels[0].name : 'Canal de Teste';
    const testChannelImage = channels.length > 0 ? channels[0].imageUrl : '';
    showBrowserNotification(testChannelName, testChannelImage);
    playNotificationSound();
  };
  
  const handleRemoveChannelRequest = (channel: Channel) => {
    initAudioContext();
    setConfirmationAction({
      title: 'Remover Canal',
      message: <p>Tem certeza que deseja remover o canal <strong>{channel.name}</strong>?</p>,
      onConfirm: () => removeChannel(channel.id),
      confirmButtonText: 'Remover',
      confirmButtonClass: 'bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)]'
    });
  };

  const handleResetCountRequest = (channel: Channel) => {
    initAudioContext();
    setConfirmationAction({
      title: 'Zerar Contagem',
      message: <p>Zerar contagem de posts para <strong>{channel.name}</strong>?</p>,
      onConfirm: () => resetPostCount(channel.id),
      confirmButtonText: 'Zerar',
      confirmButtonClass: 'bg-[var(--color-info)] hover:bg-[var(--color-info-hover)]'
    });
  };

  const handleResetAllCountsRequest = () => {
      initAudioContext();
      if(channels.length === 0) return;
      setConfirmationAction({
        title: 'Zerar Todas as Contagens',
        message: <p>Tem certeza que deseja zerar a contagem para <strong>TODOS</strong> os canais?</p>,
        onConfirm: resetAllPostCounts,
      });
  }

  return (
    <div className="min-h-screen p-4 md:p-8" onClick={initAudioContext}>
      <button 
        onClick={() => setIsSettingsOpen(true)}
        className="fixed top-4 right-4 z-30 p-3 rounded-full bg-[var(--color-card)] text-[var(--color-text)] shadow-lg hover:bg-[var(--color-border)] transition-colors"
        aria-label="Abrir configurações"
      >
        <Icon type="Cog" className="w-6 h-6" />
      </button>

      <Header />
      
      <main className="container mx-auto">
        <AddChannelForm 
          onAddChannel={handleFetchAndAddChannel} 
          isLoading={isLoading}
          error={error}
        />
        
        {notificationPermission === 'default' && (
            <div className="max-w-4xl mx-auto mb-8 p-4 bg-blue-900/50 border border-blue-700 rounded-lg flex items-center justify-center gap-4">
                <Icon type="Bell" className="w-6 h-6 text-blue-300" />
                <p className="text-blue-200">Para receber notificações, clique no botão para habilitá-las.</p>
                <button onClick={handleEnableNotificationsClick} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    Habilitar Notificações
                </button>
            </div>
        )}
        
        {notificationPermission === 'granted' && channels.length > 0 && (
             <div className="max-w-4xl mx-auto mb-8 p-3 bg-[var(--color-success-bg)] border border-[var(--color-success-border)] rounded-lg flex items-center justify-center gap-4 text-sm">
                <Icon type="Check" className="w-5 h-5 text-[var(--color-success)]" />
                <p className="text-[var(--color-success-text)]">As notificações estão habilitadas.</p>
                <button 
                    onClick={handleTestNotification} 
                    className="bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white font-bold py-1 px-3 rounded-lg transition-colors text-xs"
                >
                    Testar
                </button>
            </div>
        )}
        
        {notificationPermission === 'denied' && (
             <div className="max-w-4xl mx-auto mb-8 p-4 bg-[var(--color-danger-bg)] border border-[var(--color-danger-border)] rounded-lg flex items-center justify-center gap-4">
                <Icon type="Bell" className="w-6 h-6 text-[var(--color-danger)]" />
                <p className="text-[var(--color-danger-text)] text-center">Você bloqueou as notificações. Para recebê-las, altere as permissões do site no navegador.</p>
            </div>
        )}

        {channels.length === 0 ? (
          <div className="text-center py-16 px-4">
            <h2 className="text-2xl font-semibold text-[var(--color-text-muted)] mb-4">Nenhum canal adicionado ainda.</h2>
            <p className="text-gray-500">Use o formulário acima para começar a gerenciar seus canais.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {channels.map((channel: Channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onRecordPost={handleRecordPost}
                onRemoveChannelRequest={handleRemoveChannelRequest}
                onResetCountRequest={handleResetCountRequest}
                remainingTime={remainingTime}
                lastPostedChannelId={lastPostInfo?.channel.id || null}
                lastPostTimestamp={channel.id === lastPostInfo?.channel.id ? lastPostInfo.timestamp : undefined}
              />
            ))}
          </div>
        )}
      </main>

      <ConfirmationModal
        isOpen={!!confirmationAction}
        onClose={() => setConfirmationAction(null)}
        onConfirm={confirmationAction?.onConfirm}
        title={confirmationAction?.title}
        confirmButtonText={confirmationAction?.confirmButtonText}
        confirmButtonClass={confirmationAction?.confirmButtonClass}
      >
        {confirmationAction?.message}
      </ConfirmationModal>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        cooldownMinutes={cooldownMinutes}
        setCooldownMinutes={setCooldownMinutes}
        onResetAllCountsRequest={handleResetAllCountsRequest}
        hasChannels={channels.length > 0}
      />
    </div>
  );
}

export default App;