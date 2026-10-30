'use client';

import * as React from 'react';
import { Sparkles, Layers, Star, CheckCircle, Brain } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { FlashcardTrainer } from '@/features/flashcards-srs/components/FlashcardTrainer';
import { useStore } from '@/lib/store';

export default function FlashcardsPage() {
  const mastered = useStore((state) => state.masteredWordIds.length);
  const favorites = useStore((state) => state.favoriteWordIds.length);
  const totalXp = useStore((state) => state.totalXp);

  return (
    <PageShell currentPath="/flashcards">
      <PageHeader
        align="center"
        badge="Spaced Repetition System (SRS)"
        badgeIcon={<Sparkles className="h-3 w-3" />}
        eyebrow="Active Recall Studio"
        title="بطاقات الذاكرة"
        highlight="ثلاثية الأبعاد"
        description="ثبّت المفردات في ذاكرتك طويلة المدى باستخدام نموذج التكرار المتباعد (Leitner / FSRS). اقلب البطاقة لاختبار الاسترجاع النشط ثم قيّم مستوى تذكّرك."
        stats={[
          { label: 'متقنة', value: mastered, icon: <CheckCircle className="h-3 w-3" /> },
          { label: 'مفضلة', value: favorites, icon: <Star className="h-3 w-3" /> },
          { label: 'XP', value: totalXp, icon: <Sparkles className="h-3 w-3" /> },
          {
            label: 'خطة المراجعة',
            value: 'FSRS',
            icon: <Brain className="h-3 w-3" />,
          },
        ]}
      />

      <FlashcardTrainer />

      <div className="mx-auto flex max-w-xl flex-wrap items-center justify-center gap-2 text-[10.5px] font-bold text-muted-foreground">
        <span className="chip">
          <Layers className="h-3 w-3" /> اقلب البطاقة بالمسافة
        </span>
        <span className="chip">
          <CheckCircle className="h-3 w-3" /> التقييم يحدّث الجدولة تلقائيًا
        </span>
        <span className="chip">
          <Sparkles className="h-3 w-3" /> +XP لكل إتقان
        </span>
      </div>
    </PageShell>
  );
}
