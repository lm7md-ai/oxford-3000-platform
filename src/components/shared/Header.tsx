'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BookOpen,
  MessageSquare,
  Gamepad2,
  Sparkles,
  Layers,
  Search,
  Moon,
  Sun,
  Volume2,
  Menu,
  Flame,
  Cpu,
  Palette,
  SlidersHorizontal,
} from 'lucide-react';
import { useStore, getLevelInfo } from '@/lib/store';
import { ThemeStudioModal } from './ThemeStudioModal';
import { GrokKeySettingsModal } from '@/features/ai-engine/components/GrokKeySettingsModal';
import { ThemeQuickSwitcher } from './ThemeQuickSwitcher';
import { NavMegaMenu } from './NavMegaMenu';
import { MobileNav } from './MobileNav';
import { ScrollProgress } from './ScrollProgress';
import { CommandPalette, OPEN_THEME_STUDIO_EVENT } from './CommandPalette';
import { getThemeById } from '@/styles/themes';
import { isPathActive } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const PRIMARY_LINKS = [
  { href: '/', label: 'المفردات', icon: BookOpen },
  { href: '/flashcards', label: 'البطاقات', icon: Layers },
  { href: '/tutor', label: 'المعلم', icon: MessageSquare },
  { href: '/story', label: 'الاستوديو', icon: Sparkles },
  { href: '/games', label: 'الألعاب', icon: Gamepad2 },
] as const;

export function Header({ currentPath }: { currentPath: string }) {
  const [isThemeModalOpen, setIsThemeModalOpen] = React.useState(false);
  const [isGrokModalOpen, setIsGrokModalOpen] = React.useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isToolsOpen, setIsToolsOpen] = React.useState(false);
  const toolsRef = React.useRef<HTMLDivElement | null>(null);

  const themeId = useStore((state) => state.themeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const audioRate = useStore((state) => state.audioPlaybackRate);
  const setAudioRate = useStore((state) => state.setAudioPlaybackRate);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const toggleSound = useStore((state) => state.toggleSound);
  const xpToday = useStore((state) => state.xpToday);
  const dailyGoalXp = useStore((state) => state.dailyGoalXp);
  const reduceMotion = useReducedMotion();

  const activeTheme = getThemeById(themeId);
  const level = getLevelInfo(totalXp);
  const goalPercent = Math.min(100, Math.round((xpToday / Math.max(1, dailyGoalXp)) * 100));

  /* Scroll state for the glass header */
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Tools popover: close on outside click / Escape */
  React.useEffect(() => {
    if (!isToolsOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!toolsRef.current?.contains(event.target as Node)) setIsToolsOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsToolsOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isToolsOpen]);

  /* Global shortcuts: ⌘K / Ctrl+K palette, "T" opens the design studio */
  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === 'INPUT' ||
        target?.tagName === 'TEXTAREA' ||
        target?.isContentEditable;

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsPaletteOpen((open) => !open);
        return;
      }

      if (!isTyping && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (event.key === '/' ) {
          event.preventDefault();
          setIsPaletteOpen(true);
        } else if (event.key.toLowerCase() === 't') {
          setIsThemeModalOpen(true);
        }
      }
    };

    const onOpenStudio = () => setIsThemeModalOpen(true);

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener(OPEN_THEME_STUDIO_EVENT, onOpenStudio);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener(OPEN_THEME_STUDIO_EVENT, onOpenStudio);
    };
  }, []);

  const openStudio = React.useCallback(() => setIsThemeModalOpen(true), []);

  return (
    <>
      <ScrollProgress />

      <header className="nav-shell no-print" data-scrolled={scrolled}>
        <div className="container flex h-[3.75rem] items-center gap-3">
          {/* ---------------- Brand ---------------- */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Oxford 3000 الرئيسية">
            <span className="grid h-8 w-8 place-items-center rounded-sm border border-primary/60 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
              <BookOpen className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <span className="leading-none">
              <span className="ltr-isolate flex items-baseline gap-1.5 font-heading text-[15px] font-semibold tracking-[-0.01em]" dir="ltr">
                Oxford 3000
                <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  ™
                </span>
              </span>
              <span className="mt-1.5 hidden text-[9.5px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:block">
                المعجم الكامل · A1–B2
              </span>
            </span>
          </Link>

          <span aria-hidden="true" className="mx-1 hidden h-5 w-px bg-border lg:block" />

          {/* ---------------- Desktop navigation ---------------- */}
          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="التنقل الرئيسي">
            <NavMegaMenu currentPath={currentPath} />
            {PRIMARY_LINKS.map((item) => {
              const active = isPathActive(currentPath, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  aria-current={active ? 'page' : undefined}
                  className="nav-link"
                >
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ---------------- Actions ---------------- */}
          <div className="ml-auto flex items-center gap-1">
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="بحث سريع (Ctrl + K)"
              className="archetype-btn hidden h-8 items-center gap-2 rounded-md border border-border bg-transparent px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground md:flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden xl:inline">بحث…</span>
              <span className="kbd ml-1 hidden xl:inline-flex">⌘K</span>
            </button>

            {/* Streak — quiet, no badge box */}
            <span
              className="hidden items-center gap-1 px-1.5 text-[11px] font-medium tabular-nums text-muted-foreground 2xl:flex"
              title={`سلسلة الدراسة: ${streak} يوم متواصل`}
            >
              <Flame className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              {streak}
            </span>

            {/* Level + XP */}
            <Link
              href="/analytics"
              title={`${level.nameAr} · ${totalXp} XP · ${level.remainingXp} XP للمستوى التالي`}
              className="hidden h-8 items-center gap-1.5 rounded-md border border-border px-2 text-[11px] font-semibold tabular-nums text-foreground transition-colors hover:border-primary/45 sm:flex"
            >
              <span
                className="ring-progress !h-4 !w-4"
                style={{ ['--pct' as string]: level.progressPercent }}
                aria-hidden="true"
              />
              <span className="text-muted-foreground">L{level.level}</span>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              <span>{totalXp}</span>
              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
                XP
              </span>
            </Link>

            <ThemeQuickSwitcher />

            {/* Tools popover — replaces four separate icon buttons */}
            <div className="relative hidden xl:block" ref={toolsRef}>
              <button
                type="button"
                onClick={() => setIsToolsOpen((open) => !open)}
                aria-label="أدوات الصوت والذكاء الاصطناعي"
                aria-expanded={isToolsOpen}
                aria-haspopup="menu"
                className="archetype-btn grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
              >
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>

              {isToolsOpen && (
                <div
                  role="menu"
                  className="absolute end-0 top-[calc(100%+0.5rem)] z-50 w-60 rounded-md border border-border bg-surface p-3 shadow-[var(--card-shadow-hover)]"
                >
                  <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    الصوت والذكاء الاصطناعي
                  </p>

                  <label className="mb-1 flex items-center justify-between text-[11.5px] font-medium">
                    سرعة النطق
                    <select
                      value={audioRate}
                      onChange={(event) => setAudioRate(parseFloat(event.target.value))}
                      className="h-7 cursor-pointer rounded-sm border border-border bg-transparent px-1 text-[11px] tabular-nums focus:border-primary"
                    >
                      <option value="0.6">0.6×</option>
                      <option value="0.8">0.8×</option>
                      <option value="0.9">0.9×</option>
                      <option value="1.0">1.0×</option>
                      <option value="1.2">1.2×</option>
                    </select>
                  </label>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={toggleSound}
                    aria-pressed={soundEnabled}
                    className="mt-1 flex w-full items-center justify-between rounded-sm px-1 py-1.5 text-[11.5px] font-medium hover:bg-muted/60"
                  >
                    المؤثرات الصوتية
                    <span className={cn('text-[10px] font-semibold', soundEnabled ? 'text-primary' : 'text-muted-foreground')}>
                      {soundEnabled ? 'مفعّلة' : 'موقوفة'}
                    </span>
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsToolsOpen(false);
                      setIsGrokModalOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-1 py-1.5 text-[11.5px] font-medium hover:bg-muted/60"
                  >
                    <Cpu className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    مفتاح Grok
                  </button>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setIsToolsOpen(false);
                      openStudio();
                    }}
                    className="flex w-full items-center gap-2 rounded-sm px-1 py-1.5 text-[11.5px] font-medium hover:bg-muted/60"
                  >
                    <Palette className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
                    استوديو التصميم
                    <span className="kbd ms-auto">T</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dark mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="تبديل الوضع الفاتح / الداكن"
              title="تبديل الوضع الفاتح / الداكن"
              className="archetype-btn relative grid h-8 w-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              <motion.span
                key={isDarkMode ? 'sun' : 'moon'}
                initial={false}
                animate={reduceMotion ? undefined : { rotate: [isDarkMode ? -60 : 60, 0], scale: [0.7, 1] }}
                transition={{ duration: 0.32 }}
                className="grid place-items-center"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </motion.span>
            </button>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={isMobileOpen}
              className="archetype-btn grid h-8 w-8 place-items-center rounded-md border border-border text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Daily goal — a hairline, not a bar chart */}
        <div className="container pb-2">
          <div className="flex items-center gap-2.5">
            <span className="hidden text-[9px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
              هدف اليوم · {xpToday}/{dailyGoalXp} XP
            </span>
            <div className="h-[2px] flex-1 overflow-hidden bg-border/70">
              <div
                className="h-full bg-primary transition-[width] duration-700 ease-out"
                style={{ width: `${goalPercent}%` }}
                role="progressbar"
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="تقدّم هدف الخبرة اليومي"
              />
            </div>
            <span className="text-[9px] font-medium tabular-nums text-muted-foreground">
              {goalPercent}%
            </span>
          </div>
        </div>
      </header>

      {/* Overlays */}
      <CommandPalette open={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
      <MobileNav
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        currentPath={currentPath}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenStudio={openStudio}
      />
      <ThemeStudioModal isOpen={isThemeModalOpen} onClose={() => setIsThemeModalOpen(false)} />
      <GrokKeySettingsModal isOpen={isGrokModalOpen} onClose={() => setIsGrokModalOpen(false)} />
    </>
  );
}
