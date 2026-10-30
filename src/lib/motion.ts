'use client';

import type { Transition, Variants } from 'framer-motion';

/* =========================================================================
 * SHARED MOTION TOKENS
 * Every animation in the platform is derived from these curves so archetype
 * transitions feel coherent no matter which design language is active.
 * ========================================================================= */

export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const EASE_SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
export const EASE_SOFT: [number, number, number, number] = [0.4, 0, 0.2, 1];

export const springSoft: Transition = { type: 'spring', stiffness: 260, damping: 28, mass: 0.7 };
export const springSnappy: Transition = { type: 'spring', stiffness: 420, damping: 32, mass: 0.6 };
export const tweenBase: Transition = { duration: 0.32, ease: EASE_OUT_EXPO };
export const tweenSlow: Transition = { duration: 0.6, ease: EASE_OUT_EXPO };

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: tweenBase },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: tweenSlow },
};

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: tweenBase },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { ...tweenBase, ease: EASE_SPRING } },
};

export const blurIn: Variants = {
  hidden: { opacity: 0, filter: 'blur(10px)', y: 10 },
  visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: tweenSlow },
};

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: tweenBase },
  exit: { opacity: 0, x: 24, transition: { duration: 0.2, ease: EASE_SOFT } },
};

export const staggerContainer = (stagger = 0.06, delayChildren = 0.04): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: EASE_OUT_EXPO },
  },
};

/** Dropdown / popover entrance used by the navigation menus. */
export const menuPanel: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: EASE_OUT_EXPO } },
  exit: { opacity: 0, y: -6, scale: 0.98, transition: { duration: 0.14, ease: EASE_SOFT } },
};

export const drawerPanel: Variants = {
  hidden: { x: '-100%' },
  visible: { x: 0, transition: springSoft },
  exit: { x: '-100%', transition: { duration: 0.22, ease: EASE_SOFT } },
};

/** Page level entrance used by PageShell. */
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT_EXPO } },
};
