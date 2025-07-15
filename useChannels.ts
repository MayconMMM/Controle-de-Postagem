import { useState, useEffect, useCallback } from 'react';
import type { Channel } from '../types';

const CHANNELS_STORAGE_KEY = 'youtubePostManagerChannels';

export function useChannels() {
  const [channels, setChannels] = useState<Channel[]>([]);

  useEffect(() => {
    try {
      const storedChannels = localStorage.getItem(CHANNELS_STORAGE_KEY);
      if (storedChannels) {
        // Ensure postCount exists for older data
        const parsedChannels = JSON.parse(storedChannels).map((c: any) => ({...c, postCount: c.postCount || 0}));
        setChannels(parsedChannels);
      }
    } catch (error) {
      console.error("Failed to load channels from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(CHANNELS_STORAGE_KEY, JSON.stringify(channels));
    } catch (error) {
      console.error("Failed to save channels to localStorage", error);
    }
  }, [channels]);

  const addChannel = useCallback((name: string, imageUrl: string) => {
    const newChannel: Channel = {
      id: self.crypto.randomUUID(),
      name,
      imageUrl,
      postCount: 0,
    };
    setChannels(prev => [...prev, newChannel]);
  }, []);

  const removeChannel = useCallback((id: string) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
  }, []);

  const incrementPostCount = useCallback((id: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === id ? { ...channel, postCount: (channel.postCount || 0) + 1 } : channel
      )
    );
  }, []);

  const resetPostCount = useCallback((id: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === id ? { ...channel, postCount: 0 } : channel
      )
    );
  }, []);

  const resetAllPostCounts = useCallback(() => {
    setChannels(prev =>
      prev.map(channel => ({ ...channel, postCount: 0 }))
    );
  }, []);


  return { channels, addChannel, removeChannel, incrementPostCount, resetPostCount, resetAllPostCounts };
}