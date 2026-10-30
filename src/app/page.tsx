'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Sparkles,
  Trophy,
  Zap,
  BookOpen,
  ArrowLeft,
  Palette,
  Layers,
  Flame,
  Target,
  Volume2,
  Mic,
  Brain,
  Languages,
  CheckCircle,
  Star,
  Cpu,
} from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { AnimatedNumber } from '@/components/shared/AnimatedNumber';
import { Reveal, RevealGroup, RevealItem } from '@/components/shared/Reveal';
import { LexiconCatalog } from '@/features/lexicon/components/LexiconCatalog';
import { AudioPlayButton } from '@/features/audio-speech/components/AudioPlayButton';
import { Badge } from '@/components/ui/badge';
import { useStore, getLevelInfo } from '@/lib/store';
import { OXFORD_DATASET, CEFR_COUNTS } from '@/data/oxfordDataset';
import { NAV_ITEMS } from '@/lib/navigation';
import { getThemeById } from '@/styles/themes';
import { getArchetypeMeta } from '@/styles/archetypes';
import { OPEN_WORD_EVENT, PENDING_WORD_KEY } from '@/components/shared/CommandPalette';
import { cn } from '@/lib/utils';
import { EASE_OUT_EXPO } from '@/lib/motion';

/* ------------------------------------------------------------------ */
/* Word of the day (deterministic by calendar date)                    */
/* ------------------------------------------------------------------ */
function computeWordOfTheDay() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((Date.now() - start.getTime()) / 86_400_000);
  const index = (dayOfYear * 2654435761) % OXFORD_DATASET.length;
  return OXFORD_DATASET[Math.abs(index)] ?? OXFORD_DATASET[0];
}

/**
 * Resolved after mount so the statically exported markup (built on an earlier
 * date) never disagrees with the client's calendar day.
 */
function useWordOfTheDay() {
  const [word, setWord] = React.useState(() => OXFORD_DATASET[0]);
  React.useEffect(() => {
    setWord(computeWordOfTheDay());
  }, []);
  return word;
}

function openWord(id: number) {
  try {
    sessionStorage.setItem(PENDING_WORD_KEY, String(id));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(OPEN_WORD_EVENT, { detail: id }));
  document.getElementById('lexicon')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ------------------------------------------------------------------ */
/* Hero                                                               */
/* ------------------------------------------------------------------ */
function HomeHero() {
  const masteredCount = useStore((state) => state.masteredWordIds.length);
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const favorites = useStore((state) => state.favoriteWordIds.length);
  const themeId = useStore((state) => state.themeId);
  const toggleMastered = useStore((state) => state.toggleMastered);
  const masteredWordIds = useStore((state) => state.masteredWordIds);
  const recordWordView = useStore((state) => state.recordWordView);
  const reduceMotion = useReducedMotion();

  const theme = getThemeById(themeId);
  const meta = getArchetypeMeta(theme.archetype);
  const word = useWordOfTheDay();
  const isMastered = masteredWordIds.includes(word.id);
  const level = getLevelInfo(totalXp);

  const stats = [
    {
      label: 'Headwords',
      value: CEFR_COUNTS.TOTAL,
      suffix: '',
      icon: <BookOpen className="h-3.5 w-3.5 text-primary" />,
      hint: 'A1 → B2',
    },
    {
      label: 'Mastered',
      value: masteredCount,
      icon: <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />,
      hint: `${Math.round((masteredCount / CEFR_COUNTS.TOTAL) * 100)}%`,
    },
    {
      label: 'Favorites',
      value: favorites,
      icon: <Star className="h-3.5 w-3.5 text-amber-500" />,
      hint: 'محفوظة',
    },
    {
      label: 'XP',
      value: totalXp,
      icon: <Trophy className="h-3.5 w-3.5 text-amber-500" />,
      hint: `${level.nameAr}`,
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[calc(var(--radius)*1.5)] border border-border/70 bg-surface/55 p-5 backdrop-blur-xl sm:p-8">
      {/* Atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="aurora-field hero-aurora" />
        <div className="aurora-grid opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-surface/40 via-transparent to-surface/60" />
      </div>

      <div className="grid items-center gap-7 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: pitch */}
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="accent" className="archetype-badge gap-1.5 px-2.5 py-1 text-[10.5px]">
              <Sparkles className="h-3 w-3" />
              Oxford 3000™ Complete Lexicon
            </Badge>
            <span className="chip">
              <Palette className="h-3 w-3" />
              {meta.nameAr}
            </span>
            <span className="chip">
              <Cpu className="h-3 w-3" />
              Grok · TTS · Speech
            </span>
          </div>

          <h1 className="text-balance text-[2rem] font-black leading-[1.12] tracking-tight sm:text-[2.75rem]">
            أتقن مفردات أكسفورد
            <br />
            <span className="text-gradient">بالذكاء الاصطناعي والصوت</span>
          </h1>

          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            ثلاث آلاف كلمة مع ترجمة عربية سياقية، نسخ صوتي دولي (IPA)، محركي نطق مزدوجين، تقييم
            نطق فوري، وقصص تفاعلية مولّدة — في منصة واحدة بواجهة قابلة للتحوّل بالكامل.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('lexicon')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="archetype-btn group inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-black text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5"
            >
              ابدأ التعلّم الآن
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            </button>
            <Link
              href="/design"
              className="archetype-btn inline-flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-4 py-2.5 text-[13px] font-black text-foreground transition-transform hover:-translate-y-0.5"
            >
              <Palette className="h-4 w-4 text-primary" />
              معرض التصاميم
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-primary">
                G4
              </span>
            </Link>
            <Link
              href="/flashcards"
              className="archetype-btn inline-flex items-center gap-2 rounded-xl border border-border bg-surface/70 px-4 py-2.5 text-[13px] font-black text-foreground transition-transform hover:-translate-y-0.5"
            >
              <Layers className="h-4 w-4 text-primary" />
              بطاقات SRS
            </Link>
          </div>

          {/* Stats */}
          <RevealGroup className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-4" stagger={0.07}>
            {stats.map((stat) => (
              <RevealItem key={stat.label}>
                <div className="stat-tile !bg-surface/60">
                  <div className="flex items-center gap-1.5 text-[9.5px] font-black uppercase tracking-[0.12em] text-muted-foreground">
                    {stat.icon}
                    {stat.label}
                  </div>
                  <div className="mt-1.5 flex items-baseline gap-1">
                    <AnimatedNumber
                      value={stat.value}
                      className="font-heading text-xl font-black leading-none"
                    />
                    <span className="truncate text-[9.5px] font-bold text-muted-foreground">
                      {stat.hint}
                    </span>
                  </div>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>

        {/* Right: word of the day + streak */}
        <div className="space-y-3">
          <motion.div
            initial={reduceMotion ? undefined : { opacity: 0, y: 18, rotate: -1 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.15 }}
            className="archetype-card relative overflow-hidden p-4 sm:p-5"
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-accent to-primary" />
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-primary">
                <Sparkles className="h-3 w-3" />
                كلمة اليوم
              </span>
              <Badge
                variant={
                  word.cefr === 'A1' ? 'a1' : word.cefr === 'A2' ? 'a2' : word.cefr === 'B1' ? 'b1' : 'b2'
                }
                className="archetype-badge text-[10px]"
              >
                {word.cefr}
              </Badge>
            </div>

            <div className="mt-3">
              <h3 className="ltr-isolate text-2xl font-black leading-none">{word.word}</h3>
              <p className="ltr-isolate mt-1 font-mono text-[11px] text-muted-foreground">
                {word.ipa} · {word.pos}
              </p>
            </div>

            <p className="rtl-text mt-2 text-sm font-bold text-foreground">
              {word.arabic.split(/[/،]/)[0]}
            </p>
            <p className="ltr-isolate mt-1.5 line-clamp-2 border-t border-border/50 pt-2 text-[11.5px] italic text-muted-foreground">
              “{word.example}”
            </p>

            <div className="mt-3 flex items-center gap-1.5">
              <AudioPlayButton text={word.word} size="sm" variant="outline" />
              <button
                type="button"
                onClick={() => {
                  recordWordView(word.id);
                  openWord(word.id);
                }}
                className="archetype-btn flex-1 rounded-lg border border-border bg-surface/60 px-2 py-1.5 text-[11px] font-black hover:border-primary/50"
              >
                تدريب شامل
              </button>
              <button
                type="button"
                onClick={() => toggleMastered(word.id)}
                aria-pressed={isMastered}
                className={cn(
                  'archetype-btn rounded-lg border px-2 py-1.5 text-[11px] font-black transition-colors',
                  isMastered
                    ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                    : 'border-border bg-surface/60 hover:border-emerald-500/40'
                )}
                title={isMastered ? 'إزالة الإتقان' : 'تحديد كمتقنة (+25 XP)'}
              >
                <CheckCircle className={cn('h-3.5 w-3.5', isMastered && 'fill-emerald-500/20')} />
              </button>
            </div>
          </motion.div>

          {/* Streak / level strip */}
          <div className="grid grid-cols-3 gap-2">
            <div className="archetype-card flex flex-col items-center gap-0.5 p-2.5 text-center">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-heading text-base font-black leading-none">{streak}</span>
              <span className="text-[9px] font-bold text-muted-foreground">يوم متواصل</span>
            </div>
            <div className="archetype-card flex flex-col items-center gap-0.5 p-2.5 text-center">
              <Zap className="h-4 w-4 text-amber-500" />
              <span className="font-heading text-base font-black leading-none">{level.level}</span>
              <span className="text-[9px] font-bold text-muted-foreground">{level.nameAr}</span>
            </div>
            <div className="archetype-card flex flex-col items-center gap-0.5 p-2.5 text-center">
              <Target className="h-4 w-4 text-primary" />
              <span className="font-heading text-base font-black leading-none">
                {level.progressPercent}%
              </span>
              <span className="text-[9px] font-bold text-muted-foreground">للمستوى التالي</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Quick access                                                       */
/* ------------------------------------------------------------------ */
function QuickAccess() {
  const items = NAV_ITEMS.filter((item) => item.href !== '/');

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Zap className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-base font-black sm:text-lg">وصول سريع إلى المساحات</h2>
        <span className="section-rule" />
        <span className="text-[10.5px] font-bold text-muted-foreground">
          {items.length} مساحات + لوحة الأوامر ⌘K
        </span>
      </div>

      <RevealGroup className="grid grid-cols-2 gap-2.5 md:grid-cols-3 xl:grid-cols-6" stagger={0.05}>
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <RevealItem key={item.href} className="h-full">
              <Link
                href={item.href}
                className="archetype-card group flex h-full flex-col gap-2 p-3.5 transition-transform hover:-translate-y-1"
              >
                <span
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br text-white shadow-sm transition-transform duration-300 group-hover:scale-110',
                    item.accent
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex items-center gap-1 text-[12px] font-black leading-tight">
                  {item.label}
                  {item.isNew && (
                    <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[8px] font-black uppercase text-primary">
                      New
                    </span>
                  )}
                </span>
                <span className="line-clamp-2 text-[10.5px] leading-snug text-muted-foreground">
                  {item.description}
                </span>
                <span className="mt-auto flex items-center gap-1 pt-1 text-[10px] font-black text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  انتقال
                  <ArrowLeft className="h-3 w-3" />
                </span>
              </Link>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Feature marquee                                                    */
/* ------------------------------------------------------------------ */
function FeatureMarquee() {
  const features = [
    { icon: <Volume2 className="h-3.5 w-3.5" />, label: 'محركا نطق مزدوجان' },
    { icon: <Mic className="h-3.5 w-3.5" />, label: 'تقييم نطق فوري' },
    { icon: <Languages className="h-3.5 w-3.5" />, label: 'بحث عربي بدون تشكيل' },
    { icon: <Brain className="h-3.5 w-3.5" />, label: 'مراجعة متباعدة FSRS' },
    { icon: <Sparkles className="h-3.5 w-3.5" />, label: 'قصص Grok المولّدة' },
    { icon: <Palette className="h-3.5 w-3.5" />, label: '6 لغات تصميم' },
    { icon: <Target className="h-3.5 w-3.5" />, label: 'خريطة CEFR كاملة' },
    { icon: <Cpu className="h-3.5 w-3.5" />, label: 'معلم ذكي بالأدوار' },
  ];

  return (
    <div className="marquee-viewport rounded-xl border border-border/60 bg-surface/40 py-2">
      <div className="marquee-track gap-6 pr-6">
        {[...features, ...features].map((feature, index) => (
          <span
            key={`${feature.label}-${index}`}
            className="flex shrink-0 items-center gap-1.5 text-[10.5px] font-black uppercase tracking-wider text-muted-foreground"
          >
            <span className="text-primary">{feature.icon}</span>
            {feature.label}
            <span className="mx-2 text-border">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Continue where you left off                                        */
/* ------------------------------------------------------------------ */
function RecentStrip() {
  const recentWordIds = useStore((state) => state.recentWordIds);
  const words = recentWordIds
    .map((id) => OXFORD_DATASET.find((entry) => entry.id === id))
    .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry))
    .slice(0, 10);

  if (words.length === 0) return null;

  return (
    <section className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="font-heading text-base font-black">استمر من حيث توقفت</h2>
        <span className="section-rule" />
        <span className="text-[10.5px] font-bold text-muted-foreground">
          {words.length} كلمة مؤخرًا
        </span>
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {words.map((word) => (
          <button
            key={word.id}
            type="button"
            onClick={() => openWord(word.id)}
            className="archetype-card group flex shrink-0 items-center gap-2 bg-surface/60 px-3 py-2 text-right transition-transform hover:-translate-y-0.5"
          >
            <span className="ltr-isolate font-heading text-sm font-black transition-colors group-hover:text-primary">
              {word.word}
            </span>
            <span className="rtl-text max-w-[8rem] truncate text-[10.5px] text-muted-foreground">
              {word.arabic.split(/[/،]/)[0]}
            </span>
            <Badge
              variant={
                word.cefr === 'A1' ? 'a1' : word.cefr === 'A2' ? 'a2' : word.cefr === 'B1' ? 'b1' : 'b2'
              }
              className="archetype-badge text-[9px]"
            >
              {word.cefr}
            </Badge>
          </button>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */
export default function HomePage() {
  return (
    <PageShell currentPath="/" wide>
      <HomeHero />
      <FeatureMarquee />
      <QuickAccess />
      <RecentStrip />

      <section id="lexicon" className="scroll-mt-24 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <BookOpen className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-base font-black sm:text-lg">شبكة المفردات الكاملة</h2>
          <span className="section-rule" />
          <span className="text-[10.5px] font-bold text-muted-foreground">
            {CEFR_COUNTS.TOTAL.toLocaleString('en-US')} كلمة · A1 {CEFR_COUNTS.A1} · A2{' '}
            {CEFR_COUNTS.A2} · B1 {CEFR_COUNTS.B1} · B2 {CEFR_COUNTS.B2}
          </span>
        </div>
        <Reveal amount={0.01} y={10}>
          <LexiconCatalog />
        </Reveal>
      </section>
    </PageShell>
  );
}
