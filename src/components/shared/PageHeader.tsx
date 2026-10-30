'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderStat {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface PageHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  eyebrow?: string;
  title: string;
  highlight?: string;
  description?: string;
  actions?: React.ReactNode;
  stats?: PageHeaderStat[];
  align?: 'start' | 'center';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Page hero used across every workspace.
 *
 * Animations are pure CSS (`.anim-blur` + `.stagger`) so the content is painted
 * by the stylesheet — it can never end up stuck at `opacity: 0` if JavaScript
 * is slow, blocked or a chunk fails to load.
 */
export function PageHeader({
  badge,
  badgeIcon,
  eyebrow,
  title,
  highlight,
  description,
  actions,
  stats,
  align = 'start',
  className,
  children,
}: PageHeaderProps) {
  const centered = align === 'center';

  return (
    <section
      className={cn('anim-blur relative border-b border-border pb-7 pt-1 sm:pb-9', centered && 'text-center')}
    >
      {/* Masthead metadata */}
      {(badge || eyebrow) && (
        <div
          className={cn(
            'flex flex-wrap items-center justify-between gap-2 pb-3 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground',
            centered && 'justify-center'
          )}
        >
          <span className="flex items-center gap-2">
            {badgeIcon && <span className="text-primary">{badgeIcon}</span>}
            {badge && <span className="text-foreground">{badge}</span>}
            {eyebrow && (
              <>
                <span aria-hidden="true" className="h-3 w-px bg-border" />
                <span>{eyebrow}</span>
              </>
            )}
          </span>
          <span aria-hidden="true" className="hidden h-px flex-1 bg-border/60 sm:block" />
        </div>
      )}

      <div
        className={cn(
          'stagger grid gap-6',
          actions ? 'sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end' : 'grid-cols-1'
        )}
      >
        <div className="space-y-3.5">
          <h1 className="text-balance text-[1.85rem] font-semibold leading-[1.3] text-foreground sm:text-[2.5rem] sm:leading-[1.22]">
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-primary">{highlight}</span>
              </>
            )}
          </h1>

          {description && (
            <p className={cn('max-w-[58ch] text-[13.5px] leading-[1.9] text-muted-foreground', centered && 'mx-auto')}>
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className={cn('flex flex-wrap items-center gap-2', centered && 'justify-center')}>
            {actions}
          </div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <dl className="stagger mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-surface px-4 py-3">
              <dt className="flex items-center gap-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {stat.icon}
                <span>{stat.label}</span>
              </dt>
              <dd className="mt-1.5 font-heading text-[1.05rem] font-semibold leading-none">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {children && <div className="relative mt-6">{children}</div>}
    </section>
  );
}
