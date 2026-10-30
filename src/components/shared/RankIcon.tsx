import * as React from 'react';
import { Sprout, BookMarked, Target, GraduationCap, Landmark, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const GLYPHS = {
  sprout: Sprout,
  'book-marked': BookMarked,
  target: Target,
  'graduation-cap': GraduationCap,
  landmark: Landmark,
  crown: Crown,
} as const;

export type RankGlyphName = keyof typeof GLYPHS;

/**
 * Rank marks are drawn, not typed: emoji render differently on every OS and
 * instantly read as a template. Lucide glyphs inherit the theme's ink colour.
 */
export function RankIcon({
  level,
  slug,
  className,
  strokeWidth = 1.75,
}: {
  level?: number;
  slug?: string;
  className?: string;
  strokeWidth?: number;
}) {
  const order: RankGlyphName[] = [
    'sprout',
    'book-marked',
    'target',
    'graduation-cap',
    'landmark',
    'crown',
  ];
  const bySlug =
    slug && slug.length > 0 && slug in GLYPHS ? (slug as RankGlyphName) : undefined;
  const key: RankGlyphName =
    bySlug ?? order[Math.min(order.length, Math.max(1, level ?? 1)) - 1];

  const Glyph = GLYPHS[key];
  return <Glyph aria-hidden="true" className={cn('h-4 w-4', className)} strokeWidth={strokeWidth} />;
}
