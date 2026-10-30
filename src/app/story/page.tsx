'use client';

import * as React from 'react';
import { Sparkles, BookOpen, Mic, Wand2 } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { SentenceGeneratorCard } from '@/features/ai-generator/components/sentence-generator-card';
import { StorytellerStudio } from '@/features/storyteller/components/StorytellerStudio';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export default function StoryPage() {
  return (
    <PageShell currentPath="/story">
      <PageHeader
        badge="Generative Context & Linguistics Engine"
        badgeIcon={<Sparkles className="h-3 w-3" />}
        eyebrow="Sentence & Story Studio"
        title="استوديو توليد"
        highlight="الجمل والقصص"
        description="ولّد جملًا سياقية متدرجة الصعوبة (A1 حتى C2) بتحكم كامل في الطول والموضع والنمط، أو ابنِ قصة كاملة مترابطة من كلماتك المختارة مع تقييم نطق سطرًا بسطر."
        actions={
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">
              <Wand2 className="h-3 w-3" /> Grok AI
            </span>
            <span className="chip">
              <Mic className="h-3 w-3" /> تقييم النطق
            </span>
            <span className="chip">
              <BookOpen className="h-3 w-3" /> ترجمة عربية
            </span>
          </div>
        }
      />

      <Tabs defaultValue="sentence" className="space-y-6">
        <TabsList className="archetype-card bg-muted/60 p-1">
          <TabsTrigger value="sentence" className="archetype-btn gap-2 text-xs font-bold">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>مولد الجمل المستهدفة (A1–C2)</span>
          </TabsTrigger>
          <TabsTrigger value="story" className="archetype-btn gap-2 text-xs font-bold">
            <BookOpen className="h-4 w-4 text-primary" />
            <span>استوديو توليد القصص المتكاملة</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sentence" className="space-y-4">
          <SentenceGeneratorCard initialWord="opportunity" initialCefr="B2" />
        </TabsContent>

        <TabsContent value="story" className="space-y-4">
          <StorytellerStudio />
        </TabsContent>
      </Tabs>
    </PageShell>
  );
}
