import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Icon } from './Icon';

export const ThemeSelector: React.FC = () => {
  const { theme, setTheme, availableThemes } = useTheme();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.values(availableThemes).map((t) => {
        const isActive = t.name === theme.name;
        return (
          <button
            key={t.name}
            onClick={() => setTheme(t.name)}
            className={`relative p-3 rounded-lg border-2 transition-all duration-200 ${isActive ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]' : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'}`}
            style={{'--color-primary': t.colors['--color-primary']} as React.CSSProperties}
          >
            {isActive && (
              <div className="absolute -top-2 -right-2 bg-[var(--color-primary)] rounded-full p-0.5 text-white">
                <Icon type="Check" className="w-4 h-4" />
              </div>
            )}
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full" style={{ backgroundColor: t.colors['--color-primary'] }}></div>
                <span className="text-sm font-medium text-[var(--color-text)]">{t.name}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
