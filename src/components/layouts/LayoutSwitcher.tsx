'use client';

import * as React from 'react';
import { LAYOUTS, type LayoutId } from '@/lib/layouts';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

/**
 * Three structural interfaces. Switching here changes navigation placement,
 * the home page order and the content width — not just the colours.
 */
export function LayoutSwitcher({
  variant = 'segmented',
  className,
}: {
  variant?: 'segmented' | 'list';
  className?: string;
}) {
  const layoutId = useStore((state) => state.layoutId) as LayoutId;
  const setLayoutId = useStore((state) => state.setLayoutId);
  const active = LAYOUTS.find((layout) => layout.id === layoutId) ?? LAYOUTS[0];

  if (variant === 'list') {
    return (
      <div className={cn('grid gap-1', className)} role="radiogroup" aria-label="واجهة الموقع">
        {LAYOUTS.map((layout) => {
          const Icon = layout.icon;
          const selected = layout.id === layoutId;
          return (
            <button
              key={layout.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => setLayoutId(layout.id)}
              className={cn(
                'flex w-full items-start gap-2.5 rounded-md border p-2.5 text-start transition-colors',
                selected
                  ? 'border-primary/50 bg-primary/[0.06]'
                  : 'border-border hover:border-foreground/25'
              )}
            >
              <Icon
                className={cn(
                  'mt-0.5 h-4 w-4 shrink-0',
                  selected ? 'text-primary' : 'text-muted-foreground'
                )}
                aria-hidden="true"
              />
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold">
                  {layout.nameAr}
                  <span className="ltr-isolate ms-1.5 text-[9.5px] font-medium uppercase tracking-wider text-muted-foreground">
                    {layout.nameEn}
                  </span>
                </span>
                <span className="mt-0.5 block text-[10.5px] leading-relaxed text-muted-foreground">
                  {layout.tagline}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-0.5 rounded-md border border-border p-0.5',
        className
      )}
      role="radiogroup"
      aria-label="واجهة الموقع"
      title={`الواجهة الحالية: ${active.nameAr}`}
    >
      {LAYOUTS.map((layout) => {
        const Icon = layout.icon;
        const selected = layout.id === layoutId;
        return (
          <button
            key={layout.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`واجهة ${layout.nameAr}`}
            onClick={() => setLayoutId(layout.id)}
            className={cn(
              'grid h-7 w-7 place-items-center rounded-sm transition-colors',
              selected
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
