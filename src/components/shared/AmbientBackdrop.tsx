'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { getArchetypeMeta } from '@/styles/archetypes';
import { cn } from '@/lib/utils';

/**
 * Ambient page atmosphere.
 *
 * Sits behind every page and adapts to the active design archetype:
 *  · liquid-aurora   → full drifting auroral light field + prism bloom
 *  · swiss / cyber   → precise hairline grid
 *  · organic         → warm grain + soft clay glow
 *  · heritage        → parchment vignette
 *  · neo-brutalism   → bold halftone wash
 */
export function AmbientBackdrop({ className }: { className?: string }) {
  const themeId = useStore((state) => state.themeId);
  const theme = getThemeById(themeId);
  const meta = getArchetypeMeta(theme.archetype);

  const showAurora = theme.archetype === 'liquid-aurora';
  const showGrid = ['swiss', 'cyber-terminal', 'liquid-aurora'].includes(theme.archetype);
  const showGrain = ['organic-terracotta', 'oxford-heritage', 'neo-brutalism'].includes(
    theme.archetype
  );

  return (
    <div
      aria-hidden="true"
      data-texture={meta.texture}
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden no-print',
        className
      )}
    >
      {/* Base tint */}
      <div className="absolute inset-0 bg-background" />

      {/* Auroral light field */}
      <div
        className={cn(
          'aurora-field',
          showAurora ? 'opacity-90' : 'opacity-[0.16] saturate-[0.9]'
        )}
      />

      {/* Hairline drafting grid */}
      {showGrid && <div className="aurora-grid opacity-70" />}

      {/* Paper / halftone texture */}
      {showGrain && (
        <div
          className="absolute inset-0 opacity-[0.35] mix-blend-soft-light"
          style={{
            backgroundImage:
              'radial-gradient(rgb(var(--foreground) / 0.18) 0.5px, transparent 0.5px)',
            backgroundSize: '6px 6px',
          }}
        />
      )}

      {/* Top prism bloom */}
      {showAurora && (
        <div
          className="absolute inset-x-0 top-0 h-[42vh]"
          style={{
            background:
              'radial-gradient(60% 100% at 50% -10%, rgb(var(--primary) / 0.28), transparent 70%)',
            filter: 'blur(18px)',
          }}
        />
      )}

      {/* Bottom vignette keeps long lists readable */}
      <div
        className="absolute inset-x-0 bottom-0 h-[30vh]"
        style={{
          background:
            'linear-gradient(to top, rgb(var(--background)) 4%, rgb(var(--background) / 0.6) 42%, transparent)',
        }}
      />
    </div>
  );
}
