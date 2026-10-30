'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Palette, Check, ArrowLeft, Shuffle, Moon, Sun } from 'lucide-react';
import { ARCHETYPES } from '@/styles/archetypes';
import { THEMES, getThemeById, pickRandomTheme } from '@/styles/themes';
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { menuPanel } from '@/lib/motion';
import { OPEN_THEME_STUDIO_EVENT } from './CommandPalette';

/**
 * Compact theme popover in the header: one representative theme per design
 * language plus the full studio entry point.
 */
export function ThemeQuickSwitcher() {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const themeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  const activeTheme = getThemeById(themeId);

  const quickThemes = React.useMemo(
    () =>
      ARCHETYPES.map((meta) => {
        const favourite =
          THEMES.find((theme) => theme.archetype === meta.id && theme.id === themeId) ??
          THEMES.find((theme) => theme.archetype === meta.id);
        return { meta, theme: favourite! };
      }).filter((entry) => Boolean(entry.theme)),
    [themeId]
  );

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
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label="تبديل نموذج التصميم"
        title="تبديل نموذج التصميم"
        className="archetype-btn group flex h-8 items-center gap-1.5 rounded-lg border border-border bg-surface/70 px-2 text-[11px] font-bold text-foreground hover:border-primary/50"
      >
        <span
          className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10 transition-transform duration-300 group-hover:rotate-90"
          style={{
            background: `conic-gradient(from 0deg, ${activeTheme.light.primary}, ${
              activeTheme.light.accent
            }, ${activeTheme.dark.primary}, ${activeTheme.light.primary})`,
          }}
        />
        <span className="hidden max-w-[86px] truncate sm:inline">{activeTheme.name.split(' ')[0]}</span>
        <Palette className="h-3.5 w-3.5 text-primary" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={menuPanel}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-[calc(100%+0.55rem)] z-[75] w-[19rem] max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border/80 bg-surface/95 p-2.5 shadow-soft backdrop-blur-2xl"
          >
            <div className="mb-1.5 flex items-center justify-between px-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                لغات التصميم الست
              </span>
              <button
                type="button"
                onClick={toggleDarkMode}
                className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
                {isDarkMode ? 'فاتح' : 'داكن'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {quickThemes.map(({ meta, theme }) => {
                const isActive = theme.archetype === activeTheme.archetype;
                const colors = isDarkMode ? theme.dark : theme.light;
                return (
                  <button
                    key={meta.id}
                    type="button"
                    onClick={() => {
                      if (themeId !== theme.id) setThemeId(theme.id);
                    }}
                    className={cn(
                      'group relative overflow-hidden rounded-xl border p-2 text-right transition-all duration-200 hover:-translate-y-0.5',
                      isActive ? 'border-primary ring-1 ring-primary/40' : 'border-border/70 hover:border-primary/40'
                    )}
                    style={{ background: colors.background }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-[10.5px] font-black leading-tight"
                        style={{ color: colors.foreground }}
                      >
                        {meta.nameAr}
                      </span>
                      {isActive && <Check className="h-3 w-3" style={{ color: colors.primary }} />}
                    </div>
                    <div className="mt-1.5 flex items-center gap-1">
                      {meta.signature.slice(0, 4).map((color, index) => (
                        <span
                          key={`${meta.id}-${index}`}
                          className="h-2.5 w-2.5 rounded-full ring-1 ring-black/10"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {meta.isNew && (
                        <span
                          className="ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase"
                          style={{ background: colors.primary, color: colors.background }}
                        >
                          New
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setThemeId(pickRandomTheme(themeId).id)}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border/70 py-1.5 text-[10.5px] font-black text-muted-foreground hover:border-primary/40 hover:text-foreground"
              >
                <Shuffle className="h-3 w-3" />
                مفاجئ
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.dispatchEvent(new CustomEvent(OPEN_THEME_STUDIO_EVENT));
                }}
                className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary py-1.5 text-[10.5px] font-black text-primary-foreground"
              >
                كل النماذج
                <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
