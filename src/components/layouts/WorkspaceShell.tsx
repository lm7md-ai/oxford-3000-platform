'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Search, Menu, Flame, Sun, Moon } from 'lucide-react';
import { NAV_ITEMS, isPathActive } from '@/lib/navigation';
import { useStore, getLevelInfo } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { cn } from '@/lib/utils';
import { CommandPalette, OPEN_THEME_STUDIO_EVENT } from '@/components/shared/CommandPalette';
import { MobileNav } from '@/components/shared/MobileNav';
import { ThemeStudioModal } from '@/components/shared/ThemeStudioModal';
import { GrokKeySettingsModal } from '@/features/ai-engine/components/GrokKeySettingsModal';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { ThemeQuickSwitcher } from '@/components/shared/ThemeQuickSwitcher';
import { LayoutSwitcher } from './LayoutSwitcher';

/**
 * WORKSPACE INTERFACE — an application shell.
 * Navigation lives in a fixed vertical rail, the page keeps a command bar on
 * top, numbers come first, and content breathes inside a wide canvas.
 */
export function WorkspaceShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isStudioOpen, setIsStudioOpen] = React.useState(false);
  const [isGrokOpen, setIsGrokOpen] = React.useState(false);

  const themeId = useStore((state) => state.themeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const xpToday = useStore((state) => state.xpToday);
  const dailyGoalXp = useStore((state) => state.dailyGoalXp);

  const theme = getThemeById(themeId);
  const level = getLevelInfo(totalXp);
  const goalPercent = Math.min(100, Math.round((xpToday / Math.max(1, dailyGoalXp)) * 100));
  const active = NAV_ITEMS.find((item) => isPathActive(currentPath, item.href)) ?? NAV_ITEMS[0];

  React.useEffect(() => {
    const openStudio = () => setIsStudioOpen(true);
    window.addEventListener(OPEN_THEME_STUDIO_EVENT, openStudio);

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
        if (event.key === '/') {
          event.preventDefault();
          setIsPaletteOpen(true);
        } else if (event.key.toLowerCase() === 't') {
          setIsStudioOpen(true);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener(OPEN_THEME_STUDIO_EVENT, openStudio);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <a href="#main-content" className="skip-link no-print">
        تخطَّ إلى المحتوى الرئيسي
      </a>

      {/* ---------------- Vertical rail ---------------- */}
      <aside className="no-print fixed inset-y-0 start-0 z-40 hidden w-60 flex-col border-e border-border bg-surface/70 backdrop-blur-xl lg:flex">
        <Link
          href="/"
          className="flex items-center gap-2.5 border-b border-border px-4 py-4"
          aria-label="Oxford 3000 الرئيسية"
        >
          <span className="grid h-8 w-8 place-items-center rounded-sm border border-primary/60 text-primary">
            <BookOpen className="h-[15px] w-[15px]" strokeWidth={1.75} aria-hidden="true" />
          </span>
          <span className="leading-none">
            <span className="ltr-isolate block font-heading text-[13.5px] font-semibold" dir="ltr">
              Oxford 3000
            </span>
            <span className="mt-1.5 block text-[9px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              مساحة العمل
            </span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="التنقل الرئيسي">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = isPathActive(currentPath, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'group mb-0.5 flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[12.5px] font-medium transition-colors',
                  isActive
                    ? 'bg-primary/[0.08] text-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                <Icon
                  className={cn('h-4 w-4', isActive ? 'text-primary' : 'text-muted-foreground')}
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="truncate">{item.label}</span>
                {isActive && <span className="ms-auto h-1.5 w-1.5 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <div className="flex items-baseline justify-between text-[10px] font-medium text-muted-foreground">
            <span>هدف اليوم</span>
            <span className="tabular-nums">
              {xpToday}/{dailyGoalXp}
            </span>
          </div>
          <div className="mt-1.5 h-[2px] bg-border">
            <div className="h-full bg-primary" style={{ width: `${goalPercent}%` }} />
          </div>

          <Link
            href="/analytics"
            className="mt-3 flex items-center justify-between rounded-sm border border-border px-2 py-1.5 text-[11px] font-medium transition-colors hover:border-primary/45"
          >
            <span className="flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-primary/70" aria-hidden="true" />
              {streak} يوم
            </span>
            <span className="tabular-nums text-muted-foreground">L{level.level}</span>
          </Link>

          <div className="mt-2 flex items-center justify-between">
            <ThemeQuickSwitcher />
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-label="تبديل الوضع الفاتح / الداكن"
              className="grid h-8 w-8 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
            >
              {isDarkMode ? <Sun className="h-4 w-4" aria-hidden="true" /> : <Moon className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </aside>

      {/* ---------------- Canvas ---------------- */}
      <div className="lg:ps-60">
        <header className="no-print sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="فتح القائمة"
              className="grid h-8 w-8 place-items-center rounded-sm border border-border lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>

            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold leading-none">{active.label}</p>
              <p className="mt-1 hidden text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground sm:block">
                {theme.name} · {active.labelEn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              className="archetype-btn ms-auto hidden h-8 items-center gap-2 rounded-sm border border-border px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground sm:flex"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
              بحث…
              <span className="kbd">⌘K</span>
            </button>

            <LayoutSwitcher className="hidden sm:inline-flex" />

            <Link
              href="/analytics"
              className="hidden h-8 items-center gap-1.5 rounded-sm border border-border px-2 text-[11px] font-semibold tabular-nums transition-colors hover:border-primary/45 md:flex"
            >
              <span className="text-muted-foreground">L{level.level}</span>
              <span className="h-3 w-px bg-border" aria-hidden="true" />
              {totalXp}
              <span className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">XP</span>
            </Link>
          </div>
        </header>

        <main
          id="main-content"
          className="anim-rise mx-auto w-full max-w-[1400px] px-4 py-7 sm:px-6 sm:py-9 xl:px-10"
        >
          <div className="space-y-8">{children}</div>
        </main>
      </div>

      <CommandPalette open={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
      <MobileNav
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        currentPath={currentPath}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
      />
      <ThemeStudioModal isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} />
      <GrokKeySettingsModal isOpen={isGrokOpen} onClose={() => setIsGrokOpen(false)} />
    </div>
  );
}
