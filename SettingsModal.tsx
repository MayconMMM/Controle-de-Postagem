import React from 'react';
import { Icon } from './Icon';
import { ThemeSelector } from './ThemeSelector';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cooldownMinutes: number;
  setCooldownMinutes: (minutes: number) => void;
  onResetAllCountsRequest: () => void;
  hasChannels: boolean;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  cooldownMinutes,
  setCooldownMinutes,
  onResetAllCountsRequest,
  hasChannels
}) => {
  if (!isOpen) {
    return null;
  }

  const handleResetAndClose = () => {
    onResetAllCountsRequest();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        className="bg-[var(--color-card)] rounded-xl shadow-2xl p-6 w-full max-w-lg transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="settings-title" className="text-2xl font-bold text-[var(--color-text-header)] mb-6 text-center">
          Configurações
        </h2>

        {/* Theme Selector */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Tema do Aplicativo</h3>
            <ThemeSelector />
        </div>

        {/* Cooldown Settings */}
        <div className="mb-6">
            <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Intervalo de Postagem</h3>
             <div className="flex items-center gap-4 p-4 bg-[var(--color-input)] rounded-lg">
                <Icon type="Clock" className="w-6 h-6 text-[var(--color-text-muted)]"/>
                <label htmlFor="cooldown-minutes" className="font-medium flex-1">
                    Tempo de espera entre posts:
                </label>
                 <div className="relative">
                    <input
                        type="number"
                        id="cooldown-minutes"
                        value={cooldownMinutes}
                        onChange={(e) => setCooldownMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="w-24 bg-[var(--color-background)] text-[var(--color-text)] p-2 rounded-lg border-2 border-[var(--color-border)] text-center font-semibold focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm pointer-events-none">min</span>
                </div>
            </div>
        </div>

        {/* Reset All */}
        {hasChannels && (
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">Gerenciamento de Dados</h3>
                <button 
                    onClick={handleResetAndClose} 
                    className="w-full flex items-center justify-center gap-2 text-sm text-[var(--color-info-text)] bg-[var(--color-info-bg)] hover:bg-[var(--color-info-bg-hover)] py-3 px-3 rounded-lg transition-colors font-semibold"
                >
                    <Icon type="Reset" className="w-5 h-5" />
                    Zerar Contagem de Todos os Canais
                </button>
            </div>
        )}

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            type="button"
            className="px-8 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-semibold transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};