'use client';

import * as React from 'react';
import { Palette, Sparkles, Layers, Move3d, Wand2 } from 'lucide-react';
import { PageShell } from '@/components/shared/PageShell';
import { PageHeader } from '@/components/shared/PageHeader';
import { DesignLab } from '@/features/design-lab/components/DesignLab';
import { LayoutGallery } from '@/components/layouts/LayoutGallery';
import { useStore } from '@/lib/store';
import { getThemeById } from '@/styles/themes';
import { ARCHETYPES, DESIGN_GENERATIONS, getArchetypeMeta } from '@/styles/archetypes';
import { THEMES } from '@/styles/themes';

export default function DesignPage() {
  const themeId = useStore((state) => state.themeId);
  const theme = getThemeById(themeId);
  const meta = getArchetypeMeta(theme.archetype);

  return (
    <PageShell currentPath="/design" wide>
      <PageHeader
        badge="Design Language Laboratory"
        badgeIcon={<Palette className="h-3 w-3" />}
        eyebrow="6 design languages · 4 generations"
        title="معرض لغات التصميم"
        highlight="والجيل الرابع الجديد"
        description="كل نموذج في المنصة ينتمي إلى لغة تصميم كاملة تغيّر الحواف والظلال والملامس والحركة. جرّب الستة مباشرةً — بما فيها الجيل الرابع الزجاجي الشفقّي الذي يضيف طبقات ضوء حيّة فوق المحتوى."
        actions={
          <div className="flex flex-wrap gap-1.5">
            <span className="chip">
              <Layers className="h-3 w-3" /> {THEMES.length} نموذجًا
            </span>
            <span className="chip">
              <Move3d className="h-3 w-3" /> {ARCHETYPES.length} لغات
            </span>
            <span className="chip">
              <Wand2 className="h-3 w-3" /> تبديل فوري
            </span>
          </div>
        }
        stats={[
          {
            label: 'التصميم النشط',
            value: <span className="text-sm">{meta.nameAr}</span>,
            icon: <Palette className="h-3 w-3" />,
          },
          { label: 'لغات التصميم', value: ARCHETYPES.length, icon: <Layers className="h-3 w-3" /> },
          { label: 'أجيال التصميم', value: DESIGN_GENERATIONS.length, icon: <Sparkles className="h-3 w-3" /> },
          { label: 'نماذج جاهزة', value: THEMES.length, icon: <Wand2 className="h-3 w-3" /> },
        ]}
      />

      <LayoutGallery />

      <DesignLab />
    </PageShell>
  );
}
