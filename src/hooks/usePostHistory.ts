import { useState, useEffect, useCallback } from 'react';
import type { PostHistory } from '../types';

const POST_HISTORY_STORAGE_KEY = 'youtubePostManagerHistory';

export function usePostHistory() {
  const [postHistory, setPostHistory] = useState<PostHistory[]>([]);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(POST_HISTORY_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        // Ordenar por timestamp decrescente (mais recente primeiro)
        setPostHistory(parsedHistory.sort((a: PostHistory, b: PostHistory) => b.timestamp - a.timestamp));
      }
    } catch (error) {
      console.error("Failed to load post history from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(POST_HISTORY_STORAGE_KEY, JSON.stringify(postHistory));
    } catch (error) {
      console.error("Failed to save post history to localStorage", error);
    }
  }, [postHistory]);

  const addPostToHistory = useCallback((channelId: string, channelName: string, channelImage: string) => {
    const newPost: PostHistory = {
      id: self.crypto.randomUUID(),
      channelId,
      channelName,
      channelImage,
      timestamp: Date.now(),
    };
    
    setPostHistory(prev => [newPost, ...prev]);
  }, []);

  const clearHistory = useCallback(() => {
    setPostHistory([]);
  }, []);

  const removePostFromHistory = useCallback((postId: string) => {
    setPostHistory(prev => prev.filter(post => post.id !== postId));
  }, []);

  return { 
    postHistory, 
    addPostToHistory, 
    clearHistory, 
    removePostFromHistory 
  };
}