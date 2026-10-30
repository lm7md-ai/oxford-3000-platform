'use client';

import * as React from 'react';
import { MessageSquare, Sparkles, Mic, Languages, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { AiTutorChat } from '@/features/ai-tutor/components/AiTutorChat';
import { useStore } from '@/lib/store';
import { OXFORD_DATASET } from '@/data/oxfordDataset';

export default function TutorPage() {
  const totalXp = useStore((state) => state.totalXp);
  const streak = useStore((state) => state.currentStreakDays);
  const mastered = useStore((state) => state.masteredWordIds.length);

  return (
    <PageShell currentPath="/tutor">
      <PageHeader
        badge="Real-Time Roleplay Dialogues"
        badgeIcon={<Sparkles className="h-3 w-3" />}
        eyebrow="AI Persona Tutor"
        title="مدرّب المحادثة والنطق"
        highlight="الشخصي"
        description="حاكِ محادثات إنجليزية واقعية في مواقف يومية ومهنية، واحصل على تصحيح نحوي فوري، ترجمة عربية سياقية، ومفردات مقترحة أثناء الحوار."
        actions={
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">
              <Mic className="h-3 w-3" /> إدخال صوتي
            </span>
            <span className="chip">
              <Languages className="h-3 w-3" /> ترجمة فورية
            </span>
            <span className="chip">
              <ShieldCheck className="h-3 w-3" /> مفتاحك محلي
            </span>
          </div>
        }
        stats={[
          { label: 'كلمات متقنة', value: mastered, icon: <MessageSquare className="h-3 w-3" /> },
          { label: 'مجموع XP', value: totalXp, icon: <Sparkles className="h-3 w-3" /> },
          { label: 'سلسلة الأيام', value: streak, icon: <Mic className="h-3 w-3" /> },
          { label: 'مفردات المعجم', value: OXFORD_DATASET.length, icon: <Languages className="h-3 w-3" /> },
        ]}
      />

      <AiTutorChat />
    </PageShell>
  );
}
