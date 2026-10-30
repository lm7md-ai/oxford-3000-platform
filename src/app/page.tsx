'use client';

import * as React from 'react';
import Link from 'next/link';
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
import { LexiconCatalog } from '@/features/lexicon/components/LexiconCatalog';
import { AudioPlayButton } from '@/features/audio-speech/components/AudioPlayButton';
import { Badge } from '@/components/ui/badge';
import { useStore, getLevelInfo } from '@/lib/store';
import { OXFORD_DATASET, CEFR_COUNTS } from '@/data/oxfordDataset';
import { NAV_ITEMS } from '@/lib/navigation';
import { getThemeById, THEMES } from '@/styles/themes';
import { getArchetypeMeta } from '@/styles/archetypes';
import { OPEN_WORD_EVENT, PENDING_WORD_KEY } from '@/components/shared/CommandPalette';
import { cn } from '@/lib/utils';

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
/* Section heading — one consistent editorial rhythm                   */
/* ------------------------------------------------------------------ */
function SectionHeading({
  index,
  title,
  meta,
  id,
}: {
  index: string;
  title: string;
  meta: string;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 border-b border-border pb-2.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="flex items-baseline gap-2.5 font-heading text-[1.05rem] font-semibold text-foreground sm:text-[1.15rem]">
          <span className="ltr-isolate text-[10px] font-semibold tabular-nums text-primary" dir="ltr">
            {index}
          </span>
          {title}
        </h2>
        <span className="text-[10.5px] font-medium text-muted-foreground">{meta}</span>
      </div>
    </div>
  );
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

  const theme = getThemeById(themeId);
  const meta = getArchetypeMeta(theme.archetype);
  const word = useWordOfTheDay();
  const isMastered = masteredWordIds.includes(word.id);
  const level = getLevelInfo(totalXp);

  const stats = [
    { label: 'Headwords', value: CEFR_COUNTS.TOTAL, hint: 'A1 → B2' },
    { label: 'Mastered', value: masteredCount, hint: `${Math.round((masteredCount / CEFR_COUNTS.TOTAL) * 100)}%` },
    { label: 'Saved', value: favorites, hint: 'محفوظة' },
    { label: 'XP', value: totalXp, hint: level.nameAr },
  ];

  return (
    <section className="relative overflow-hidden pb-10 sm:pb-14">
      {/* Masthead rule — the page opens like a printed edition, not a template */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-foreground/15 pb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
        <span className="flex items-center gap-2 text-foreground">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary" />
          Oxford 3000™ — الطبعة الثالثة
        </span>
        <span className="hidden items-center gap-2 sm:flex">
          <Palette aria-hidden="true" className="h-3 w-3" />
          {meta.nameAr}
        </span>
        <span className="ltr-isolate tabular-nums" dir="ltr">
          A1 — B2 · {CEFR_COUNTS.TOTAL.toLocaleString('en-US')} headwords · IPA
        </span>
      </div>

      <div className="grid gap-12 pt-9 lg:grid-cols-[minmax(0,1fr)_20.5rem] lg:gap-14 lg:pt-12">
        {/* Lead story */}
        <div className="anim-rise">
          <p className="eyebrow text-primary">منصة تعلّم المفردات</p>

          <h1 className="mt-4 text-balance text-[2.2rem] font-semibold leading-[1.3] text-foreground sm:text-[3.1rem] sm:leading-[1.24]">
            أتقن مفردات <span className="text-primary">أكسفورد</span>
            <br className="hidden sm:block" /> بالصوت والذكاء الاصطناعي
          </h1>

          <p className="mt-5 max-w-[52ch] text-[14.5px] leading-[1.95] text-muted-foreground">
            ثلاث آلاف كلمة مع ترجمة عربية سياقية، ونسخ صوتي دولي، ومحرّكي نطق، وتقييم فوري
            للنطق، وقصص تفاعلية مولّدة — بواجهة واحدة قابلة للتحوّل بالكامل.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById('lexicon')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }
              className="archetype-btn group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground"
            >
              ابدأ التعلّم
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
            </button>

            <Link
              href="/design"
              className="inline-flex items-center gap-1.5 border-b border-foreground/25 pb-0.5 text-[13px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              معرض التصاميم
              <span className="ltr-isolate text-[10px] font-bold text-muted-foreground" dir="ltr">
                {THEMES.length}
              </span>
            </Link>

            <Link
              href="/flashcards"
              className="inline-flex items-center gap-1.5 border-b border-transparent pb-0.5 text-[13px] font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
            >
              بطاقات SRS
            </Link>
          </div>

          {/* Ledger of numbers: hairline grid, no boxes */}
          <dl className="stagger mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {stat.label}
                </dt>
                <dd className="mt-1.5 flex items-baseline gap-1.5">
                  <AnimatedNumber
                    value={stat.value}
                    className="ltr-isolate font-heading text-[1.4rem] font-semibold leading-none tracking-tight"
                  />
                  <span className="truncate text-[10.5px] font-medium text-muted-foreground">
                    {stat.hint}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Word of the day — set like a dictionary entry */}
        <aside className="anim-blur relative" style={{ animationDelay: '120ms' }}>
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-foreground/80 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-foreground">
              كلمة اليوم
            </span>
            <span className="ltr-isolate text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground" dir="ltr">
              {word.cefr}
            </span>
          </div>

          <h2 className="ltr-isolate mt-5 font-heading text-[2.5rem] font-semibold leading-none tracking-[-0.02em]">
            {word.word}
          </h2>
          <p className="ltr-isolate mt-2 font-mono text-[11px] text-muted-foreground" dir="ltr">
            {word.ipa} · {word.pos}
          </p>

          <p className="mt-3.5 text-[15px] font-medium leading-relaxed text-foreground">
            {word.arabic.split(/[/،]/)[0]}
          </p>

          <blockquote
            dir="ltr"
            className="mt-3 border-s-2 border-primary/35 ps-3 text-left text-[12px] italic leading-[1.85] text-muted-foreground"
          >
            “{word.example}”
          </blockquote>

          <div className="mt-5 flex items-center gap-2">
            <AudioPlayButton text={word.word} size="sm" variant="outline" />
            <button
              type="button"
              onClick={() => {
                recordWordView(word.id);
                openWord(word.id);
              }}
              className="archetype-btn flex-1 rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] font-semibold transition-colors hover:border-primary/45 hover:text-primary"
            >
              تدريب شامل
            </button>
            <button
              type="button"
              onClick={() => toggleMastered(word.id)}
              aria-pressed={isMastered}
              title={isMastered ? 'إزالة الإتقان' : 'تحديد كمتقنة (+25 XP)'}
              className={cn(
                'archetype-btn grid h-9 w-9 place-items-center rounded-md border transition-colors',
                isMastered
                  ? 'border-emerald-600/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'border-border bg-surface text-muted-foreground hover:border-emerald-600/40'
              )}
            >
              <CheckCircle className="h-4 w-4" />
            </button>
          </div>

          {/* Compact ledger: streak · level · progress */}
          <div className="mt-6 grid grid-cols-3 divide-x divide-border border-t border-border pt-4 text-center">
            <div className="px-1">
              <div className="ltr-isolate font-heading text-[1.1rem] font-semibold leading-none">
                {streak}
              </div>
              <div className="mt-1.5 text-[9.5px] font-medium text-muted-foreground">يوم متواصل</div>
            </div>
            <div className="px-1">
              <div className="ltr-isolate font-heading text-[1.1rem] font-semibold leading-none">
                {level.level}
              </div>
              <div className="mt-1.5 text-[9.5px] font-medium text-muted-foreground">{level.nameAr}</div>
            </div>
            <div className="px-1">
              <div className="ltr-isolate font-heading text-[1.1rem] font-semibold leading-none">
                {level.progressPercent}%
              </div>
              <div className="mt-1.5 text-[9.5px] font-medium text-muted-foreground">للمستوى التالي</div>
            </div>
          </div>
        </aside>
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
    <section className="space-y-4">
      <SectionHeading
        index="01"
        title="المساحات"
        meta={`${items.length} مساحات · لوحة الأوامر ⌘K`}
      />

      <div className="stagger grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-3.5 bg-surface p-4 transition-colors hover:bg-muted/60 sm:p-5"
            >
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-[13.5px] font-semibold leading-tight text-foreground">
                    {item.label}
                  </span>
                  <span className="ltr-isolate text-[9.5px] font-medium tabular-nums text-muted-foreground/70" dir="ltr">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </span>
                <span className="mt-1 block text-[11.5px] leading-[1.8] text-muted-foreground">
                  {item.description}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-semibold text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  انتقال
                  <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                </span>
              </span>

              {item.isNew && (
                <span className="mt-1 shrink-0 rounded-sm border border-primary/30 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-primary">
                  جديد
                </span>
              )}
            </Link>
          );
        })}
      </div>
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
    <div className="marquee-viewport border-y border-border bg-transparent py-2.5">
      <div className="marquee-track gap-6 pr-6">
        {[...features, ...features].map((feature, index) => (
          <span
            key={`${feature.label}-${index}`}
            className="flex shrink-0 items-center gap-2 text-[10.5px] font-medium tracking-wide text-muted-foreground"
          >
            <span className="text-primary/80">{feature.icon}</span>
            {feature.label}
            <span aria-hidden="true" className="mx-2 h-3 w-px bg-border" />
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
    <section className="space-y-4">
      <SectionHeading index="02" title="استمر من حيث توقفت" meta={`${words.length} كلمة مؤخرًا`} />
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {words.map((word) => (
          <button
            key={word.id}
            type="button"
            onClick={() => openWord(word.id)}
            className="group flex shrink-0 items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-right transition-colors hover:border-primary/40"
          >
            <span className="ltr-isolate font-heading text-sm font-semibold transition-colors group-hover:text-primary">
              {word.word}
            </span>
            <span className="rtl-text max-w-[8rem] truncate text-[10.5px] text-muted-foreground">
              {word.arabic.split(/[/،]/)[0]}
            </span>
            <span className="ltr-isolate text-[9px] font-semibold uppercase tracking-wider text-muted-foreground" dir="ltr">
              {word.cefr}
            </span>
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
      <div className="space-y-12 pt-12 sm:space-y-16 sm:pt-16">
        <QuickAccess />
        <RecentStrip />

      <section className="space-y-4">
        <SectionHeading
          id="lexicon"
          index="03"
          title="شبكة المفردات الكاملة"
          meta={`${CEFR_COUNTS.TOTAL.toLocaleString('en-US')} كلمة · A1 ${CEFR_COUNTS.A1} · A2 ${CEFR_COUNTS.A2} · B1 ${CEFR_COUNTS.B1} · B2 ${CEFR_COUNTS.B2}`}
        />
        <LexiconCatalog />
        </section>
      </div>
    </PageShell>
  );
}
