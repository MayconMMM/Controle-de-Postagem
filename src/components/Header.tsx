import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export const Header: React.FC = () => {
  const { theme } = useTheme();

  return (
    <header className="py-8 px-4 text-center">
      <h1
        className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-dark)] mb-2"
        style={{
          // @ts-ignore
          '--color-primary': theme.colors['--color-primary'],
          '--color-primary-dark': theme.colors['--color-primary-dark'],
        }}
      >
        Gerenciador de Postagens
      </h1>
      <p className="text-[var(--color-text-muted)]">Controle o tempo de postagem dos seus canais do YouTube.</p>
    </header>
  );
};