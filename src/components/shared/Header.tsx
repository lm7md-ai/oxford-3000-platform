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
  TrendingUp,
} from 'lucide-react';
import { useStore, getLevelInfo } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
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
import { springSnappy } from '@/lib/motion';

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
        <div className="container flex h-16 items-center gap-2 sm:gap-3">
          {/* ---------------- Brand ---------------- */}
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Oxford 3000 الرئيسية">
            <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-br from-white/35 via-transparent to-black/20" />
              <BookOpen className="relative h-[18px] w-[18px]" />
            </span>
            <span className="leading-none">
              <span className="flex items-center gap-1.5 font-heading text-[15px] font-black tracking-tight">
                Oxford 3000™
                <Badge variant="accent" className="archetype-badge px-1.5 py-0 text-[9px] leading-4">
                  PRO
                </Badge>
              </span>
              <span className="mt-1 hidden text-[10px] font-medium text-muted-foreground sm:block">
                {activeTheme.name} · CEFR A1–B2
              </span>
            </span>
          </Link>

          {/* ---------------- Desktop navigation ---------------- */}
          <nav className="ml-2 hidden items-center gap-0.5 lg:flex" aria-label="التنقل الرئيسي">
            <NavMegaMenu currentPath={currentPath} />
            {PRIMARY_LINKS.map((item) => {
              const Icon = item.icon;
              const active = isPathActive(currentPath, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-active={active}
                  aria-current={active ? 'page' : undefined}
                  className="nav-link"
                >
                  {active && !reduceMotion && (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="nav-active-pill"
                      transition={springSnappy}
                    />
                  )}
                  {active && reduceMotion && <span className="nav-active-pill" />}
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ---------------- Actions ---------------- */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="بحث سريع (Ctrl + K)"
              className="archetype-btn group hidden h-8 items-center gap-2 rounded-lg border border-border bg-surface/70 px-2.5 text-[11px] font-bold text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground md:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden xl:inline">بحث سريع…</span>
              <span className="kbd ml-1 hidden xl:inline-flex">⌘K</span>
            </button>

            {/* Audio speed */}
            <div className="relative hidden xl:block">
              <Volume2 className="pointer-events-none absolute left-1.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-primary" />
              <select
                value={audioRate}
                onChange={(event) => setAudioRate(parseFloat(event.target.value))}
                aria-label="سرعة النطق"
                className="h-8 cursor-pointer appearance-none rounded-lg border border-border bg-surface/70 pl-6 pr-5 text-[11px] font-mono font-bold text-foreground transition-colors hover:border-primary/50 focus:border-primary"
                title="سرعة نطق الصوت الطبيعي"
              >
                <option value="0.6">0.6x</option>
                <option value="0.8">0.8x</option>
                <option value="0.9">0.9x</option>
                <option value="1.0">1.0x</option>
                <option value="1.2">1.2x</option>
              </select>
            </div>

            {/* Streak */}
            <div
              className="hidden h-8 items-center gap-1 rounded-lg border border-orange-500/30 bg-orange-500/10 px-2 text-[11px] font-black text-orange-600 dark:text-orange-400 2xl:flex"
              title={`سلسلة الدراسة: ${streak} يوم متواصل`}
            >
              <Flame className="h-3.5 w-3.5" />
              {streak}
            </div>

            {/* XP level ring */}
            <Link
              href="/analytics"
              title={`${level.nameAr} · ${totalXp} XP · ${level.remainingXp} XP للمستوى التالي`}
              className="archetype-btn group hidden h-8 items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-1.5 text-[11px] font-black text-amber-600 transition-transform hover:-translate-y-0.5 dark:text-amber-400 sm:flex"
            >
              <span
                className="ring-progress !h-6 !w-6"
                style={{ ['--pct' as string]: level.progressPercent }}
                aria-hidden="true"
              >
                <span className="!text-[9px]">{level.level}</span>
              </span>
              <span className="tabular-nums">{totalXp}</span>
              <span className="hidden text-[9px] font-bold opacity-70 xl:inline">XP</span>
            </Link>

            <ThemeQuickSwitcher />

            {/* Grok key */}
            <button
              type="button"
              onClick={() => setIsGrokModalOpen(true)}
              title="إعدادات مفتاح Grok (xAI API)"
              aria-label="إعدادات مفتاح الذكاء الاصطناعي"
              className="archetype-btn hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/70 text-foreground transition-colors hover:border-primary/50 hover:text-primary xl:flex"
            >
              <Cpu className="h-3.5 w-3.5" />
            </button>

            {/* Sound */}
            <button
              type="button"
              onClick={toggleSound}
              title={soundEnabled ? 'إيقاف مؤثرات الصوت' : 'تشغيل مؤثرات الصوت'}
              aria-label="تبديل مؤثرات الصوت"
              aria-pressed={soundEnabled}
              className="archetype-btn hidden h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/70 hover:text-foreground xl:flex"
            >
              <Volume2 className={cn('h-4 w-4', !soundEnabled && 'opacity-40')} />
            </button>

            {/* Dark mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="تبديل الوضع الفاتح / الداكن"
              title="تبديل الوضع الفاتح / الداكن"
              className="archetype-btn relative grid h-8 w-8 place-items-center overflow-hidden rounded-lg text-foreground transition-colors hover:bg-muted/70"
            >
              <motion.span
                key={isDarkMode ? 'sun' : 'moon'}
                initial={reduceMotion ? undefined : { rotate: -90, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="grid place-items-center"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 text-amber-500" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </motion.span>
            </button>

            {/* Design studio (desktop shortcut) */}
            <button
              type="button"
              onClick={openStudio}
              aria-label="استوديو التصميم"
              title="استوديو التحول المعماري"
              className="archetype-btn hidden h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface/70 text-foreground transition-colors hover:border-primary/50 hover:text-primary 2xl:flex"
            >
              <Palette className="h-3.5 w-3.5" />
            </button>

            {/* Mobile trigger */}
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="فتح القائمة"
              aria-expanded={isMobileOpen}
              className="archetype-btn grid h-8 w-8 place-items-center rounded-lg border border-border bg-surface/70 text-foreground lg:hidden"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Daily goal micro progress */}
        <div className="container pb-1.5">
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 text-[9px] font-black uppercase tracking-[0.14em] text-muted-foreground sm:flex">
              <TrendingUp className="h-3 w-3 text-primary" />
              هدف اليوم {xpToday}/{dailyGoalXp} XP
            </span>
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-700 ease-out"
                style={{ width: `${goalPercent}%` }}
                role="progressbar"
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="تقدّم هدف الخبرة اليومي"
              />
            </div>
            <span className="text-[9px] font-mono font-bold text-muted-foreground">
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
