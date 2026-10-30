'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Heart, Palette, Keyboard, Layers } from 'lucide-react';
import { NAV_ITEMS } from '@/lib/navigation';
import { ARCHETYPES, DESIGN_GENERATIONS } from '@/styles/archetypes';
import { THEMES } from '@/styles/themes';
import { useStore } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { OPEN_THEME_STUDIO_EVENT } from './CommandPalette';
import { getLevelInfo } from '@/lib/store';
import { RankIcon } from './RankIcon';

export function Footer() {
  const themeId = useStore((state) => state.themeId);
  const totalXp = useStore((state) => state.totalXp);
  const theme = getThemeById(themeId);
  const level = getLevelInfo(totalXp);

  const openStudio = () => window.dispatchEvent(new CustomEvent(OPEN_THEME_STUDIO_EVENT));

  return (
    <footer className="relative mt-20 border-t border-border bg-transparent no-print">
      <div className="container py-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_0.8fr_0.8fr_1.1fr] md:gap-10">
          {/* Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-sm border border-primary/60 text-primary">
                <BookOpen className="h-[15px] w-[15px]" strokeWidth={1.75} />
              </span>
              <div>
                <p className="ltr-isolate font-heading text-[13.5px] font-semibold leading-none" dir="ltr">
                  Oxford 3000™ Platform
                </p>
                <p className="mt-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  CEFR A1 → B2 · {THEMES.length} نموذجًا · 6 مدارس تصميم
                </p>
              </div>
            </div>
            <p className="max-w-xs text-[11.5px] leading-[1.9] text-muted-foreground">
              منصة تعلّم متكاملة تجمع المعجم الكامل، النطق، تقييم الكلام، الذكاء الاصطناعي، والمراجعة
              المتباعدة — بواجهة قابلة للتحوّل بالكامل.
            </p>
            <div className="flex flex-wrap gap-1">
              {DESIGN_GENERATIONS.map((generation) => (
                <span
                  key={generation.generation}
                  className="ltr-isolate rounded-sm border border-border px-1.5 py-0.5 text-[9px] font-semibold text-muted-foreground"
                  title={generation.labelAr}
                >
                  G{generation.generation}
                </span>
              ))}
            </div>
          </div>

          {/* Workspaces */}
          <div className="space-y-1.5">
            <p className="eyebrow">المساحات</p>
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* More */}
          <div className="space-y-1.5">
            <p className="eyebrow">أدوات</p>
            {NAV_ITEMS.slice(4).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-1 text-[11.5px] font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openStudio}
              className="mt-2 inline-flex items-center gap-1.5 border-b border-border pb-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <Palette className="h-3 w-3" aria-hidden="true" />
              استوديو التصميم
            </button>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <p className="eyebrow">الحالة</p>
            <div className="border-y border-border py-2.5">
              <p className="flex items-center justify-between gap-2 text-[10.5px] font-medium">
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" />
                  التصميم النشط
                </span>
                <span className="text-foreground">{theme.name}</span>
              </p>
              <p className="mt-1 flex items-center justify-between text-[10.5px] font-bold">
                <span className="flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  الرتبة
                </span>
                <span>
                  <RankIcon level={level.level} className="h-3.5 w-3.5" /> {level.nameAr}
                </span>
              </p>
              <div className="mt-2 h-[2px] overflow-hidden bg-border">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-medium text-muted-foreground">
              <Keyboard className="h-3 w-3" aria-hidden="true" />
              <span className="kbd">⌘K</span> أوامر
              <span className="kbd">T</span> تصميم
              <span className="kbd">/</span> بحث
            </div>
            <div className="flex flex-wrap gap-1">
              {ARCHETYPES.map((meta) => (
                <span
                  key={meta.id}
                  className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: meta.signature[0] }}
                  title={meta.nameAr}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-border pt-4 text-[10px] text-muted-foreground sm:flex-row">
          <p className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-foreground">Oxford 3000™ Enterprise Lexicon</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span>CEFR A1 — B2</span>
            <span aria-hidden="true" className="opacity-40">·</span>
            <span className="tabular-nums">{totalXp} XP</span>
          </p>
          <p className="flex items-center gap-1.5">
            صُنع بعناية لتعليم المفردات
            <Heart className="h-3 w-3 text-primary/70" aria-hidden="true" />
          </p>
        </div>
      </div>
    </footer>
  );
}
