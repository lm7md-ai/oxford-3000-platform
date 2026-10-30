'use client';

import * as React from 'react';
import { useStore } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { getArchetypeMeta } from '@/styles/archetypes';
import { QueryClientProvider } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/query-client';

/* ------------------------------------------------------------------ */
/* Color utilities                                                     */
/* ------------------------------------------------------------------ */

type Rgb = { r: number; g: number; b: number; a: number };

function parseColor(value: string): Rgb | null {
  if (!value) return null;
  const trimmed = value.trim();

  // #rgb / #rrggbb / #rrggbbaa
  if (trimmed.startsWith('#')) {
    const hex = trimmed.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1,
      };
    }
    if (hex.length === 6 || hex.length === 8) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: hex.length === 8 ? parseInt(hex.slice(6, 8), 16) / 255 : 1,
      };
    }
    return null;
  }

  // rgb() / rgba()
  const match = trimmed.match(
    /rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?\s*\)/i
  );
  if (match) {
    return {
      r: Math.round(parseFloat(match[1])),
      g: Math.round(parseFloat(match[2])),
      b: Math.round(parseFloat(match[3])),
      a: match[4] !== undefined ? Math.min(1, parseFloat(match[4])) : 1,
    };
  }

  return null;
}

/**
 * Converts any supported color string into a `r g b` triplet usable by CSS
 * variables (Tailwind `rgb(var(--token) / <alpha>)`). Translucent colors are
 * composited over the page background so tokens always stay legible.
 */
function toTriplet(
  value: string,
  backdrop?: Rgb,
  options: { minAlpha?: number; maxAlpha?: number } = {}
): string {
  const parsed = parseColor(value) ?? parseColor(backdrop ? '#ffffff' : '#000000');
  if (!parsed) return '255 255 255';

  let alpha = parsed.a;
  if (options.minAlpha !== undefined) alpha = Math.max(alpha, options.minAlpha);
  if (options.maxAlpha !== undefined) alpha = Math.min(alpha, options.maxAlpha);

  if (alpha >= 0.999 || !backdrop) {
    return `${parsed.r} ${parsed.g} ${parsed.b}`;
  }

  const r = Math.round(parsed.r * alpha + backdrop.r * (1 - alpha));
  const g = Math.round(parsed.g * alpha + backdrop.g * (1 - alpha));
  const b = Math.round(parsed.b * alpha + backdrop.b * (1 - alpha));
  return `${r} ${g} ${b}`;
}

function setVar(root: HTMLElement, name: string, value: string) {
  if (root.style.getPropertyValue(name) !== value) {
    root.style.setProperty(name, value);
  }
}

/* ------------------------------------------------------------------ */
/* Provider                                                            */
/* ------------------------------------------------------------------ */

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeId = useStore((state) => state.themeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const reduceMotion = useStore((state) => state.reduceMotion);
  const compactMode = useStore((state) => state.compactMode);
  const hydrate = useStore((state) => state.hydrate);
  const hasHydrated = useStore((state) => state.hasHydrated);
  const prevThemeRef = React.useRef<string | null>(null);
  const queryClient = React.useMemo(() => getQueryClient(), []);

  // Re-hydrate persisted progress after mount (keeps SSR markup stable)
  React.useEffect(() => {
    if (!hasHydrated) hydrate();
  }, [hasHydrated, hydrate]);

  // Apply the design system to <html>
  React.useEffect(() => {
    const theme = getThemeById(themeId);
    const meta = getArchetypeMeta(theme.archetype);
    const colors = isDarkMode ? theme.dark : theme.light;
    const root = document.documentElement;
    const mode = isDarkMode ? 'dark' : 'light';

    root.setAttribute('data-archetype', meta.id);
    root.setAttribute('data-theme', theme.id);
    root.setAttribute('data-texture', meta.texture);
    root.setAttribute('data-motion', meta.motion);
    root.setAttribute('data-mode', mode);
    root.style.colorScheme = mode;
    root.classList.toggle('dark', isDarkMode);
    root.classList.toggle('reduce-motion', reduceMotion);
    root.classList.toggle('compact-mode', compactMode);

    const background = parseColor(colors.background) ?? { r: 255, g: 255, b: 255, a: 1 };

    setVar(root, '--background', toTriplet(colors.background));
    setVar(root, '--surface', toTriplet(colors.surface, background));
    setVar(root, '--surface-raised', toTriplet(colors.surface, background, { minAlpha: 0.92 }));
    setVar(root, '--foreground', toTriplet(colors.foreground, background));
    setVar(root, '--primary', toTriplet(colors.primary));
    setVar(root, '--primary-foreground', toTriplet(colors.primaryForeground));
    setVar(root, '--accent', toTriplet(colors.accent));
    setVar(root, '--accent-foreground', toTriplet(colors.accentForeground));
    setVar(root, '--muted', toTriplet(colors.muted, background));
    setVar(root, '--muted-foreground', toTriplet(colors.mutedForeground, background));
    setVar(
      root,
      '--border',
      toTriplet(colors.border, background, { minAlpha: isDarkMode ? 0.3 : 0.22 })
    );
    setVar(root, '--ring', toTriplet(colors.ring));
    setVar(root, '--radius', theme.radius);
    setVar(root, '--font-heading', theme.headingFont);
    setVar(root, '--font-body', theme.bodyFont);

    // Depth color follows the design language:
    //  · neo-brutalism keeps the classic hard black/white offset shadow
    //  · everything else derives its shadow tint from the page backdrop
    const shadowTriplet =
      meta.id === 'neo-brutalism'
        ? isDarkMode
          ? '255 255 255'
          : '0 0 0'
        : `${background.r} ${background.g} ${background.b}`;
    setVar(root, '--shadow-color', shadowTriplet);

    // Sync the browser chrome on mobile
    let themeMeta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (!themeMeta) {
      themeMeta = document.createElement('meta');
      themeMeta.name = 'theme-color';
      document.head.appendChild(themeMeta);
    }
    const bg = parseColor(colors.background);
    if (bg) {
      themeMeta.content = `rgb(${bg.r}, ${bg.g}, ${bg.b})`;
    }

    // One-shot palette morph so theme switching feels intentional
    if (prevThemeRef.current && prevThemeRef.current !== `${theme.id}-${mode}`) {
      root.classList.add('theme-morph');
      const timer = window.setTimeout(() => root.classList.remove('theme-morph'), 380);
      prevThemeRef.current = `${theme.id}-${mode}`;
      return () => window.clearTimeout(timer);
    }
    prevThemeRef.current = `${theme.id}-${mode}`;
    return undefined;
  }, [themeId, isDarkMode, reduceMotion, compactMode]);

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
