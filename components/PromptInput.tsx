'use client';

import { useEffect, useRef, useState } from 'react';
import { GenerationType } from '@/lib/types';

const IMAGE_EXAMPLES = [
  'a neon cyberpunk city reflected in rain-soaked streets, cinematic',
  'abstract light sculpture, volumetric fog, studio black background',
  'satellite view of a bioluminescent ocean at midnight, 8k',
  'geometric crystal formations inside a dark cave, macro lens',
];

const VIDEO_EXAMPLES = [
  'drone ascending over a futuristic megacity at dusk, slow motion',
  'particle simulation of a supernova explosion, dark space, cinematic',
  'time-lapse of storm clouds forming over a neon-lit skyline',
  'underwater bioluminescent creatures drifting through deep ocean',
];

interface Props {
  value: string;
  onChange: (v: string) => void;
  mode: GenerationType;
  disabled: boolean;
}

export default function PromptInput({ value, onChange, mode, disabled }: Props) {
  const [placeholder, setPlaceholder] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const cycleRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const examples = mode === 'image' ? IMAGE_EXAMPLES : VIDEO_EXAMPLES;
    setPlaceholder(examples[0]);
    cycleRef.current = 0;

    intervalRef.current = setInterval(() => {
      cycleRef.current = (cycleRef.current + 1) % examples.length;
      setPlaceholder(examples[cycleRef.current]);
    }, 4000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [mode]);

  const charCount = value.length;
  const nearLimit = charCount > 440;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <p className="label">Prompt</p>
      <div
        style={{
          position: 'relative',
          background: 'var(--color-elevated)',
          border: `1px solid ${isFocused ? 'var(--color-teal-border)' : 'var(--color-border-subtle)'}`,
          borderRadius: '2px',
          transition: 'border-color 0.15s ease',
          boxShadow: isFocused ? '0 0 0 1px rgba(0,212,255,0.1)' : 'none',
        }}
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          rows={4}
          maxLength={500}
          style={{
            width: '100%',
            resize: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '12px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            lineHeight: '1.6',
            color: 'var(--color-text-primary)',
            caretColor: 'var(--color-teal)',
            opacity: disabled ? 0.5 : 1,
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '0 10px 8px',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: nearLimit ? 'var(--color-amber)' : 'var(--color-text-muted)',
            transition: 'color 0.15s ease',
          }}>
            {charCount}/500
          </span>
        </div>
      </div>
    </div>
  );
}
