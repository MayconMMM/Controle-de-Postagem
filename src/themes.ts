export interface Theme {
  name: string;
  colors: {
    '--color-primary': string;
    '--color-primary-dark': string;
    '--color-primary-hover': string;
    '--color-background': string;
    '--color-card': string;
    '--color-text': string;
    '--color-text-header': string;
    '--color-text-muted': string;
    '--color-text-disabled': string;
    '--color-border': string;
    '--color-input': string;
    '--color-button-disabled': string;
    '--color-button-secondary': string;
    '--color-button-secondary-hover': string;
    '--color-success': string;
    '--color-success-hover': string;
    '--color-success-text': string;
    '--color-success-bg': string;
    '--color-success-border': string;
    '--color-warning': string;
    '--color-warning-dark': string;
    '--color-danger': string;
    '--color-danger-hover': string;
    '--color-danger-text': string;
    '--color-danger-bg': string;
    '--color-danger-border': string;
    '--color-info': string;
    '--color-info-hover': string;
    '--color-info-text': string;
    '--color-info-bg': string;
    '--color-info-bg-hover': string;
  };
}

export const themes: Record<string, Theme> = {
  'Padrão (Vermelho)': {
    name: 'Padrão (Vermelho)',
    colors: {
      '--color-primary': '#ef4444',
      '--color-primary-dark': '#b91c1c',
      '--color-primary-hover': '#dc2626',
      '--color-background': '#111827',
      '--color-card': '#1f2937',
      '--color-text': '#f9fafb',
      '--color-text-header': '#ffffff',
      '--color-text-muted': '#9ca3af',
      '--color-text-disabled': '#6b7280',
      '--color-border': '#4b5563',
      '--color-input': '#374151',
      '--color-button-disabled': '#4b5563',
      '--color-button-secondary': '#4b5563',
      '--color-button-secondary-hover': '#6b7280',
      '--color-success': '#22c55e',
      '--color-success-hover': '#16a34a',
      '--color-success-text': '#bbf7d0',
      '--color-success-bg': 'rgba(22, 163, 74, 0.1)',
      '--color-success-border': 'rgba(34, 197, 94, 0.4)',
      '--color-warning': '#facc15',
      '--color-warning-dark': '#fde047',
      '--color-danger': '#f87171',
      '--color-danger-hover': '#ef4444',
      '--color-danger-text': '#fca5a5',
      '--color-danger-bg': 'rgba(239, 68, 68, 0.1)',
      '--color-danger-border': 'rgba(239, 68, 68, 0.4)',
      '--color-info': '#60a5fa',
      '--color-info-hover': '#3b82f6',
      '--color-info-text': '#bfdbfe',
      '--color-info-bg': 'rgba(59, 130, 246, 0.1)',
      '--color-info-bg-hover': 'rgba(59, 130, 246, 0.2)',
    },
  },
  'Oceano (Azul)': {
    name: 'Oceano (Azul)',
    colors: {
       '--color-primary': '#3b82f6',
      '--color-primary-dark': '#1d4ed8',
      '--color-primary-hover': '#2563eb',
      '--color-background': '#1e293b',
      '--color-card': '#334155',
      '--color-text': '#e2e8f0',
      '--color-text-header': '#f8fafc',
      '--color-text-muted': '#94a3b8',
      '--color-text-disabled': '#64748b',
      '--color-border': '#475569',
      '--color-input': '#475569',
      '--color-button-disabled': '#475569',
      '--color-button-secondary': '#475569',
      '--color-button-secondary-hover': '#64748b',
      '--color-success': '#22c55e',
      '--color-success-hover': '#16a34a',
      '--color-success-text': '#bbf7d0',
      '--color-success-bg': 'rgba(22, 163, 74, 0.1)',
      '--color-success-border': 'rgba(34, 197, 94, 0.4)',
      '--color-warning': '#facc15',
      '--color-warning-dark': '#fde047',
      '--color-danger': '#f87171',
      '--color-danger-hover': '#ef4444',
      '--color-danger-text': '#fca5a5', 
      '--color-danger-bg': 'rgba(239, 68, 68, 0.1)',
      '--color-danger-border': 'rgba(239, 68, 68, 0.4)',
      '--color-info': '#818cf8',
      '--color-info-hover': '#6366f1',
      '--color-info-text': '#c7d2fe',
      '--color-info-bg': 'rgba(99, 102, 241, 0.1)',
      '--color-info-bg-hover': 'rgba(99, 102, 241, 0.2)',
    },
  },
  'Floresta (Verde)': {
    name: 'Floresta (Verde)',
    colors: {
      '--color-primary': '#16a34a',
      '--color-primary-dark': '#14532d',
      '--color-primary-hover': '#15803d',
      '--color-background': '#1c1917',
      '--color-card': '#292524',
      '--color-text': '#e7e5e4',
      '--color-text-header': '#fafaf9',
      '--color-text-muted': '#a8a29e',
      '--color-text-disabled': '#78716c',
      '--color-border': '#57534e',
      '--color-input': '#44403c',
      '--color-button-disabled': '#57534e',
      '--color-button-secondary': '#57534e',
      '--color-button-secondary-hover': '#78716c',
      '--color-success': '#84cc16',
      '--color-success-hover': '#65a30d',
      '--color-success-text': '#d9f99d',
      '--color-success-bg': 'rgba(132, 204, 22, 0.1)',
      '--color-success-border': 'rgba(132, 204, 22, 0.4)',
      '--color-warning': '#facc15',
      '--color-warning-dark': '#fde047',
      '--color-danger': '#f87171',
      '--color-danger-hover': '#ef4444',
      '--color-danger-text': '#fca5a5',
      '--color-danger-bg': 'rgba(239, 68, 68, 0.1)',
      '--color-danger-border': 'rgba(239, 68, 68, 0.4)',
      '--color-info': '#60a5fa',
      '--color-info-hover': '#3b82f6',
      '--color-info-text': '#bfdbfe',
      '--color-info-bg': 'rgba(59, 130, 246, 0.1)',
      '--color-info-bg-hover': 'rgba(59, 130, 246, 0.2)',
    },
  },
   'Crepúsculo (Laranja)': {
    name: 'Crepúsculo (Laranja)',
    colors: {
      '--color-primary': '#f97316',
      '--color-primary-dark': '#c2410c',
      '--color-primary-hover': '#ea580c',
      '--color-background': '#1c1c1c',
      '--color-card': '#262626',
      '--color-text': '#e5e5e5',
      '--color-text-header': '#fafafa',
      '--color-text-muted': '#a3a3a3',
      '--color-text-disabled': '#737373',
      '--color-border': '#525252',
      '--color-input': '#404040',
      '--color-button-disabled': '#525252',
      '--color-button-secondary': '#525252',
      '--color-button-secondary-hover': '#737373',
      '--color-success': '#22c55e',
      '--color-success-hover': '#16a34a',
      '--color-success-text': '#bbf7d0',
      '--color-success-bg': 'rgba(22, 163, 74, 0.1)',
      '--color-success-border': 'rgba(34, 197, 94, 0.4)',
      '--color-warning': '#facc15',
      '--color-warning-dark': '#fde047',
      '--color-danger': '#f87171',
      '--color-danger-hover': '#ef4444',
      '--color-danger-text': '#fca5a5',
      '--color-danger-bg': 'rgba(239, 68, 68, 0.1)',
      '--color-danger-border': 'rgba(239, 68, 68, 0.4)',
      '--color-info': '#60a5fa',
      '--color-info-hover': '#3b82f6',
      '--color-info-text': '#bfdbfe',
      '--color-info-bg': 'rgba(59, 130, 246, 0.1)',
      '--color-info-bg-hover': 'rgba(59, 130, 246, 0.2)',
    },
  },
};