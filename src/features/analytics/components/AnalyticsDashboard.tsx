'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Trophy,
  Zap,
  Star,
  CheckCircle,
  Award,
  Target,
  Flame,
  TrendingUp,
  Gauge,
  Milestone,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { OXFORD_DATASET, CEFR_COUNTS } from '@/data/oxfordDataset';
import { useStore, getLevelInfo, XP_LEVELS } from '@/lib/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PENDING_WORD_KEY } from '@/components/shared/CommandPalette';
import { RankIcon } from '@/components/shared/RankIcon';

export function AnalyticsDashboard() {
  const router = useRouter();
  const masteredWordIds = useStore((state) => state.masteredWordIds);
  const favoriteWordIds = useStore((state) => state.favoriteWordIds);
  const totalXp = useStore((state) => state.totalXp);
  const currentStreak = useStore((state) => state.currentStreakDays);
  const xpToday = useStore((state) => state.xpToday);
  const dailyGoalXp = useStore((state) => state.dailyGoalXp);
  const setDailyGoalXp = useStore((state) => state.setDailyGoalXp);
  const recentWordIds = useStore((state) => state.recentWordIds);
  const level = getLevelInfo(totalXp);
  const goalPercent = Math.min(100, Math.round((xpToday / Math.max(1, dailyGoalXp)) * 100));

  const recentWords = recentWordIds
    .map((id) => OXFORD_DATASET.find((word) => word.id === id))
    .filter((word): word is NonNullable<typeof word> => Boolean(word))
    .slice(0, 8);

  const openWord = (id: number) => {
    try {
      sessionStorage.setItem(PENDING_WORD_KEY, String(id));
    } catch {
      /* storage unavailable */
    }
    router.push('/');
  };

  const totalWords = OXFORD_DATASET.length;
  const masteredCount = masteredWordIds.length;
  const overallPercentage = Math.round((masteredCount / totalWords) * 100);

  // CEFR breakdown
  const cefrBreakdown = React.useMemo(() => {
    const levels = ['A1', 'A2', 'B1', 'B2'] as const;
    return levels.map((lvl) => {
      const wordsInLevel = OXFORD_DATASET.filter((w) => w.cefr === lvl);
      const masteredInLevel = wordsInLevel.filter((w) => masteredWordIds.includes(w.id)).length;
      const pct = Math.round((masteredInLevel / wordsInLevel.length) * 100);
      return {
        level: lvl,
        total: wordsInLevel.length,
        mastered: masteredInLevel,
        percentage: pct,
      };
    });
  }, [masteredWordIds]);

  const userTier =
    totalXp >= 1500
      ? 'Oxford Grand Scholar'
      : totalXp >= 750
      ? 'Fluency Practitioner'
      : totalXp >= 250
      ? 'Dedicated Lexicist'
      : 'Novice Explorer';

  return (
    <div className="space-y-8">
      {/* Top Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 border-border bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Mastery</span>
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-foreground">{masteredCount}</span>
            <span className="text-sm text-muted-foreground">/ {totalWords} words</span>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, Math.max(2, overallPercentage))}%` }}
            />
          </div>
        </Card>

        <Card className="p-6 border-border bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Experience Points</span>
            <Trophy className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-foreground">{totalXp}</span>
            <span className="text-sm text-muted-foreground">XP</span>
          </div>
          <p className="text-xs text-primary font-medium">{userTier}</p>
        </Card>

        <Card className="p-6 border-border bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="h-5 w-5 text-orange-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-foreground">{currentStreak}</span>
            <span className="text-sm text-muted-foreground">Days</span>
          </div>
          <p className="text-xs text-muted-foreground">Daily consecutive practice</p>
        </Card>

        <Card className="p-6 border-border bg-surface shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold uppercase tracking-wider">Starred Lexicon</span>
            <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-foreground">
              {favoriteWordIds.length}
            </span>
            <span className="text-sm text-muted-foreground">Terms</span>
          </div>
          <p className="text-xs text-muted-foreground">Flagged for targeted review</p>
        </Card>
      </div>

      {/* CEFR Level Mastery Breakdown */}
      <Card className="border-border bg-surface shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <span>CEFR Framework Mastery Breakdown (A1 to B2)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cefrBreakdown.map((item) => (
              <div
                key={item.level}
                className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        item.level === 'A1'
                          ? 'a1'
                          : item.level === 'A2'
                          ? 'a2'
                          : item.level === 'B1'
                          ? 'b1'
                          : 'b2'
                      }
                      className="text-xs"
                    >
                      {item.level}
                    </Badge>
                    <span className="font-bold text-sm text-foreground">
                      {item.level === 'A1'
                        ? 'Beginner Essential'
                        : item.level === 'A2'
                        ? 'Elementary Fluency'
                        : item.level === 'B1'
                        ? 'Intermediate Core'
                        : 'Upper-Intermediate Precision'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-muted-foreground">
                    {item.mastered} / {item.total} ({item.percentage}%)
                  </span>
                </div>

                <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full transition-all duration-500 rounded-full',
                      item.level === 'A1'
                        ? 'bg-emerald-500'
                        : item.level === 'A2'
                        ? 'bg-sky-500'
                        : item.level === 'B1'
                        ? 'bg-amber-500'
                        : 'bg-purple-500'
                    )}
                    style={{ width: `${Math.min(100, Math.max(1, item.percentage))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Daily goal + level ladder */}
      <div className="grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <Card className="border-border bg-surface p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Gauge className="h-5 w-5 text-primary" />
              هدف الخبرة اليومي
            </CardTitle>
            <Badge variant="accent" className="archetype-badge text-[10px]">
              {goalPercent}%
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="font-heading text-2xl font-black">
                {xpToday}
                <span className="text-sm font-bold text-muted-foreground"> / {dailyGoalXp} XP</span>
              </span>
              <span className="text-[11px] font-bold text-muted-foreground">
                {goalPercent >= 100 ? 'تم تحقيق الهدف اليومي' : `متبقٍ ${Math.max(0, dailyGoalXp - xpToday)} XP`}
              </span>
            </div>
            <div className="progress-track !h-3">
              <div
                className="progress-fill progress-fill-shine"
                style={{ width: `${Math.max(2, goalPercent)}%` }}
                role="progressbar"
                aria-valuenow={goalPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10.5px] font-black uppercase tracking-wider text-muted-foreground">
              تعديل الهدف:
            </span>
            {[60, 120, 250, 500].map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setDailyGoalXp(goal)}
                aria-pressed={dailyGoalXp === goal}
                className={cn(
                  'archetype-badge rounded-full border px-2 py-0.5 text-[10.5px] font-bold transition-colors',
                  dailyGoalXp === goal
                    ? 'border-primary bg-primary/15 text-primary'
                    : 'border-border/70 text-muted-foreground hover:border-primary/40'
                )}
              >
                {goal} XP
              </button>
            ))}
          </div>

          <p className="flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/30 px-2.5 py-2 text-[11px] font-bold text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {level.nextLevel
              ? `متبقٍ ${level.remainingXp} XP للوصول إلى «${level.nextLevel.nameAr}»`
              : 'وصلت إلى أعلى رتبة في المنصة'}
          </p>
        </Card>

        <Card className="border-border bg-surface p-6 shadow-md space-y-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Milestone className="h-5 w-5 text-primary" />
            سلّم الرتب
          </CardTitle>

          <div className="space-y-1.5">
            {XP_LEVELS.map((tier) => {
              const reached = totalXp >= tier.min;
              const isCurrent = tier.level === level.level;
              return (
                <div
                  key={tier.level}
                  className={cn(
                    'flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors',
                    isCurrent
                      ? 'border-primary/50 bg-primary/10'
                      : reached
                      ? 'border-emerald-500/30 bg-emerald-500/5'
                      : 'border-border/60 bg-muted/20'
                  )}
                >
                  <RankIcon level={tier.level} className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-[11.5px] font-bold">
                    {tier.nameAr}
                    <span className="ml-1 text-[9.5px] font-medium text-muted-foreground">
                      {tier.name}
                    </span>
                  </span>
                  <span className="font-mono text-[10px] font-black text-muted-foreground">
                    {tier.min} XP
                  </span>
                  {reached && <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />}
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Recent activity */}
      {recentWords.length > 0 && (
        <Card className="border-border bg-surface p-6 shadow-md space-y-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-5 w-5 text-primary" />
            استمر من حيث توقفت
          </CardTitle>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {recentWords.map((word) => (
              <button
                key={word.id}
                type="button"
                onClick={() => openWord(word.id)}
                className="archetype-card group flex flex-col items-start gap-1 bg-surface/60 p-2.5 text-right transition-transform hover:-translate-y-0.5"
              >
                <span className="flex w-full items-center justify-between">
                  <span className="ltr-isolate font-heading text-sm font-black group-hover:text-primary">
                    {word.word}
                  </span>
                  <Badge
                    variant={
                      word.cefr === 'A1' ? 'a1' : word.cefr === 'A2' ? 'a2' : word.cefr === 'B1' ? 'b1' : 'b2'
                    }
                    className="archetype-badge text-[9px]"
                  >
                    {word.cefr}
                  </Badge>
                </span>
                <span className="rtl-text line-clamp-1 text-[10.5px] text-muted-foreground">
                  {word.arabic.split(/[/،]/)[0]}
                </span>
                <span className="flex items-center gap-1 text-[9.5px] font-black text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  تدريب
                  <ArrowLeft className="h-2.5 w-2.5" />
                </span>
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
