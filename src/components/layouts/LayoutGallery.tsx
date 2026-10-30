'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { LAYOUTS, type LayoutId } from '@/lib/layouts';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* Wireframe previews — three visibly different structures             */
/* ------------------------------------------------------------------ */
function Preview({ id }: { id: LayoutId }) {
  if (id === 'workspace') {
    return (
      <div className="flex h-32 overflow-hidden rounded-sm border border-border bg-background">
        <div className="hidden w-10 shrink-0 flex-col gap-1 border-e border-border p-1.5 sm:flex">
          <span className="h-1.5 w-full rounded-full bg-primary/70" />
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className="h-1 w-full rounded-full bg-foreground/15" />
          ))}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center gap-1 border-b border-border px-2 py-1.5">
            <span className="h-1 w-8 rounded-full bg-foreground/30" />
            <span className="ms-auto h-1.5 w-6 rounded-full bg-foreground/15" />
          </div>
          <div className="grid grid-cols-4 gap-1 p-2">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-5 rounded-sm border border-border bg-surface" />
            ))}
          </div>
          <div className="space-y-1 px-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className="block h-2 w-full rounded-sm bg-foreground/[0.07]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id === 'showcase') {
    return (
      <div className="relative h-32 overflow-hidden rounded-sm border border-border bg-background">
        <div className="absolute inset-x-0 top-2 flex justify-center">
          <span className="flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1 w-4 rounded-full bg-foreground/20" />
            ))}
          </span>
        </div>
        <div className="flex h-full flex-col justify-center gap-1.5 px-4 pt-6">
          <span className="h-3 w-3/4 rounded-sm bg-foreground/80" />
          <span className="h-3 w-1/2 rounded-sm bg-primary/70" />
          <span className="mt-1 h-1.5 w-2/3 rounded-full bg-foreground/15" />
          <span className="mt-1 h-4 w-14 rounded-full bg-primary" />
        </div>
        <div className="absolute inset-x-4 bottom-2 flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-6 flex-1 rounded-sm border border-border bg-surface" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-32 overflow-hidden rounded-sm border border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-2 py-1.5">
        <span className="h-1.5 w-10 rounded-full bg-foreground/40" />
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-1 w-4 rounded-full bg-foreground/20" />
          ))}
        </span>
      </div>
      <div className="grid grid-cols-[1.6fr_1fr] gap-2 p-2">
        <div className="space-y-1">
          <span className="block h-2.5 w-full rounded-sm bg-foreground/80" />
          <span className="block h-2.5 w-2/3 rounded-sm bg-foreground/80" />
          <span className="mt-1 block h-1 w-full rounded-full bg-foreground/15" />
          <span className="block h-1 w-4/5 rounded-full bg-foreground/15" />
          <span className="mt-1.5 block h-3 w-12 rounded-sm bg-primary" />
        </div>
        <div className="space-y-1 border-s border-border ps-2">
          <span className="block h-1 w-8 rounded-full bg-primary/60" />
          <span className="block h-3 w-full rounded-sm bg-foreground/25" />
          <span className="block h-1 w-3/4 rounded-full bg-foreground/15" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-px border-t border-border bg-border">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className="h-4 bg-surface" />
        ))}
      </div>
    </div>
  );
}

export function LayoutGallery() {
  const layoutId = useStore((state) => state.layoutId) as LayoutId;
  const setLayoutId = useStore((state) => state.setLayoutId);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-2.5">
        <h2 className="font-heading text-[1.15rem] font-semibold">
          ثلاث واجهات — ثلاثة مواقع مختلفة
        </h2>
        <span className="text-[10.5px] font-medium text-muted-foreground">
          الترتيب والتنقّل والغلاف يتغيّر بالكامل
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {LAYOUTS.map((layout) => {
          const selected = layout.id === layoutId;
          const Icon = layout.icon;
          return (
            <div
              key={layout.id}
              className={cn(
                'flex flex-col gap-3 rounded-md border p-3 transition-colors',
                selected ? 'border-primary/60 bg-primary/[0.04]' : 'border-border bg-surface'
              )}
            >
              <Preview id={layout.id} />

              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="flex items-center gap-1.5 text-[13px] font-semibold">
                    <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    {layout.nameAr}
                    <span
                      className="ltr-isolate text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                      dir="ltr"
                    >
                      {layout.nameEn}
                    </span>
                  </h3>
                  <p className="mt-1.5 text-[11px] leading-[1.8] text-muted-foreground">
                    {layout.description}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-2.5">
                <span className="text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {layout.nav === 'top'
                    ? 'تنقّل أفقي'
                    : layout.nav === 'sidebar'
                      ? 'شريط جانبي'
                      : 'شريط عائم'}
                </span>
                <button
                  type="button"
                  onClick={() => setLayoutId(layout.id)}
                  aria-pressed={selected}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-sm px-2.5 py-1 text-[10.5px] font-semibold transition-colors',
                    selected
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:border-primary/45 hover:text-primary'
                  )}
                >
                  {selected ? (
                    <>
                      <Check className="h-3 w-3" aria-hidden="true" />
                      مفعّلة
                    </>
                  ) : (
                    'تفعيل'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
