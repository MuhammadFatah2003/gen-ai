'use client';

export default function LoadingPulse() {
  return (
    <div className="flex items-end gap-[3px]" aria-label="Generating…">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          style={{
            display: 'block',
            width: '3px',
            height: '20px',
            background: 'var(--color-teal)',
            borderRadius: '1px',
            transformOrigin: 'bottom',
            animation: `bar-bounce 1.1s ease-in-out infinite`,
            animationDelay: `${i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}
