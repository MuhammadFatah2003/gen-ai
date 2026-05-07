'use client';

import { Generation } from '@/lib/types';

interface Props {
  items: Generation[];
  activeId: string | null;
  onSelect: (g: Generation) => void;
}

export default function GalleryGrid({ items, activeId, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <div style={{ paddingTop: '12px', borderTop: '1px solid var(--color-border-subtle)' }}>
      <p className="label" style={{ marginBottom: '8px' }}>Recent</p>
      <div style={{ display: 'flex', gap: '8px' }}>
        {items.map((g) => {
          const isActive = g.id === activeId;
          return (
            <button
              key={g.id}
              onClick={() => onSelect(g)}
              style={{
                width: '72px',
                height: '72px',
                padding: 0,
                border: `1px solid ${isActive ? 'var(--color-teal)' : 'var(--color-border-subtle)'}`,
                borderRadius: '2px',
                overflow: 'hidden',
                cursor: 'pointer',
                position: 'relative',
                flexShrink: 0,
                transition: 'border-color 0.15s ease, transform 0.15s ease',
                boxShadow: isActive ? '0 0 8px rgba(0,212,255,0.3)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
              }}
              title={g.prompt}
            >
              {g.type === 'image' ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={g.url}
                  alt={g.prompt}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--color-elevated)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-amber)',
                }}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <polygon points="6,4 16,10 6,16" />
                  </svg>
                </div>
              )}
              {/* Type indicator dot */}
              <span style={{
                position: 'absolute',
                bottom: '4px',
                right: '4px',
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: g.type === 'image' ? 'var(--color-teal)' : 'var(--color-amber)',
              }} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
