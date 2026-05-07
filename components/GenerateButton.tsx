'use client';

import { useEffect, useRef, useState } from 'react';
import { GenerationType } from '@/lib/types';

const LABELS = ['INITIALIZING...', 'RENDERING...', 'PROCESSING...'];

interface Props {
  isGenerating: boolean;
  disabled: boolean;
  mode: GenerationType;
  onClick: () => void;
}

export default function GenerateButton({ isGenerating, disabled, mode, onClick }: Props) {
  const [labelIdx, setLabelIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isGenerating) {
      setLabelIdx(0);
      intervalRef.current = setInterval(() => {
        setLabelIdx((i) => (i + 1) % LABELS.length);
      }, 3000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setLabelIdx(0);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isGenerating]);

  const label = isGenerating ? LABELS[labelIdx] : `GENERATE ${mode === 'image' ? 'IMAGE' : 'VIDEO'}`;

  return (
    <button
      onClick={onClick}
      disabled={disabled || isGenerating}
      style={{
        width: '100%',
        padding: '14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: isGenerating ? 'var(--color-text-secondary)' : 'var(--color-teal)',
        background: 'transparent',
        border: `1px solid ${isGenerating ? 'var(--color-text-muted)' : 'var(--color-teal-border)'}`,
        borderRadius: '2px',
        cursor: disabled || isGenerating ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
        animation: isGenerating ? 'pulse-glow 2s ease-in-out infinite' : 'none',
        opacity: disabled && !isGenerating ? 0.4 : 1,
      }}
      onMouseEnter={(e) => {
        if (!isGenerating && !disabled) {
          (e.currentTarget as HTMLButtonElement).style.background = 'var(--color-teal-dim)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 16px rgba(0,212,255,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
      }}
    >
      {label}
    </button>
  );
}
