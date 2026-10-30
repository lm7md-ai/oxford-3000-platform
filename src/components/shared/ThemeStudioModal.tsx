'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Palette,
  Check,
  Moon,
  Sun,
  Sparkles,
  Box,
  Shuffle,
  Search,
  Layers,
  Wand2,
} from 'lucide-react';
import { THEMES, ThemeConfig, getThemeById, pickRandomTheme } from '@/styles/themes';
import { ARCHETYPES, DESIGN_GENERATIONS, getArchetypeMeta } from '@/styles/archetypes';
import { useStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';

interface ThemeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Design Studio — deep morphological theme switching.
 *
 * · Search + generation tabs (including the brand-new 4th design language)
 * · Live miniature UI previews rendered in each theme's real palette
 * · One-click apply, randomise, and dark/light audition
 */
export function ThemeStudioModal({ isOpen, onClose }: ThemeStudioModalProps) {
  const currentThemeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const toggleDarkMode = useStore((state) => state.toggleDarkMode);

  const [activeTab, setActiveTab] = React.useState<string>('all');
  const [query, setQuery] = React.useState('');

  const currentTheme = getThemeById(currentThemeId);

  const tabs = React.useMemo(
    () => [
      { id: 'all', label: 'الكل', count: THEMES.length },
      ...ARCHETYPES.map((meta) => ({
        id: meta.id,
        label: meta.nameAr,
        count: THEMES.filter((theme) => theme.archetype === meta.id).length,
        isNew: meta.isNew,
      })),
    ],
    []
  );

  const filteredThemes = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return THEMES.filter((theme) => {
      const matchesTab = activeTab === 'all' || theme.archetype === activeTab;
      if (!matchesTab) return false;
      if (!q) return true;
      return (
        theme.name.toLowerCase().includes(q) ||
        theme.visualMood.toLowerCase().includes(q) ||
        theme.archetype.includes(q) ||
        theme.category.includes(q)
      );
    });
  }, [activeTab, query]);

  // Group the visible themes by design generation for a curated browse
  const grouped = React.useMemo(() => {
    return DESIGN_GENERATIONS.map((generation) => ({
      ...generation,
      themes: filteredThemes.filter((theme) =>
        generation.archetypes.includes(theme.archetype)
      ),
      meta: ARCHETYPES.filter((meta) => generation.archetypes.includes(meta.id)),
    })).filter((generation) => generation.themes.length > 0);
  }, [filteredThemes]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-5xl overflow-y-auto p-5 sm:p-7">
        <DialogHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <DialogTitle className="flex items-center gap-2 font-heading text-lg font-black sm:text-xl">
                <Box className="h-5 w-5 text-primary" />
                استوديو التحول المعماري
                <Badge variant="accent" className="archetype-badge px-2 py-0 text-[10px]">
                  {THEMES.length} نموذج · 6 لغات تصميم
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground sm:text-[13px]">
                تحويل هندسي عميق: الحواف، الظلال، الملمس، الطباعة، وحركة الأزرار.
                <span className="mx-1.5 text-border">|</span>
                <span className="font-bold text-primary">الجيل الرابع: الزجاج السائل الشفقّي</span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setThemeId(pickRandomTheme(currentThemeId).id)}
                className="archetype-btn gap-1.5 text-[11px] font-bold"
                title="نموذج عشوائي"
              >
                <Shuffle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">مفاجئ</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="archetype-btn gap-1.5 text-[11px] font-bold"
              >
                {isDarkMode ? (
                  <Sun className="h-3.5 w-3.5 text-amber-500" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
                <span>{isDarkMode ? 'فاتح' : 'داكن'}</span>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="ابحث عن نموذج بالاسم أو المزاج البصري…"
            className="h-10 w-full rounded-xl border border-border bg-background/60 pl-9 pr-3 text-sm font-medium text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            aria-label="بحث في النماذج"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground hover:text-foreground"
            >
              مسح
            </button>
          )}
        </div>

        {/* Archetype / generation tabs */}
        <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto border-b border-border/70 pb-2">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'relative whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[11px] font-bold transition-colors',
                  active
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="studio-tab"
                    className="absolute inset-0 rounded-lg bg-primary shadow-sm"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative flex items-center gap-1.5">
                  {tab.label}
                  <span
                    className={cn(
                      'rounded-full px-1 text-[9px] font-black',
                      active ? 'bg-primary-foreground/20' : 'bg-muted'
                    )}
                  >
                    {tab.count}
                  </span>
                  {'isNew' in tab && tab.isNew && (
                    <span
                      className={cn(
                        'rounded-full px-1.5 text-[8px] font-black uppercase',
                        active ? 'bg-primary-foreground/25' : 'bg-primary/15 text-primary'
                      )}
                    >
                      New
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Design generation sections */}
        <motion.div
          variants={staggerContainer(0.03)}
          initial="hidden"
          animate="visible"
          className="mt-4 space-y-6"
        >
          {grouped.map((generation) => (
            <section key={generation.generation}>
              <div className="mb-2.5 flex flex-wrap items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 font-mono text-[10px] font-black text-primary">
                  G{generation.generation}
                </span>
                <h3 className="font-heading text-sm font-black">{generation.labelAr}</h3>
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  {generation.label}
                </span>
                {generation.meta.some((meta) => meta.isNew) && (
                  <Badge variant="accent" className="archetype-badge gap-1 px-2 py-0 text-[9px]">
                    <Sparkles className="h-2.5 w-2.5" /> تصميم عصري جديد
                  </Badge>
                )}
                <span className="section-rule" />
                <span className="text-[10px] font-bold text-muted-foreground">
                  {generation.themes.length} نموذج
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence initial={false}>
                  {generation.themes.map((theme) => (
                    <motion.div key={theme.id} variants={staggerItem} initial="hidden" animate="visible">
                      <ThemeCard
                        theme={theme}
                        isSelected={currentThemeId === theme.id}
                        isDarkMode={isDarkMode}
                        onSelect={() => setThemeId(theme.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>
          ))}

          {grouped.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-10 text-center">
              <Wand2 className="mx-auto mb-2 h-7 w-7 text-muted-foreground" />
              <p className="text-sm font-bold">لا توجد نماذج مطابقة</p>
              <p className="mt-1 text-xs text-muted-foreground">
                جرّب كلمة أخرى أو أعد ضبط عامل التصفية.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="archetype-btn mt-3 text-xs"
                onClick={() => {
                  setQuery('');
                  setActiveTab('all');
                }}
              >
                إعادة الضبط
              </Button>
            </div>
          )}
        </motion.div>

        {/* Footer summary */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-muted/30 px-3 py-2 text-[11px]">
          <span className="flex items-center gap-1.5 font-bold">
            <Layers className="h-3.5 w-3.5 text-primary" />
            التصميم النشط:
            <span className="text-primary">{getArchetypeMeta(currentTheme.archetype).nameAr}</span>
            <span className="text-muted-foreground">— {currentTheme.name}</span>
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <span className="kbd">T</span> لفتح الاستوديو
            <span className="kbd">⌘K</span> للأوامر
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Theme preview card                                                  */
/* ------------------------------------------------------------------ */
export function ThemeCard({
  theme,
  isSelected,
  isDarkMode,
  onSelect,
}: {
  theme: ThemeConfig;
  isSelected: boolean;
  isDarkMode: boolean;
  onSelect: () => void;
}) {
  const colors = isDarkMode ? theme.dark : theme.light;
  const meta = getArchetypeMeta(theme.archetype);

  const shadow =
    theme.archetype === 'neo-brutalism'
      ? `4px 4px 0 0 ${isDarkMode ? '#fff' : '#000'}`
      : theme.archetype === 'liquid-aurora'
      ? `0 18px 40px -22px ${colors.primary}aa`
      : theme.archetype === 'organic-terracotta'
      ? `0 12px 26px -14px ${colors.primary}88`
      : 'none';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'group relative w-full overflow-hidden p-3 text-left transition-all duration-300',
        isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-surface' : 'hover:-translate-y-1'
      )}
      style={{
        backgroundColor: colors.surface,
        border: `${theme.archetype === 'neo-brutalism' ? '2px' : '1px'} solid ${
          isSelected ? colors.primary : colors.border
        }`,
        borderRadius: theme.radius,
        boxShadow: shadow,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h4
            className="truncate text-[12.5px] font-bold leading-tight"
            style={{ color: colors.foreground }}
          >
            {theme.name}
          </h4>
          <span
            className="mt-0.5 block text-[9px] font-mono font-bold uppercase tracking-wider"
            style={{ color: colors.primary }}
          >
            {meta.nameAr} · {meta.name}
          </span>
        </div>
        {isSelected ? (
          <span
            className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <Check className="h-3 w-3" />
          </span>
        ) : (
          <span
            className="shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-black uppercase opacity-0 transition-opacity group-hover:opacity-100"
            style={{ backgroundColor: colors.primary, color: colors.surface }}
          >
            تطبيق
          </span>
        )}
      </div>

      {/* Miniature UI preview */}
      <div
        className="mt-2 overflow-hidden p-1.5"
        style={{
          backgroundColor: colors.background,
          borderRadius: `calc(${theme.radius} * 0.7)`,
          border: `1px solid ${colors.border}`,
        }}
      >
        <div
          className="p-1.5"
          style={{
            backgroundColor: colors.surface,
            borderRadius: `calc(${theme.radius} * 0.5)`,
            border: `${theme.archetype === 'neo-brutalism' ? '1.5px' : '1px'} solid ${colors.border}`,
          }}
        >
          <div className="flex items-center gap-1">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: colors.primary }}
            />
            <span
              className="h-1 flex-1 rounded-full"
              style={{ backgroundColor: colors.muted }}
            />
            <span className="h-1 w-3 rounded-full" style={{ backgroundColor: colors.accent }} />
          </div>
          <div
            className="mt-1.5 h-2 w-3/4 rounded-sm"
            style={{ backgroundColor: colors.foreground, opacity: 0.85 }}
          />
          <div
            className="mt-1 h-1 w-2/3 rounded-sm"
            style={{ backgroundColor: colors.mutedForeground, opacity: 0.55 }}
          />
          <div className="mt-1.5 flex gap-1">
            <span
              className="h-3 w-9"
              style={{
                backgroundColor: colors.primary,
                borderRadius: theme.archetype === 'swiss' ? 0 : '9999px',
              }}
            />
            <span
              className="h-3 w-6"
              style={{
                backgroundColor: colors.muted,
                borderRadius: theme.archetype === 'swiss' ? 0 : '9999px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Mood */}
      <p
        className="mt-2 line-clamp-2 text-[10px] leading-snug"
        style={{ color: colors.mutedForeground }}
      >
        {theme.visualMood}
      </p>

      {/* Swatches & spec */}
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {[colors.background, colors.surface, colors.primary, colors.accent, colors.foreground].map(
            (color, index) => (
              <span
                key={index}
                className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: color }}
                title={color}
              />
            )
          )}
        </div>
        <span
          className="font-mono text-[9px] font-bold"
          style={{ color: colors.mutedForeground }}
        >
          {theme.radius}
        </span>
      </div>
    </button>
  );
}
