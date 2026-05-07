'use client';

import { useState } from 'react';
import { Generation, GenerationType, AspectRatio } from '@/lib/types';
import ModeToggle from './ModeToggle';
import PromptInput from './PromptInput';
import AspectRatioSelector from './AspectRatioSelector';
import GenerateButton from './GenerateButton';
import ResultDisplay from './ResultDisplay';
import GalleryGrid from './GalleryGrid';

export default function GeneratorApp() {
  const [mode, setMode] = useState<GenerationType>('image');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<Generation | null>(null);
  const [gallery, setGallery] = useState<Generation[]>([]);
  const [error, setError] = useState<string | null>(null);

  const canGenerate = prompt.trim().length > 0 && !isGenerating;

  async function handleGenerate() {
    if (!canGenerate) return;
    setIsGenerating(true);
    setError(null);
    try {
      // Step 1: start the prediction (fast, < 5s)
      const startRes = await fetch('/api/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: mode,
          prompt: prompt.trim(),
          ...(mode === 'image' && { aspect_ratio: aspectRatio }),
        }),
      });

      const startData = await startRes.json();
      if (!startRes.ok || startData.error) {
        throw new Error(startData.message ?? `Failed to start (${startRes.status})`);
      }

      const { prediction_url, type: genType, prompt: genPrompt } = startData;

      // Step 2: poll every 3s until succeeded/failed
      for (;;) {
        await new Promise((r) => setTimeout(r, 3000));

        const pollRes = await fetch('/api/poll', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prediction_url, type: genType, prompt: genPrompt }),
        });

        const pollData = await pollRes.json();
        if (!pollRes.ok || pollData.error) {
          throw new Error(pollData.message ?? 'Polling failed');
        }

        if (pollData.status === 'succeeded') {
          const gen: Generation = {
            id: crypto.randomUUID(),
            url: pollData.url,
            type: pollData.type,
            prompt: pollData.prompt,
            ...(mode === 'image' && { aspect_ratio: aspectRatio }),
            createdAt: new Date(),
          };
          setCurrentResult(gen);
          setGallery((prev) => [gen, ...prev].slice(0, 4));
          return;
        }

        if (pollData.status === 'failed' || pollData.status === 'canceled') {
          throw new Error(`Generation ${pollData.status}`);
        }
        // status: 'starting' | 'processing' → keep polling
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
      {/* ── Header bar ── */}
      <header style={{
        padding: '0 24px',
        height: '52px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--color-border-subtle)',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Logo mark */}
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2 L20 7 L20 15 L11 20 L2 15 L2 7 Z" stroke="var(--color-teal)" strokeWidth="1.2" fill="none"/>
            <circle cx="11" cy="11" r="3" fill="var(--color-teal)" opacity="0.7"/>
          </svg>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '0.875rem',
            letterSpacing: '0.1em',
            color: 'var(--color-text-primary)',
          }}>
            GEN<span style={{ color: 'var(--color-teal)' }}>·</span>AI
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.55rem',
          letterSpacing: '0.15em',
          color: 'var(--color-text-muted)',
        }}>
          REPLICATE · FLUX · KLING
        </span>
      </header>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '360px 1fr',
        overflow: 'hidden',
      }}
        /* Stack on mobile */
        className="max-[768px]:!grid-cols-1 max-[768px]:overflow-y-auto"
      >
        {/* ── Left: Controls panel ── */}
        <aside style={{
          borderRight: '1px solid var(--color-border-subtle)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: 'auto',
        }}>
          {/* Mode toggle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p className="label">Mode</p>
            <ModeToggle mode={mode} onChange={(m) => { setMode(m); setError(null); }} />
          </div>

          {/* Prompt */}
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            mode={mode}
            disabled={isGenerating}
          />

          {/* Aspect ratio (image only) */}
          <AspectRatioSelector
            value={aspectRatio}
            onChange={setAspectRatio}
            visible={mode === 'image'}
          />

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 12px',
              background: 'rgba(255,60,60,0.06)',
              border: '1px solid rgba(255,60,60,0.2)',
              borderRadius: '2px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.625rem',
              color: '#ff6b6b',
              lineHeight: '1.5',
            }}>
              ⚠ {error}
            </div>
          )}

          {/* Generate button */}
          <GenerateButton
            isGenerating={isGenerating}
            disabled={!canGenerate}
            mode={mode}
            onClick={handleGenerate}
          />

          {/* Footer note */}
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.55rem',
            letterSpacing: '0.08em',
            color: 'var(--color-text-muted)',
            lineHeight: '1.6',
            marginTop: 'auto',
          }}>
            {mode === 'video'
              ? '⏱ Video generation takes ~60–120s. Keep this tab open.'
              : '⚡ Images generate in ~5–10s using Flux Schnell.'}
          </p>
        </aside>

        {/* ── Right: Result panel ── */}
        <main style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--color-surface)',
        }}>
          {/* Result display area */}
          <div style={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}>
            <ResultDisplay result={currentResult} isGenerating={isGenerating} />
          </div>

          {/* Gallery strip */}
          {gallery.length > 0 && (
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--color-border-subtle)',
              background: 'var(--color-void)',
              flexShrink: 0,
            }}>
              <GalleryGrid
                items={gallery}
                activeId={currentResult?.id ?? null}
                onSelect={setCurrentResult}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
