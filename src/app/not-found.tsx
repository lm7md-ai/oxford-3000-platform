'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Compass, Home, Palette, Search, BookOpen } from 'lucide-react';
import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop';
import { EASE_OUT_EXPO } from '@/lib/motion';

export default function NotFound() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <AmbientBackdrop />

      <motion.div
        initial={reduceMotion ? undefined : { opacity: 0, y: 18 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE_OUT_EXPO }}
        className="archetype-card relative w-full max-w-lg overflow-hidden p-8 text-center"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              'radial-gradient(70% 120% at 50% -20%, rgb(var(--primary) / 0.28), transparent 60%)',
          }}
        />

        <div className="relative space-y-4">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary">
            <Compass className="h-6 w-6" />
          </span>

          <p className="font-heading text-6xl font-black leading-none tracking-tight text-gradient">
            404
          </p>
          <h1 className="font-heading text-xl font-black">هذه الصفحة ليست في المعجم</h1>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            الرابط الذي تحاول الوصول إليه غير موجود. يمكنك العودة إلى شبكة المفردات أو استكشاف لغات
            التصميم الست.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Link
              href="/"
              className="archetype-btn inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black text-primary-foreground"
            >
              <Home className="h-3.5 w-3.5" />
              شبكة المفردات
            </Link>
            <Link
              href="/design"
              className="archetype-btn inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-black"
            >
              <Palette className="h-3.5 w-3.5 text-primary" />
              معرض التصاميم
            </Link>
            <Link
              href="/flashcards"
              className="archetype-btn inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-black"
            >
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              بطاقات SRS
            </Link>
          </div>

          <p className="flex items-center justify-center gap-1 pt-2 text-[10.5px] font-bold text-muted-foreground">
            <Search className="h-3 w-3" />
            أو استخدم لوحة الأوامر
            <span className="kbd">⌘K</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
