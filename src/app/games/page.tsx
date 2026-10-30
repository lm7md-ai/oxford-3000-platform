'use client';

import * as React from 'react';
import { Gamepad2, Zap, Trophy, Target, Flame } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { GameHub } from '@/features/games/components/GameHub';
import { useStore, getLevelInfo } from '@/lib/store';

export default function GamesPage() {
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const mastered = useStore((state) => state.masteredWordIds.length);
  const level = getLevelInfo(totalXp);

  return (
    <PageShell currentPath="/games">
      <PageHeader
        align="center"
        badge="Gamified Active Recall"
        badgeIcon={<Zap className="h-3 w-3" />}
        eyebrow="Quiz & Challenge Hub"
        title="الألعاب"
        highlight="والمسابقات"
        description="تحدَّ نفسك باختبارات سرعة، تدريبات أزواج صوتية، وتحديات سلاسل الكلمات — واكسب نقاط خبرة ترفع رتبتك في المعجم."
        stats={[
          { label: 'المستوى', value: `L${level.level} · ${level.icon}`, icon: <Trophy className="h-3 w-3" /> },
          { label: 'مجموع XP', value: totalXp, icon: <Zap className="h-3 w-3" /> },
          { label: 'سلسلة', value: `${streak} يوم`, icon: <Flame className="h-3 w-3" /> },
          { label: 'متقنة', value: mastered, icon: <Target className="h-3 w-3" /> },
        ]}
      />

      <GameHub />

      <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2 text-[10.5px] font-bold text-muted-foreground">
        <span className="chip">
          <Gamepad2 className="h-3 w-3" /> 5 أنماط لعب
        </span>
        <span className="chip">
          <Zap className="h-3 w-3" /> نقاط خبرة فورية
        </span>
        <span className="chip">
          <Trophy className="h-3 w-3" /> لوحة صدارة محلية
        </span>
      </div>
    </PageShell>
  );
}
