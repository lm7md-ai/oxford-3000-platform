'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Search, Menu, ArrowUpRight } from 'lucide-react';
import { NAV_ITEMS, isPathActive } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { CommandPalette } from '@/components/shared/CommandPalette';
import { MobileNav } from '@/components/shared/MobileNav';
import { ScrollProgress } from '@/components/shared/ScrollProgress';
import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop';
import { LayoutSwitcher } from './LayoutSwitcher';
import { ThemeStudioModal } from '@/components/shared/ThemeStudioModal';
import { OPEN_THEME_STUDIO_EVENT } from '@/components/shared/CommandPalette';

/**
 * SHOWCASE INTERFACE — a presentation site.
 * No solid header: a floating pill navigation over a full-bleed canvas, a
 * mobile dock at the bottom, and content that opens wide instead of boxed in.
 */
export function ShowcaseShell({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  const [isPaletteOpen, setIsPaletteOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const [isStudioOpen, setIsStudioOpen] = React.useState(false);

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

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <AmbientBackdrop />
      <ScrollProgress />
      <a href="#main-content" className="skip-link no-print">
        تخطَّ إلى المحتوى الرئيسي
      </a>

      {/* Floating navigation */}
      <div className="no-print pointer-events-none fixed inset-x-0 top-0 z-40">
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="pointer-events-auto flex items-center gap-2 rounded-full border border-border/80 bg-surface/70 px-2.5 py-1.5 backdrop-blur-xl"
            aria-label="Oxford 3000 الرئيسية"
          >
            <BookOpen className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
            <span className="ltr-isolate font-heading text-[12px] font-semibold" dir="ltr">
              Oxford 3000
            </span>
          </Link>

          <nav
            aria-label="التنقل الرئيسي"
            className={cn(
              'pointer-events-auto mx-auto hidden items-center gap-0.5 rounded-full border px-1.5 py-1.5 backdrop-blur-xl transition-shadow lg:flex',
              scrolled
                ? 'border-border bg-surface/85 shadow-[var(--card-shadow)]'
                : 'border-transparent bg-surface/40'
            )}
          >
            {NAV_ITEMS.map((item) => {
              const active = isPathActive(currentPath, item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors',
                    active
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="pointer-events-auto ms-auto flex items-center gap-1.5 lg:ms-0">
            <button
              type="button"
              onClick={() => setIsPaletteOpen(true)}
              aria-label="بحث سريع"
              className="grid h-8 w-8 place-items-center rounded-full border border-border/80 bg-surface/70 text-muted-foreground backdrop-blur-xl transition-colors hover:text-foreground"
            >
              <Search className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <LayoutSwitcher className="hidden bg-surface/70 backdrop-blur-xl sm:inline-flex" />
            <button
              type="button"
              onClick={() => setIsMobileOpen(true)}
              aria-label="فتح القائمة"
              className="grid h-8 w-8 place-items-center rounded-full border border-border/80 bg-surface/70 lg:hidden"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <main
        id="main-content"
        className="anim-rise relative mx-auto w-full max-w-[1400px] px-4 pb-28 pt-20 sm:px-6 sm:pt-24 lg:pb-16"
      >
        <div className="space-y-14 sm:space-y-20">{children}</div>
      </main>

      {/* Mobile dock */}
      <nav
        aria-label="تنقل سريع"
        className="no-print fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-full border border-border bg-surface/90 px-2 py-1.5 backdrop-blur-xl lg:hidden"
      >
        {NAV_ITEMS.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = isPathActive(currentPath, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'grid h-9 w-9 place-items-center rounded-full transition-colors',
                active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </Link>
          );
        })}
        <Link
          href="/design"
          aria-label="التصميم"
          className={cn(
            'grid h-9 w-9 place-items-center rounded-full transition-colors',
            isPathActive(currentPath, '/design')
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground'
          )}
        >
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </nav>

      <CommandPalette open={isPaletteOpen} onOpenChange={setIsPaletteOpen} />
      <MobileNav
        open={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        currentPath={currentPath}
        onOpenPalette={() => setIsPaletteOpen(true)}
        onOpenStudio={() => setIsStudioOpen(true)}
      />
      <ThemeStudioModal isOpen={isStudioOpen} onClose={() => setIsStudioOpen(false)} />
    </div>
  );
}
