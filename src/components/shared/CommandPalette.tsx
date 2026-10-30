'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  CornerDownLeft,
  Moon,
  Sun,
  Palette,
  Shuffle,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { NAV_ITEMS } from '@/lib/navigation';
import { OXFORD_DATASET } from '@/data/oxfordDataset';
import { matchesSearchQuery } from '@/lib/arabic-search';
import { useStore } from '@/lib/store';
import { playButtonClickSound } from '@/services/soundEffects';
import { cn } from '@/lib/utils';
import { menuPanel } from '@/lib/motion';
import { pickRandomTheme } from '@/styles/themes';

export const PENDING_WORD_KEY = 'oxford:pending-word';
export const OPEN_WORD_EVENT = 'oxford:open-word';
export const OPEN_THEME_STUDIO_EVENT = 'oxford:open-theme-studio';

interface PaletteAction {
  id: string;
  group: 'pages' | 'words' | 'actions';
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const GROUP_LABELS: Record<PaletteAction['group'], string> = {
  pages: 'الصفحات والمساحات',
  words: 'كلمات من المعجم',
  actions: 'إجراءات سريعة',
};

/**
 * Global command palette (⌘K / Ctrl+K): jump between workspaces, search the
 * full Oxford 3000 lexicon bilingually, and run quick actions — all keyboard
 * driven.
 */
export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);
  const setThemeId = useStore((state) => state.setThemeId);
  const themeId = useStore((state) => state.themeId);
  const soundEnabled = useStore((state) => state.soundEnabled);
  const recordSearch = useStore((state) => state.recordSearch);
  const recordWordView = useStore((state) => state.recordWordView);
  const recentSearches = useStore((state) => state.recentSearches);

  const feedback = React.useCallback(() => {
    if (!soundEnabled) return;
    try {
      playButtonClickSound();
    } catch {
      /* audio not available */
    }
  }, [soundEnabled]);

  const openWord = React.useCallback(
    (id: number, word: string) => {
      try {
        sessionStorage.setItem(PENDING_WORD_KEY, String(id));
      } catch {
        /* storage unavailable */
      }
      recordWordView(id);
      recordSearch(word);
      window.dispatchEvent(new CustomEvent(OPEN_WORD_EVENT, { detail: id }));
      router.push('/');
      onOpenChange(false);
    },
    [onOpenChange, recordSearch, recordWordView, router]
  );

  const items = React.useMemo<PaletteAction[]>(() => {
    const q = query.trim().toLowerCase();

    const pages: PaletteAction[] = NAV_ITEMS.filter(
      (item) =>
        !q ||
        item.label.toLowerCase().includes(q) ||
        item.labelEn.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    ).map((item) => {
      const Icon = item.icon;
      return {
        id: `page-${item.href}`,
        group: 'pages',
        label: item.label,
        hint: item.labelEn,
        icon: <Icon className="h-4 w-4" />,
        run: () => {
          router.push(item.href);
          onOpenChange(false);
        },
      };
    });

    const words: PaletteAction[] = (
      q
        ? OXFORD_DATASET.filter((entry) => matchesSearchQuery(entry, query)).slice(0, 7)
        : OXFORD_DATASET.filter((entry) =>
            recentSearches.some((term) => matchesSearchQuery(entry, term))
          ).slice(0, 4)
    ).map((entry) => ({
      id: `word-${entry.id}`,
      group: 'words',
      label: entry.word,
      hint: `${entry.cefr} · ${entry.arabic.split(/[\/،,]/)[0]?.trim() ?? ''}`,
      icon: <Volume2 className="h-4 w-4" />,
      run: () => openWord(entry.id, entry.word),
    }));

    const actions: PaletteAction[] = [
      {
        id: 'action-theme',
        group: 'actions',
        label: 'تبديل الوضع الفاتح / الداكن',
        hint: isDarkMode ? 'الوضع الداكن مُفعّل' : 'الوضع الفاتح مُفعّل',
        icon: isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />,
        run: () => {
          toggleDarkMode();
          feedback();
        },
      },
      {
        id: 'action-random-theme',
        group: 'actions',
        label: 'تصميم مفاجئ (نموذج عشوائي)',
        hint: 'تجربة هوية بصرية جديدة',
        icon: <Shuffle className="h-4 w-4" />,
        run: () => {
          setThemeId(pickRandomTheme(themeId).id);
          feedback();
        },
      },
      {
        id: 'action-studio',
        group: 'actions',
        label: 'فتح استوديو التحول المعماري',
        hint: `${NAV_ITEMS.length} مساحات · 6 لغات تصميم`,
        icon: <Palette className="h-4 w-4" />,
        run: () => {
          window.dispatchEvent(new CustomEvent(OPEN_THEME_STUDIO_EVENT));
          onOpenChange(false);
        },
      },
      {
        id: 'action-design-lab',
        group: 'actions',
        label: 'معرض التصاميم (Design Lab)',
        hint: 'الجيل الرابع: الزجاج السائل الشفقّي',
        icon: <Sparkles className="h-4 w-4" />,
        run: () => {
          router.push('/design');
          onOpenChange(false);
        },
      },
    ].filter(
      (action) => !q || action.label.toLowerCase().includes(q) || action.group.includes(q)
    ) as PaletteAction[];

    return [...pages, ...words, ...actions];
  }, [
    feedback,
    isDarkMode,
    onOpenChange,
    openWord,
    query,
    recentSearches,
    router,
    setThemeId,
    themeId,
    toggleDarkMode,
  ]);

  // Reset the cursor whenever the result set changes
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query, open]);

  // Autofocus the input when the palette opens
  React.useEffect(() => {
    if (!open) {
      setQuery('');
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 40);
    return () => window.clearTimeout(timer);
  }, [open]);

  const grouped = React.useMemo(() => {
    const order: PaletteAction['group'][] = ['pages', 'words', 'actions'];
    return order
      .map((group) => ({ group, items: items.filter((i) => i.group === group) }))
      .filter((section) => section.items.length > 0);
  }, [items]);

  const flat = React.useMemo(() => grouped.flatMap((section) => section.items), [grouped]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % Math.max(1, flat.length));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + flat.length) % Math.max(1, flat.length));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      flat[activeIndex]?.run();
    }
  };

  // Keep the highlighted row in view
  React.useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  let runningIndex = -1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl gap-0 overflow-hidden p-0 sm:rounded-2xl"
        onKeyDown={onKeyDown}
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">لوحة الأوامر السريعة</DialogTitle>
        <DialogDescription className="sr-only">
          ابحث في الصفحات والمعجم ونفّذ إجراءات سريعة
        </DialogDescription>

        {/* Search field */}
        <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3.5">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن كلمة، صفحة، أو إجراء…"
            className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none"
            autoComplete="off"
            spellCheck={false}
          />
          <span className="kbd shrink-0">ESC</span>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[52vh] overflow-y-auto p-2">
          {flat.length === 0 && (
            <div className="px-4 py-10 text-center text-sm text-muted-foreground">
              لا توجد نتائج لـ «{query}» — جرّب البحث بالعربية أو الإنجليزية.
            </div>
          )}

          {grouped.map((section) => (
            <div key={section.group} className="mb-1.5">
              <div className="flex items-center justify-between px-3 py-1.5">
                <span className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                  {GROUP_LABELS[section.group]}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground/70">
                  {section.items.length}
                </span>
              </div>

              <AnimatePresence initial={false}>
                {section.items.map((item) => {
                  runningIndex += 1;
                  const index = runningIndex;
                  const isActive = index === activeIndex;
                  return (
                    <motion.button
                      key={item.id}
                      data-index={index}
                      variants={menuPanel}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => item.run()}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                        isActive ? 'bg-primary/12 text-foreground' : 'text-foreground/85 hover:bg-muted/60'
                      )}
                    >
                      <span
                        className={cn(
                          'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border/60',
                          isActive
                            ? 'border-primary/40 bg-primary/15 text-primary'
                            : 'bg-surface/70 text-muted-foreground'
                        )}
                      >
                        {item.icon}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-bold">{item.label}</span>
                        {item.hint && (
                          <span className="block truncate text-[11px] text-muted-foreground">
                            {item.hint}
                          </span>
                        )}
                      </span>
                      {isActive && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-primary" />}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Footer legend */}
        <div className="flex items-center justify-between gap-2 border-t border-border/70 bg-muted/30 px-4 py-2.5 text-[10px] font-semibold text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <ArrowUp className="h-3 w-3" />
              <ArrowDown className="h-3 w-3" />
              للتنقل
            </span>
            <span className="inline-flex items-center gap-1">
              <CornerDownLeft className="h-3 w-3" />
              للفتح
            </span>
          </div>
          <span className="font-mono">{items.length} نتيجة</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
