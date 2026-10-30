'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Heart, Palette, Keyboard, ArrowUpRight, Layers } from 'lucide-react';
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
    <footer className="relative mt-16 overflow-hidden border-t border-border/70 bg-surface/50 no-print">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/2 h-48 w-[70%] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="container relative py-8">
        <div className="grid gap-6 md:grid-cols-[1.3fr_1fr_1fr_1.1fr]">
          {/* Brand */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </span>
              <div>
                <p className="font-heading text-sm font-black leading-none">
                  Oxford 3000™ Platform
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  CEFR A1 → B2 · {THEMES.length} نماذج · 6 لغات تصميم
                </p>
              </div>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-muted-foreground">
              منصة تعلّم متكاملة تجمع المعجم الكامل، النطق، تقييم الكلام، الذكاء الاصطناعي، والمراجعة
              المتباعدة — بواجهة قابلة للتحوّل بالكامل.
            </p>
            <div className="flex flex-wrap gap-1">
              {DESIGN_GENERATIONS.map((generation) => (
                <span
                  key={generation.generation}
                  className="rounded-full bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] font-black text-muted-foreground"
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
                className="group flex items-center gap-1 text-[11.5px] font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
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
                className="group flex items-center gap-1 text-[11.5px] font-bold text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                {item.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={openStudio}
              className="mt-1 flex items-center gap-1.5 rounded-lg border border-border/70 px-2 py-1 text-[10.5px] font-black text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              <Palette className="h-3 w-3" />
              استوديو التحول المعماري
            </button>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <p className="eyebrow">الحالة</p>
            <div className="rounded-xl border border-border/70 bg-surface/60 p-2.5">
              <p className="flex items-center justify-between text-[10.5px] font-bold">
                <span className="flex items-center gap-1">
                  <Layers className="h-3 w-3 text-primary" />
                  التصميم النشط
                </span>
                <span className="text-primary">{theme.name}</span>
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
              <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-muted/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${level.progressPercent}%` }}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Keyboard className="h-3 w-3" />
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

        <div className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-border/60 pt-4 text-[10.5px] text-muted-foreground sm:flex-row">
          <p className="flex flex-wrap items-center gap-1.5">
            <span className="font-semibold text-foreground">Oxford 3000™ Enterprise Lexicon</span>
            <span className="opacity-50">•</span>
            <span>CEFR A1 to B2 Complete Framework</span>
            <span className="opacity-50">•</span>
            <span className="font-mono">{totalXp} XP</span>
          </p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> for English mastery
          </p>
        </div>
      </div>
    </footer>
  );
}
