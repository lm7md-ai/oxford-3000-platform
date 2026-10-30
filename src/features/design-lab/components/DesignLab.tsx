'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Check,
  ArrowLeft,
  Palette,
  Zap,
  Type,
  Layers,
  Wand2,
  MousePointerClick,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { ARCHETYPES, DESIGN_GENERATIONS, FLAGSHIP_ARCHETYPE, getArchetypeMeta } from '@/styles/archetypes';
import { THEMES, getThemeById, getThemesByArchetype } from '@/styles/themes';
import { useStore } from '@/lib/store';
import { ThemeCard } from '@/components/shared/ThemeStudioModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO, staggerContainer, staggerItem } from '@/lib/motion';

/* ------------------------------------------------------------------ */
/* Hero showcase of the brand-new 4th design language                  */
/* ------------------------------------------------------------------ */
function FlagshipShowcase() {
  const themeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setDarkMode = useStore((state) => state.setDarkMode);
  const meta = getArchetypeMeta(FLAGSHIP_ARCHETYPE);
  const auroraThemes = getThemesByArchetype(FLAGSHIP_ARCHETYPE);
  const [previewIndex, setPreviewIndex] = React.useState(0);
  const reduceMotion = useReducedMotion();

  const previewTheme = auroraThemes[previewIndex % auroraThemes.length] ?? auroraThemes[0];
  const active = getThemeById(themeId).archetype === FLAGSHIP_ARCHETYPE;

  const apply = () => {
    setThemeId(previewTheme.id);
    setDarkMode(true);
  };

  return (
    <section className="relative overflow-hidden rounded-[calc(var(--radius)*1.6)] border border-primary/25 p-5 sm:p-8">
      {/* Living aurora field */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-field opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/40 to-background/80" />
      </div>

      <div className="grid items-center gap-6 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="archetype-badge gap-1.5 px-2.5 py-1 text-[10px]">
              <Sparkles className="h-3 w-3" />
              الجيل الرابع · جديد
            </Badge>
            <span className="eyebrow">Aurora Liquid Glass</span>
            {active && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-black text-emerald-600 dark:text-emerald-400">
                <Check className="h-3 w-3" /> مُفعّل الآن
              </span>
            )}
          </div>

          <h2 className="text-2xl font-black leading-tight sm:text-3xl">
            <span className="text-aurora">{meta.nameAr}</span>
            <span className="mt-1 block text-base font-bold text-muted-foreground sm:text-lg">
              {meta.tagline}
            </span>
          </h2>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            {meta.description}
          </p>

          <div className="flex flex-wrap gap-1.5">
            {meta.traits.map((trait) => (
              <span key={trait} className="chip">
                {trait}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button onClick={apply} className="archetype-btn gap-2">
              <Wand2 className="h-4 w-4" />
              فعّل الزجاج الشفقّي
            </Button>
            <Button
              variant="outline"
              onClick={() => setDarkMode(!isDarkMode)}
              className="archetype-btn gap-2"
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              معاينة {isDarkMode ? 'فاتحة' : 'داكنة'}
            </Button>
          </div>

          {/* Aurora theme chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {auroraThemes.map((theme, index) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => setPreviewIndex(index)}
                className={cn(
                  'rounded-full border px-2.5 py-1 text-[10.5px] font-bold transition-all',
                  previewIndex === index
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border/70 text-muted-foreground hover:border-primary/40'
                )}
              >
                {theme.name}
              </button>
            ))}
          </div>
        </div>

        {/* Live preview card */}
        <motion.div
          key={previewTheme.id}
          initial={reduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.98 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
          className="relative"
        >
          <div
            className="relative overflow-hidden p-5"
            style={{
              borderRadius: previewTheme.radius,
              background: `linear-gradient(150deg, ${previewTheme.dark.surface}, ${previewTheme.dark.background})`,
              border: `1px solid ${previewTheme.dark.primary}44`,
              boxShadow: `0 40px 90px -40px ${previewTheme.dark.primary}aa, inset 0 1px 0 rgba(255,255,255,0.25)`,
            }}
          >
            <div
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full blur-3xl"
              style={{ background: previewTheme.dark.accent, opacity: 0.35 }}
            />
            <div className="relative space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {[previewTheme.dark.primary, previewTheme.dark.accent, '#FFFFFF55'].map(
                    (color, index) => (
                      <span
                        key={index}
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    )
                  )}
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider"
                  style={{
                    background: `${previewTheme.dark.accent}22`,
                    color: previewTheme.dark.accent,
                  }}
                >
                  Live preview
                </span>
              </div>

              <div>
                <p
                  className="font-heading text-xl font-black leading-tight"
                  style={{ color: previewTheme.dark.foreground }}
                >
                  Glass, light &
                  <br />
                  <span style={{ color: previewTheme.dark.primary }}>living vocabulary.</span>
                </p>
                <p className="mt-1 text-[11px]" style={{ color: previewTheme.dark.mutedForeground }}>
                  {previewTheme.visualMood}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[0, 1].map((index) => (
                  <div
                    key={index}
                    className="rounded-xl p-2.5"
                    style={{
                      background: `${previewTheme.dark.surface}`,
                      border: `1px solid ${previewTheme.dark.primary}33`,
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
                    }}
                  >
                    <div
                      className="h-1.5 w-2/3 rounded-full"
                      style={{ background: previewTheme.dark.foreground, opacity: 0.85 }}
                    />
                    <div
                      className="mt-1.5 h-1 w-full rounded-full"
                      style={{ background: previewTheme.dark.mutedForeground, opacity: 0.5 }}
                    />
                    <div
                      className="mt-1.5 h-4 w-14 rounded-full"
                      style={{ background: index ? previewTheme.dark.accent : previewTheme.dark.primary }}
                    />
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={apply}
                className="flex w-full items-center justify-center gap-1.5 rounded-full py-2 text-[11px] font-black transition-transform hover:-translate-y-0.5"
                style={{
                  background: previewTheme.dark.primary,
                  color: previewTheme.dark.background,
                }}
              >
                تطبيق {previewTheme.name}
                <ArrowLeft className="h-3 w-3" />
              </button>
            </div>
          </div>

          {/* Floating spec badges */}
          <div className="anim-float absolute -bottom-3 -left-2 hidden rounded-xl border border-border/70 bg-surface/90 px-2.5 py-1.5 text-[10px] font-black shadow-soft backdrop-blur-xl sm:block">
            radius {previewTheme.radius}
          </div>
          <div
            className="anim-float absolute -top-3 left-6 hidden rounded-xl border border-border/70 bg-surface/90 px-2.5 py-1.5 text-[10px] font-black shadow-soft backdrop-blur-xl sm:block"
            style={{ animationDelay: '1.2s' }}
          >
            backdrop blur 26px
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Design language cards                                               */
/* ------------------------------------------------------------------ */
function DesignLanguages() {
  const themeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const currentMeta = getArchetypeMeta(getThemeById(themeId).archetype);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const isDarkMode = useStore((state) => state.isDarkMode);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Palette className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-lg font-black">لغات التصميم الست</h2>
        <span className="section-rule" />
        <span className="text-[11px] font-bold text-muted-foreground">
          {THEMES.length} نموذجًا موزعة على 4 أجيال
        </span>
      </div>

      <motion.div
        variants={staggerContainer(0.05)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {ARCHETYPES.map((meta) => {
          const themes = getThemesByArchetype(meta.id);
          const representative = themes[0];
          const isActive = currentMeta.id === meta.id;
          const open = expanded === meta.id;

          return (
            <motion.div key={meta.id} variants={staggerItem} className="h-full">
              <div
                className={cn(
                  'archetype-card group flex h-full flex-col overflow-hidden',
                  isActive && 'ring-2 ring-primary/40'
                )}
              >
                {/* Gradient banner */}
                <div className="relative h-24 overflow-hidden">
                  <div className="absolute inset-0" style={{ background: meta.gradient }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/20 to-transparent" />
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    <span className="rounded-full bg-black/45 px-2 py-0.5 font-mono text-[9px] font-black text-white backdrop-blur">
                      G{meta.generation}
                    </span>
                    {meta.isNew && (
                      <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-black uppercase text-black">
                        New
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-2 left-3 flex items-end gap-2">
                    <div className="flex gap-1">
                      {meta.signature.map((color, index) => (
                        <span
                          key={index}
                          className="h-4 w-4 rounded-full ring-1 ring-black/20"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2 p-4 pt-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-heading text-sm font-black leading-tight">{meta.nameAr}</h3>
                      <p className="font-mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
                        {meta.name}
                      </p>
                    </div>
                    {isActive && (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                    {meta.tagline}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {meta.traits.slice(0, 3).map((trait) => (
                      <span
                        key={trait}
                        className="rounded-full bg-muted/70 px-1.5 py-0.5 text-[9.5px] font-bold text-muted-foreground"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setThemeId(representative?.id ?? 'neo-brutalism')}
                      className="archetype-btn rounded-lg bg-primary px-2.5 py-1.5 text-[10.5px] font-black text-primary-foreground"
                    >
                      تطبيق النموذج
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpanded(open ? null : meta.id)}
                      aria-expanded={open}
                      className="flex items-center gap-1 text-[10.5px] font-bold text-muted-foreground hover:text-foreground"
                    >
                      {themes.length} نماذج
                      <ChevronDown
                        className={cn('h-3 w-3 transition-transform', open && 'rotate-180')}
                      />
                    </button>
                  </div>

                  {open && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1 overflow-hidden border-t border-border/60 pt-2"
                    >
                      {themes.map((theme) => {
                        const selected = theme.id === themeId;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => setThemeId(theme.id)}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-[10.5px] font-bold transition-colors',
                              selected ? 'bg-primary/12 text-primary' : 'hover:bg-muted/60'
                            )}
                          >
                            <span className="truncate">{theme.name}</span>
                            <span className="flex shrink-0 gap-0.5">
                              {(isDarkMode ? theme.dark : theme.light) &&
                                [theme.light.primary, theme.light.accent, theme.dark.primary].map(
                                  (color, index) => (
                                    <span
                                      key={index}
                                      className="h-2 w-2 rounded-full ring-1 ring-black/10"
                                      style={{ backgroundColor: color }}
                                    />
                                  )
                                )}
                            </span>
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Motion lab — proves the animation system works in every archetype   */
/* ------------------------------------------------------------------ */
function MotionLab() {
  const demos = [
    {
      title: 'رفع عند التمرير',
      hint: 'hover-lift',
      className: 'hover-lift',
      icon: <MousePointerClick className="h-5 w-5 text-primary" />,
    },
    {
      title: 'لمعة زجاجية',
      hint: 'sheen',
      className: 'sheen',
      icon: <Sparkles className="h-5 w-5 text-accent" />,
    },
    {
      title: 'طفو مستمر',
      hint: 'anim-float',
      className: 'anim-float',
      icon: <Zap className="h-5 w-5 text-amber-500" />,
    },
    {
      title: 'نبضة هالة',
      hint: 'anim-pulse-ring',
      className: 'anim-pulse-ring',
      icon: <Layers className="h-5 w-5 text-emerald-500" />,
    },
  ];

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-lg font-black">معمل الحركة والتفاعل</h2>
        <span className="section-rule" />
        <span className="text-[11px] font-bold text-muted-foreground">
          يلتزم تلقائيًا بإعداد «تقليل الحركة»
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {demos.map((demo) => (
          <div
            key={demo.title}
            className={cn(
              'archetype-card flex flex-col items-center gap-2 p-5 text-center',
              demo.className
            )}
          >
            {demo.icon}
            <p className="text-[11.5px] font-black">{demo.title}</p>
            <code className="rounded bg-muted/70 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
              .{demo.hint}
            </code>
          </div>
        ))}
      </div>

      {/* Component primitives */}
      <div className="archetype-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <p className="eyebrow flex items-center gap-1.5">
            <Type className="h-3 w-3" /> عناصر واجهة
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="archetype-btn text-xs">
              زر أساسي
            </Button>
            <Button size="sm" variant="outline" className="archetype-btn text-xs">
              زر ثانوي
            </Button>
            <Button size="sm" variant="accent" className="archetype-btn text-xs">
              زر التمييز
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="a1" className="archetype-badge">A1</Badge>
            <Badge variant="a2" className="archetype-badge">A2</Badge>
            <Badge variant="b1" className="archetype-badge">B1</Badge>
            <Badge variant="b2" className="archetype-badge">B2</Badge>
            <span className="chip">chip</span>
            <span className="kbd">⌘K</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="eyebrow">مؤشرات ومقاييس</p>
          <div className="space-y-1.5">
            {[
              { label: 'A1', value: 78, color: 'bg-emerald-500' },
              { label: 'A2', value: 54, color: 'bg-sky-500' },
              { label: 'B1', value: 32, color: 'bg-amber-500' },
              { label: 'B2', value: 16, color: 'bg-violet-500' },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-2">
                <span className="w-5 font-mono text-[10px] font-black text-muted-foreground">
                  {row.label}
                </span>
                <div className="progress-track !h-2">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', row.color)}
                    style={{ width: `${row.value}%` }}
                  />
                </div>
                <span className="w-7 text-right font-mono text-[10px] font-bold text-muted-foreground">
                  {row.value}%
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="skeleton h-8 flex-1" />
            <div className="skeleton h-8 w-16" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Full theme catalogue                                                */
/* ------------------------------------------------------------------ */
function ThemeCatalogue() {
  const themeId = useStore((state) => state.themeId);
  const setThemeId = useStore((state) => state.setThemeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [filter, setFilter] = React.useState<string>('all');

  const visible = filter === 'all' ? THEMES : THEMES.filter((theme) => theme.archetype === filter);

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Layers className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-lg font-black">كتالوج النماذج الكامل</h2>
        <span className="section-rule" />
        <span className="text-[11px] font-bold text-muted-foreground">{visible.length} نموذج</span>
      </div>

      <div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={cn(
            'shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold transition-colors',
            filter === 'all'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border/70 text-muted-foreground hover:border-primary/40'
          )}
        >
          الكل ({THEMES.length})
        </button>
        {ARCHETYPES.map((meta) => (
          <button
            key={meta.id}
            type="button"
            onClick={() => setFilter(meta.id)}
            className={cn(
              'shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] font-bold transition-colors',
              filter === meta.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/70 text-muted-foreground hover:border-primary/40'
            )}
          >
            {meta.nameAr} ({getThemesByArchetype(meta.id).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            isSelected={themeId === theme.id}
            isDarkMode={isDarkMode}
            onSelect={() => setThemeId(theme.id)}
          />
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Token inspector                                                     */
/* ------------------------------------------------------------------ */
function TokenInspector() {
  const themeId = useStore((state) => state.themeId);
  const isDarkMode = useStore((state) => state.isDarkMode);
  const theme = getThemeById(themeId);
  const colors = isDarkMode ? theme.dark : theme.light;
  const meta = getArchetypeMeta(theme.archetype);
  const [copied, setCopied] = React.useState<string | null>(null);

  const tokens: { name: string; value: string }[] = [
    { name: 'background', value: colors.background },
    { name: 'surface', value: colors.surface },
    { name: 'foreground', value: colors.foreground },
    { name: 'primary', value: colors.primary },
    { name: 'accent', value: colors.accent },
    { name: 'muted', value: colors.muted },
    { name: 'muted-foreground', value: colors.mutedForeground },
    { name: 'border', value: colors.border },
    { name: 'ring', value: colors.ring },
  ];

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(value);
      window.setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <section className="archetype-card space-y-3 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Wand2 className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-base font-black">مُفتّش الرموز الحالي</h2>
        <span className="section-rule" />
        <span className="text-[10.5px] font-bold text-muted-foreground">
          {theme.name} · {meta.nameAr}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {tokens.map((token) => (
          <button
            key={token.name}
            type="button"
            onClick={() => copy(token.value)}
            className="group overflow-hidden rounded-lg border border-border/70 text-left transition-transform hover:-translate-y-0.5"
            title={`نسخ ${token.value}`}
          >
            <span className="block h-9 w-full" style={{ backgroundColor: token.value }} />
            <span className="block px-2 py-1">
              <span className="block truncate font-mono text-[9.5px] font-bold text-foreground">
                {token.name}
              </span>
              <span className="block truncate font-mono text-[9px] text-muted-foreground">
                {copied === token.value ? '✓ تم النسخ' : token.value}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-2 sm:grid-cols-3">
        <div className="rounded-lg border border-border/70 px-3 py-2">
          <p className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">
            نصف القطر
          </p>
          <p className="font-mono text-sm font-bold">{theme.radius}</p>
        </div>
        <div className="rounded-lg border border-border/70 px-3 py-2">
          <p className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">
            خط العناوين
          </p>
          <p className="truncate font-heading text-sm font-bold">{theme.headingFont}</p>
        </div>
        <div className="rounded-lg border border-border/70 px-3 py-2">
          <p className="text-[9.5px] font-black uppercase tracking-wider text-muted-foreground">
            خط النصوص
          </p>
          <p className="truncate font-body text-sm font-bold">{theme.bodyFont}</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Composed lab                                                        */
/* ------------------------------------------------------------------ */
export function DesignLab() {
  return (
    <div className="space-y-8">
      <FlagshipShowcase />
      <DesignLanguages />
      <MotionLab />
      <TokenInspector />
      <ThemeCatalogue />

      {/* Generations footnote */}
      <div className="flex flex-wrap items-center justify-center gap-2 pb-2 text-[10.5px] font-bold text-muted-foreground">
        {DESIGN_GENERATIONS.map((generation) => (
          <span key={generation.generation} className="chip">
            G{generation.generation} · {generation.labelAr}
          </span>
        ))}
      </div>
    </div>
  );
}
