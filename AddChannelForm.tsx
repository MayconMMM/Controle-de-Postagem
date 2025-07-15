import React, { useState } from 'react';
import { Icon } from './Icon';

interface AddChannelFormProps {
  onAddChannel: (url: string) => void;
  isLoading: boolean;
  error: string | null;
}

const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const AddChannelForm: React.FC<AddChannelFormProps> = ({ onAddChannel, isLoading, error }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddChannel(url.trim());
      setUrl('');
    }
  };

  return (
    <div className="mb-12 max-w-2xl mx-auto p-6 bg-[var(--color-card)] rounded-xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center text-[var(--color-text-header)]">Adicionar Novo Canal</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL do Canal do YouTube"
          required
          className="bg-[var(--color-input)] text-[var(--color-text)] placeholder-[var(--color-text-muted)] p-3 rounded-lg border-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          disabled={!url.trim() || isLoading}
        >
          {isLoading ? (
            <>
                <LoadingSpinner />
                <span>Buscando...</span>
            </>
          ) : (
             <>
                <Icon type="Plus" className="w-5 h-5"/>
                <span>Adicionar Canal</span>
            </>
          )}
        </button>
         {error && <p className="text-[var(--color-danger)] text-sm text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};