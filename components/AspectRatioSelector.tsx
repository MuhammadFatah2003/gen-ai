'use client';

import { AspectRatio } from '@/lib/types';

const RATIOS: { value: AspectRatio; label: string; w: number; h: number }[] = [
  { value: '1:1',  label: '1:1',  w: 18, h: 18 },
  { value: '16:9', label: '16:9', w: 24, h: 14 },
  { value: '9:16', label: '9:16', w: 14, h: 24 },
];

interface Props {
  value: AspectRatio;
  onChange: (r: AspectRatio) => void;
  visible: boolean;
}

export default function AspectRatioSelector({ value, onChange, visible }: Props) {
  return (
    <div
      style={{
        maxHeight: visible ? '60px' : '0',
        opacity: visible ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.2s ease, opacity 0.2s ease',
      }}
    >
      <div style={{ paddingTop: '4px' }}>
        <p className="label" style={{ marginBottom: '8px' }}>Aspect Ratio</p>
        <div style={{ display: 'flex', gap: '8px' }}>
          {RATIOS.map((r) => {
            const active = value === r.value;
            return (
              <button
                key={r.value}
                onClick={() => onChange(r.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '8px 12px',
                  background: active ? 'var(--color-amber-dim)' : 'var(--color-elevated)',
                  border: active ? '1px solid rgba(255,184,0,0.35)' : '1px solid var(--color-border-subtle)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width={r.w} height={r.h} viewBox={`0 0 ${r.w} ${r.h}`}>
                  <rect
                    x="0.5" y="0.5"
                    width={r.w - 1} height={r.h - 1}
                    fill="none"
                    stroke={active ? 'var(--color-amber)' : 'var(--color-text-muted)'}
                    strokeWidth="1"
                  />
                </svg>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.55rem',
                  letterSpacing: '0.1em',
                  color: active ? 'var(--color-amber)' : 'var(--color-text-muted)',
                }}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
