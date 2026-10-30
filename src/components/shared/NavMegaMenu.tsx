'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles, LayoutGrid, Palette, ArrowLeft } from 'lucide-react';
import { NAV_GROUPS, NAV_ITEMS, isPathActive } from '@/lib/navigation';
import { useStore } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { getArchetypeMeta } from '@/styles/archetypes';
import { cn } from '@/lib/utils';
import { menuPanel } from '@/lib/motion';
import { OPEN_THEME_STUDIO_EVENT } from './CommandPalette';

interface NavMegaMenuProps {
  currentPath: string;
  onNavigate?: () => void;
}

/**
 * Grouped "explore" mega menu. Surfaces every workspace with a description,
 * its accent, and live indicators for the active route.
 */
export function NavMegaMenu({ currentPath, onNavigate }: NavMegaMenuProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const closeTimer = React.useRef<number | null>(null);
  const themeId = useStore((state) => state.themeId);
  const theme = getThemeById(themeId);
  const meta = getArchetypeMeta(theme.archetype);

  const cancelClose = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKey);
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
    };
  }, [open]);

  const openStudio = () => {
    setOpen(false);
    onNavigate?.();
    window.dispatchEvent(new CustomEvent(OPEN_THEME_STUDIO_EVENT));
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((value) => !value)}
        className={cn('nav-link', open && 'bg-muted/60 text-foreground')}
      >
        <LayoutGrid className="h-3.5 w-3.5" />
        <span>استكشف</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.22 }}>
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="استكشاف مساحات المنصة"
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mega-panel"
          >
            {/* Gradient top rule */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary opacity-80" />

            <div className="grid gap-1.5 sm:grid-cols-3">
              {NAV_GROUPS.map((group) => {
                const groupItems = NAV_ITEMS.filter((item) => item.group === group.id);
                return (
                  <div key={group.id} className="space-y-1">
                    <div className="px-2 pb-1 pt-1.5">
                      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                        {group.label}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70">{group.hint}</p>
                    </div>

                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const active = isPathActive(currentPath, item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          role="menuitem"
                          onClick={() => {
                            setOpen(false);
                            onNavigate?.();
                          }}
                          data-active={active}
                          className="mega-item group/item"
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover/item:scale-110',
                              item.accent
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0">
                            <span className="flex items-center gap-1.5 text-[12.5px] font-bold leading-tight">
                              {item.label}
                              {item.isNew && (
                                <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wide text-primary">
                                  New
                                </span>
                              )}
                            </span>
                            <span className="mt-0.5 line-clamp-2 block text-[10.5px] leading-snug text-muted-foreground">
                              {item.description}
                            </span>
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Footer: current design language */}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2">
              <div className="flex items-center gap-2">
                <Palette className="h-3.5 w-3.5 text-primary" />
                <span className="text-[11px] font-bold">
                  التصميم الحالي: <span className="text-primary">{meta.nameAr}</span>
                </span>
                <span className="hidden text-[10px] text-muted-foreground sm:inline">
                  {theme.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={openStudio}
                  className="archetype-btn rounded-lg px-2.5 py-1 text-[10.5px] font-black text-foreground hover:bg-surface"
                >
                  تغيير التصميم
                </button>
                <Link
                  href="/design"
                  onClick={() => {
                    setOpen(false);
                    onNavigate?.();
                  }}
                  className="archetype-btn inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[10.5px] font-black text-primary-foreground"
                >
                  <Sparkles className="h-3 w-3" />
                  معرض التصاميم
                  <ArrowLeft className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
