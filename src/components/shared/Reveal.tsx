'use client';

import * as React from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO, staggerContainer, staggerItem } from '@/lib/motion';

type RevealTag = 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'span';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
  as?: RevealTag;
  amount?: number;
}

/**
 * Scroll-triggered entrance wrapper. Automatically collapses to a no-op
 * animation when the visitor prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
  once = true,
  as = 'div',
  amount = 0.2,
}: RevealProps) {
  const reduceSystem = useReducedMotion();
  const MotionTag = motion[as] as typeof motion.div;

  if (reduceSystem) {
    return <div className={className}>{children}</div>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.55, ease: EASE_OUT_EXPO, delay }}
    >
      {children}
    </MotionTag>
  );
}

/** Staggered list: children animate one after another as they scroll into view. */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  gap,
  amount = 0.12,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  gap?: Variants['visible'];
  amount?: number;
}) {
  const reduceSystem = useReducedMotion();
  if (reduceSystem) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer(stagger)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
    >
      {children}
    </motion.div>
  );
}

/** Child of RevealGroup. */
export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Lightweight CSS-only staggered entrance for grids with many children
 * (cheaper than per-item motion components for 20+ virtualized cards).
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
