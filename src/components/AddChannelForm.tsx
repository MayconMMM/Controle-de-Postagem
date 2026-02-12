import React, { useState } from 'react';
import { Icon } from './Icon';

interface AddChannelFormProps {
  onAddChannel: (name: string, imageUrl?: string) => void;
  error: string | null;
}

export const AddChannelForm: React.FC<AddChannelFormProps> = ({ onAddChannel, error }) => {
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddChannel(name.trim(), imageUrl.trim() || undefined);
      setName('');
      setImageUrl('');
    }
  };

  return (
    <div className="mb-12 max-w-2xl mx-auto p-6 bg-[var(--color-card)] rounded-xl shadow-lg">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-[var(--color-card)] rounded-lg shadow-lg hover:bg-[var(--color-border)] transition-all duration-300 mb-4"
      >
        <div className="flex items-center justify-center gap-3">
          <Icon type="Plus" className="w-5 h-5 text-[var(--color-primary)]" />
          <span className="text-lg font-semibold text-[var(--color-text-header)]">
            {isExpanded ? 'Ocultar Formulário' : 'Adicionar Novo Canal'}
          </span>
          <div className={`transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-6 bg-[var(--color-card)] rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-center text-[var(--color-text-header)]">Adicionar Novo Canal</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="channel-name" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                Nome do Canal
              </label>
              <input
                id="channel-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Meu Canal do YouTube"
                required
                className="w-full bg-[var(--color-input)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] p-3 rounded-lg border-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="channel-image" className="block text-sm font-medium text-[var(--color-text)] mb-2">
                URL da Imagem (opcional)
              </label>
              <input
                id="channel-image"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="w-full bg-[var(--color-input)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] p-3 rounded-lg border-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              />
              <p className="text-xs text-[var(--color-text-muted)] mt-1">
                Se não fornecer uma imagem, um avatar será gerado automaticamente.
              </p>
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={!name.trim()}
            >
              <Icon type="Plus" className="w-5 h-5"/>
              <span>Adicionar Canal</span>
            </button>

            {error && <p className="text-[var(--color-danger)] text-sm text-center mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};