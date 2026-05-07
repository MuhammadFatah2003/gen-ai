'use client';

import { GenerationType } from '@/lib/types';

interface Props {
  mode: GenerationType;
  onChange: (mode: GenerationType) => void;
}

export default function ModeToggle({ mode, onChange }: Props) {
  return (
    <div
      role="tablist"
      style={{
        display: 'inline-flex',
        background: 'var(--color-elevated)',
        border: '1px solid var(--color-border-subtle)',
        borderRadius: '2px',
        padding: '3px',
        gap: '2px',
      }}
    >
      {(['image', 'video'] as GenerationType[]).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              padding: '6px 16px',
              borderRadius: '1px',
              border: active ? '1px solid var(--color-teal-border)' : '1px solid transparent',
              background: active ? 'var(--color-teal-dim)' : 'transparent',
              color: active ? 'var(--color-teal)' : 'var(--color-text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              userSelect: 'none',
            }}
          >
            {m === 'image' ? '[ IMAGE ]' : '[ VIDEO ]'}
          </button>
        );
      })}
    </div>
  );
}
