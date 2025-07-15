import React, { useState, useMemo } from 'react';
import type { Channel } from '../types';
import { Icon } from './Icon';

interface ChannelCardProps {
  channel: Channel;
  onRecordPost: (id: string) => void;
  onRemoveChannelRequest: (channel: Channel) => void;
  onResetCountRequest: (channel: Channel) => void;
  remainingTime: number;
  lastPostedChannelId: string | null;
  lastPostTimestamp?: number;
}

const formatTime = (ms: number) => {
  if (ms <= 0) return '00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onRecordPost, onRemoveChannelRequest, onResetCountRequest, remainingTime, lastPostedChannelId, lastPostTimestamp }) => {
  const [imageError, setImageError] = useState(false);
  
  const isOnCooldown = remainingTime > 0;
  const wasLastPosted = channel.id === lastPostedChannelId;

  const handleImageError = () => {
    setImageError(true);
  };

  const placeholderImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.name)}&background=random&color=fff&size=128`;
  
  const cardClasses = useMemo(() => {
    const base = 'relative flex flex-col p-6 rounded-2xl shadow-lg transition-all duration-300 bg-[var(--color-card)]';
    if (isOnCooldown) {
      return `${base} ${wasLastPosted ? 'ring-2 ring-[var(--color-warning)]' : ''}`;
    }
    return `${base} border-2 border-[var(--color-success)]`;
  }, [isOnCooldown, wasLastPosted]);

  return (
    <div className={cardClasses}>
        <button 
          onClick={() => onRemoveChannelRequest(channel)} 
          className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors z-10"
          aria-label={`Remover canal ${channel.name}`}
        >
            <Icon type="Trash" className="w-5 h-5"/>
        </button>
      <div className="flex flex-col items-center text-center">
        <div className="relative mb-4">
            <img
              src={imageError ? placeholderImage : channel.imageUrl}
              alt={channel.name}
              onError={handleImageError}
              className="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-border)]"
            />
            {channel.postCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center ring-2 ring-[var(--color-card)]" title={`${channel.postCount} posts`}>
                    {channel.postCount}
                </div>
            )}
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text-header)] mb-1 truncate w-full" title={channel.name}>{channel.name}</h3>
        
        {channel.postCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-muted)] mb-1">
                <span>Posts: {channel.postCount}</span>
                <button 
                  onClick={() => onResetCountRequest(channel)} 
                  title="Zerar contagem de posts" 
                  className="text-[var(--color-text-muted)] hover:text-[var(--color-info)] transition-colors"
                  aria-label={`Zerar contagem de posts para ${channel.name}`}
                >
                    <Icon type="Reset" className="w-4 h-4" />
                </button>
            </div>
        )}
        
        {wasLastPosted && isOnCooldown && lastPostTimestamp && (
          <p className="text-xs text-[var(--color-text-muted)] mb-2">
            Postado às {new Date(lastPostTimestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </p>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-[var(--color-border)]">
        {isOnCooldown ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-[var(--color-warning)]">
              <Icon type="Clock" className="w-5 h-5" />
              <p className="font-semibold">Próxima postagem em:</p>
            </div>
            <p className="text-3xl font-mono font-bold text-[var(--color-warning-dark)] my-2">{formatTime(remainingTime)}</p>
            <button disabled className="w-full bg-[var(--color-button-disabled)] text-[var(--color-text-disabled)] font-bold py-3 px-4 rounded-lg cursor-not-allowed">
              Aguardando...
            </button>
          </div>
        ) : (
          <div className="text-center">
             <div className="flex items-center justify-center gap-2 text-[var(--color-success)]">
                <Icon type="Check" className="w-6 h-6" />
                <p className="font-semibold text-lg">Pronto para postar!</p>
            </div>
            <p className="text-sm text-[var(--color-text-muted)] my-2 h-[36px] flex items-center justify-center">Clique para registrar uma nova postagem.</p>
            <button
              onClick={() => onRecordPost(channel.id)}
              disabled={isOnCooldown}
              className="w-full bg-[var(--color-success)] hover:bg-[var(--color-success-hover)] text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:bg-[var(--color-button-disabled)] disabled:cursor-not-allowed disabled:transform-none"
            >
              Registrar Postagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};