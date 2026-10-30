'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

type RevealTag = 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'span';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before the entrance animation starts */
  delay?: number;
  /** Retained for API compatibility — CSS entrance rises from 14px */
  y?: number;
  /** Retained for API compatibility */
  once?: boolean;
  as?: RevealTag;
  amount?: number;
}

/**
 * Entrance wrapper built on the CSS animation library.
 *
 * Deliberately CSS-only (no JS-driven `opacity: 0`): the content is painted by
 * the stylesheet, so a slow bundle, a blocked script or a failed chunk can
 * never leave the page blank. Reduced-motion rules in globals.css neutralise it.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  amount: _amount,
  once: _once,
  y: _y,
}: RevealProps) {
  const Tag = as as React.ElementType;
  return (
    <Tag
      className={cn('anim-rise', className)}
      style={delay ? { animationDelay: `${Math.round(delay * 1000)}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Staggered group: children animate one after another via `.stagger`. */
export function RevealGroup({
  children,
  className,
  stagger: _stagger,
  gap: _gap,
  amount: _amount,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  gap?: unknown;
  amount?: number;
}) {
  return <div className={cn('stagger', className)}>{children}</div>;
}

/** Child of RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}

/**
 * Lightweight CSS-only staggered entrance for grids with many children
 * (cheaper than per-item animation components for 20+ virtualized cards).
 */
export function StaggerList({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('stagger', className)}>{children}</div>;
}
