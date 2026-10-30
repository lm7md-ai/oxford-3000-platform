'use client';

import * as React from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Command,
  Palette,
  Check,
  Sparkles,
  Accessibility,
} from 'lucide-react';
import { NAV_GROUPS, NAV_ITEMS, isPathActive } from '@/lib/navigation';
import { ARCHETYPES } from '@/styles/archetypes';
import { THEMES, getThemeById } from '@/styles/themes';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { LayoutSwitcher } from '@/components/layouts/LayoutSwitcher';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  currentPath: string;
  onOpenPalette: () => void;
  onOpenStudio: () => void;
}

/**
 * Full-height mobile navigation drawer: grouped routes, theme language strip,
 * and accessibility toggles with spring physics.
 */
export function MobileNav({
  open,
  onClose,
  currentPath,
  onOpenPalette,
  onOpenStudio,
}: MobileNavProps) {
  const themeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const toggleSound = useStore((state) => state.toggleSound);
  const reduceMotion = useStore((state) => state.reduceMotion);
  const toggleReduceMotion = useStore((state) => state.toggleReduceMotion);

  const activeTheme = getThemeById(themeId);

  // Lock body scroll while the drawer is mounted
  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Close on Escape
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[85] lg:hidden no-print">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/55 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            role="dialog"
            aria-modal="true"
            aria-label="قائمة التنقل"
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col overflow-y-auto border-l border-border/70 bg-surface/95 p-4 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="font-heading text-sm font-black leading-none">Oxford 3000™</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">CEFR A1–B2 Master Platform</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="إغلاق القائمة"
                className="grid h-8 w-8 place-items-center rounded-lg border border-border/70 text-foreground hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPalette();
              }}
              className="mt-4 flex items-center gap-2 rounded-xl border border-border/70 bg-muted/40 px-3 py-2.5 text-[12px] font-bold text-muted-foreground"
            >
              <Command className="h-3.5 w-3.5" />
              بحث سريع في المعجم والصفحات
              <span className="kbd ml-auto">⌘K</span>
            </button>

            <nav className="mt-4 space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.id}>
                  <p className="mb-1.5 px-1 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                    {group.label}
                  </p>
                  <div className="space-y-1">
                    {NAV_ITEMS.filter((item) => item.group === group.id).map((item, index) => {
                      const Icon = item.icon;
                      const active = isPathActive(currentPath, item.href);
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 18 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 + index * 0.04, duration: 0.32 }}
                        >
                          <Link
                            href={item.href}
                            onClick={onClose}
                            className={cn(
                              'flex items-center gap-3 rounded-xl px-2.5 py-2 transition-colors',
                              active ? 'bg-primary/12 text-primary' : 'hover:bg-muted/60'
                            )}
                          >
                            <span
                              className={cn(
                                'grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br text-white shadow-sm',
                                item.accent
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1">
                              <span className="flex items-center gap-1.5 text-[12.5px] font-bold leading-tight">
                                {item.label}
                                {item.isNew && (
                                  <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[8px] font-black uppercase text-primary">
                                    New
                                  </span>
                                )}
                              </span>
                              <span className="block truncate text-[10px] text-muted-foreground">
                                {item.labelEn}
                              </span>
                            </span>
                            {active && <Check className="h-4 w-4 shrink-0" />}
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-5 rounded-xl border border-border/70 p-2.5">
              <p className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground">
                <span>لغة التصميم</span>
                <span className="text-primary">{activeTheme.name}</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5">
                {ARCHETYPES.map((meta) => {
                  const theme = THEMES.find((entry) => entry.archetype === meta.id);
                  if (!theme) return null;
                  const isActive = theme.archetype === activeTheme.archetype;
                  return (
                    <button
                      key={meta.id}
                      type="button"
                      onClick={() => setThemeId(theme.id)}
                      className={cn(
                        'rounded-lg border px-1.5 py-1.5 text-[9.5px] font-bold transition-all',
                        isActive
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border/60 text-muted-foreground hover:border-primary/40'
                      )}
                    >
                      <span className="mb-1 flex justify-center gap-0.5">
                        {meta.signature.slice(0, 3).map((color, i) => (
                          <span
                            key={i}
                            className="h-2 w-2 rounded-full ring-1 ring-black/10"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </span>
                      {meta.nameAr}
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="mb-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  واجهة الموقع
                </p>
                <LayoutSwitcher variant="list" />
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenStudio();
                }}
                className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[10.5px] font-black text-primary-foreground"
              >
                <Palette className="h-3 w-3" />
                فتح استوديو التحول الكامل
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex flex-col items-center gap-1 rounded-lg border border-border/70 py-2 text-[10px] font-bold text-muted-foreground hover:text-foreground"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? 'فاتح' : 'داكن'}
              </button>
              <button
                type="button"
                onClick={toggleSound}
                className="flex flex-col items-center gap-1 rounded-lg border border-border/70 py-2 text-[10px] font-bold text-muted-foreground hover:text-foreground"
              >
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                الصوت
              </button>
              <button
                type="button"
                onClick={toggleReduceMotion}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg border py-2 text-[10px] font-bold',
                  reduceMotion
                    ? 'border-primary/50 text-primary'
                    : 'border-border/70 text-muted-foreground hover:text-foreground'
                )}
              >
                <Accessibility className="h-4 w-4" />
                تقليل الحركة
              </button>
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
