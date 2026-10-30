'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { EASE_OUT_EXPO, staggerContainer, staggerItem } from '@/lib/motion';

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
 * Animated page hero used across every workspace: badge, gradient headline,
 * supporting copy, quick stats and an actions slot.
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
  const reduceMotion = useReducedMotion();
  const centered = align === 'center';

  return (
    <motion.section
      variants={reduceMotion ? undefined : staggerContainer(0.08, 0.02)}
      initial={reduceMotion ? undefined : 'hidden'}
      animate={reduceMotion ? undefined : 'visible'}
      className={cn(
        'archetype-card group relative overflow-hidden px-5 py-7 sm:px-8 sm:py-9',
        centered && 'text-center',
        className
      )}
    >
      {/* Decorative mesh */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            'radial-gradient(70% 120% at 88% -20%, rgb(var(--primary) / 0.22), transparent 62%), radial-gradient(60% 100% at 6% 120%, rgb(var(--accent) / 0.16), transparent 60%)',
        }}
      />
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl transition-transform duration-700 group-hover:scale-125" />

      <div
        className={cn(
          'relative z-10 space-y-4',
          centered && 'mx-auto max-w-2xl',
          actions && 'sm:flex sm:items-end sm:justify-between sm:gap-6 sm:space-y-0'
        )}
      >
        <div className={cn('space-y-3', centered && 'flex flex-col items-center')}>
          {(badge || eyebrow) && (
            <motion.div
              variants={reduceMotion ? undefined : staggerItem}
              className="flex flex-wrap items-center gap-2"
            >
              {badge && (
                <Badge variant="accent" className="archetype-badge gap-1.5 px-2.5 py-1 text-[11px]">
                  {badgeIcon}
                  <span>{badge}</span>
                </Badge>
              )}
              {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            </motion.div>
          )}

          <motion.h1
            variants={reduceMotion ? undefined : staggerItem}
            className="text-balance text-2xl font-black leading-[1.15] tracking-tight sm:text-4xl"
          >
            {title}
            {highlight && (
              <>
                {' '}
                <span className="text-gradient">{highlight}</span>
              </>
            )}
          </motion.h1>

          {description && (
            <motion.p
              variants={reduceMotion ? undefined : staggerItem}
              className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
            >
              {description}
            </motion.p>
          )}
        </div>

        {actions && (
          <motion.div
            variants={reduceMotion ? undefined : staggerItem}
            className={cn('flex flex-wrap items-center gap-2 pt-2 sm:pt-0', centered && 'justify-center')}
          >
            {actions}
          </motion.div>
        )}
      </div>

      {stats && stats.length > 0 && (
        <motion.div
          variants={reduceMotion ? undefined : staggerContainer(0.06, 0.12)}
          className="relative z-10 mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={reduceMotion ? undefined : staggerItem}
              className="stat-tile !rounded-[calc(var(--radius)*0.85)] !bg-surface/50 !py-2.5"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {stat.icon}
                <span>{stat.label}</span>
              </div>
              <div className="mt-1 font-heading text-lg font-black leading-none">{stat.value}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {children && <div className="relative z-10 mt-5">{children}</div>}
    </motion.section>
  );
}
