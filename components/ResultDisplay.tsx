'use client';

import { Generation } from '@/lib/types';
import LoadingPulse from './ui/LoadingPulse';

interface Props {
  result: Generation | null;
  isGenerating: boolean;
}

export default function ResultDisplay({ result, isGenerating }: Props) {
  /* ── Empty state ── */
  if (!result && !isGenerating) {
    return (
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        color: 'var(--color-text-muted)',
      }}>
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
          <rect x="4" y="12" width="48" height="34" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <circle cx="20" cy="25" r="5" stroke="currentColor" strokeWidth="1.2"/>
          <path d="M4 38 L18 26 L28 36 L36 28 L52 42" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="38" y="8" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
          <circle cx="45" cy="13" r="2" fill="currentColor" opacity="0.5"/>
        </svg>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
        }}>
          Output will appear here
        </span>
      </div>
    );
  }

  /* ── Loading state ── */
  if (isGenerating && !result) {
    return (
      <div
        className="scanning"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="shimmer" style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.4,
        }} />
        <LoadingPulse />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-text-secondary)',
          position: 'relative',
          zIndex: 1,
        }}>
          Generating…
        </span>
      </div>
    );
  }

  if (!result) return null;

  /* ── Result state ── */
  return (
    <div
      className="animate-fade-in-up"
      style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {result.type === 'image' ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={result.url}
            alt={result.prompt}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        ) : (
          <video
            src={result.url}
            autoPlay
            loop
            muted
            playsInline
            controls
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              background: '#000',
            }}
          />
        )}
      </div>

      {/* Prompt overlay */}
      <div style={{
        padding: '10px 14px',
        background: 'rgba(5,5,8,0.85)',
        borderTop: '1px solid var(--color-border-subtle)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px',
      }}>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.6rem',
          color: 'var(--color-text-secondary)',
          lineHeight: '1.4',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1,
        }}>
          {result.prompt}
        </p>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: result.type === 'image' ? 'var(--color-teal)' : 'var(--color-amber)',
          padding: '2px 6px',
          border: `1px solid ${result.type === 'image' ? 'var(--color-teal-border)' : 'rgba(255,184,0,0.3)'}`,
          borderRadius: '1px',
          flexShrink: 0,
        }}>
          {result.type}
        </span>
        <a
          href={result.url}
          download
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.1em',
            color: 'var(--color-text-muted)',
            textDecoration: 'none',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-text-primary)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
        >
          ↓ SAVE
        </a>
      </div>
    </div>
  );
}
