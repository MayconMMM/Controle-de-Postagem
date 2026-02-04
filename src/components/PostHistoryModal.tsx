import React from 'react';
import { Icon } from './Icon';
import type { PostHistory } from '../types';

interface PostHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  postHistory: PostHistory[];
  onClearHistory: () => void;
  onRemovePost: (postId: string) => void;
}

const formatDateTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return {
    date: date.toLocaleDateString('pt-BR'),
    time: date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
};

const getTimeSince = (timestamp: number) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `há ${days} dia${days > 1 ? 's' : ''}`;
  if (hours > 0) return `há ${hours} hora${hours > 1 ? 's' : ''}`;
  if (minutes > 0) return `há ${minutes} minuto${minutes > 1 ? 's' : ''}`;
  return 'agora mesmo';
};

export const PostHistoryModal: React.FC<PostHistoryModalProps> = ({
  isOpen,
  onClose,
  postHistory,
  onClearHistory,
  onRemovePost
}) => {
  if (!isOpen) {
    return null;
  }

  const handleClearHistory = () => {
    if (window.confirm('Tem certeza que deseja limpar todo o histórico de postagens?')) {
      onClearHistory();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-title"
    >
      <div
        className="bg-[var(--color-card)] rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[80vh] transform transition-all flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 id="history-title" className="text-2xl font-bold text-[var(--color-text-header)]">
            📊 Histórico de Postagens
          </h2>
          <div className="flex gap-2">
            {postHistory.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 rounded-lg bg-[var(--color-danger)] hover:bg-[var(--color-danger-hover)] text-white font-semibold transition-colors text-sm"
              >
                Limpar Histórico
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[var(--color-button-secondary)] hover:bg-[var(--color-button-secondary-hover)] text-[var(--color-text)] font-semibold transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {postHistory.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-[var(--color-text-muted)] mb-2">
                Nenhuma postagem registrada
              </h3>
              <p className="text-[var(--color-text-muted)]">
                Quando você registrar postagens, elas aparecerão aqui.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {postHistory.map((post) => {
                const { date, time } = formatDateTime(post.timestamp);
                const timeSince = getTimeSince(post.timestamp);
                
                return (
                  <div
                    key={post.id}
                    className="flex items-center gap-4 p-4 bg-[var(--color-input)] rounded-lg hover:bg-[var(--color-border)] transition-colors"
                  >
                    <img
                      src={post.channelImage}
                      alt={post.channelName}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[var(--color-border)]"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.channelName)}&background=random&color=fff&size=48`;
                      }}
                    />
                    
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--color-text-header)] mb-1">
                        {post.channelName}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          📅 {date}
                        </span>
                        <span className="flex items-center gap-1">
                          🕐 {time}
                        </span>
                        <span className="flex items-center gap-1">
                          ⏱️ {timeSince}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemovePost(post.id)}
                      className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] transition-colors"
                      title="Remover do histórico"
                    >
                      <Icon type="Trash" className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {postHistory.length > 0 && (
          <div className="mt-6 pt-4 border-t border-[var(--color-border)] text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              Total de postagens registradas: <strong>{postHistory.length}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};