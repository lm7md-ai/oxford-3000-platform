'use client';

import * as React from 'react';
import { BarChart3, Sparkles, Trophy, Target, Flame, Star } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { RankIcon } from '@/components/shared/RankIcon';
import { PageHeader } from '@/components/shared/PageHeader';
import { AnalyticsDashboard } from '@/features/analytics/components/AnalyticsDashboard';
import { useStore, getLevelInfo } from '@/lib/store';
import { OXFORD_DATASET } from '@/data/oxfordDataset';

export default function AnalyticsPage() {
  const mastered = useStore((state) => state.masteredWordIds.length);
  const favorites = useStore((state) => state.favoriteWordIds.length);
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const level = getLevelInfo(totalXp);

  const percent = Math.round((mastered / OXFORD_DATASET.length) * 100);

  return (
    <PageShell currentPath="/analytics">
      <PageHeader
        badge="Comprehensive CEFR Metrics"
        badgeIcon={<Sparkles className="h-3 w-3" />}
        eyebrow="Progress Intelligence"
        title="تحليلات التقدّم"
        highlight="والإتقان"
        description="تابع تقدمك عبر مستويات A1 و A2 و B1 و B2، وراقب السلاسل اليومية ونقاط الخبرة ورتبتك الحالية داخل المعجم."
        stats={[
          { label: 'الإتقان الكلي', value: `${percent}%`, icon: <Target className="h-3 w-3" /> },
          { label: 'كلمات متقنة', value: mastered, icon: <BarChart3 className="h-3 w-3" /> },
          { label: 'الرتبة', value: `L${level.level}`, icon: <RankIcon level={level.level} className="h-3 w-3" /> },
          { label: 'سلسلة', value: `${streak} يوم`, icon: <Flame className="h-3 w-3" /> },
        ]}
        actions={
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">
              <Star className="h-3 w-3" /> {favorites} مفضلة
            </span>
            <span className="chip">
              <Trophy className="h-3 w-3" /> {totalXp} XP
            </span>
            <span className="chip">{level.nameAr}</span>
          </div>
        }
      />

      <AnalyticsDashboard />
    </PageShell>
  );
}
