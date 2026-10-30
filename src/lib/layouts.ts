import type { LucideIcon } from 'lucide-react';
import {
  Newspaper,
  LayoutDashboard,
  Sparkles,
  PanelLeft,
  MousePointerClick,
} from 'lucide-react';

/**
 * =========================================================================
 * INTERFACE SYSTEM — three independent site layouts
 * -------------------------------------------------------------------------
 * Themes change colour; layouts change *structure*: where the navigation
 * lives, how the page opens, and in which order the home sections appear.
 * =========================================================================
 */

export type LayoutId = 'editorial' | 'workspace' | 'showcase';

export type HomeSectionId = 'hero' | 'stats' | 'word' | 'quickAccess' | 'recent' | 'lexicon';

export interface LayoutMeta {
  id: LayoutId;
  nameAr: string;
  nameEn: string;
  tagline: string;
  description: string;
  /** Where the primary navigation sits. */
  nav: 'top' | 'sidebar' | 'floating';
  icon: LucideIcon;
  /** Order of the home page sections — this is what makes them feel separate. */
  homeOrder: HomeSectionId[];
  /** Content column width. */
  width: 'container' | 'wide' | 'full';
}

export const LAYOUTS: LayoutMeta[] = [
  {
    id: 'editorial',
    nameAr: 'التحريري',
    nameEn: 'Editorial',
    tagline: 'صفحة صحيفة: ترويسة أفقية وعمود جانبي',
    description:
      'تبدأ الصفحة بترويسة صحفية وقاعدة بيانات، ثم العنوان والعمود الجانبي لكلمة اليوم، ثم المساحات والمعجم.',
    nav: 'top',
    icon: Newspaper,
    homeOrder: ['hero', 'quickAccess', 'recent', 'lexicon'],
    width: 'wide',
  },
  {
    id: 'workspace',
    nameAr: 'مساحة العمل',
    nameEn: 'Workspace',
    tagline: 'شريط جانبي ثابت ولوحة مؤشرات',
    description:
      'تطبيق بأسلوب لوحة التحكم: تنقّل رأسي في شريط جانبي، شريط أوامر علوي، وأرقامك أولًا ثم المعجم.',
    nav: 'sidebar',
    icon: LayoutDashboard,
    homeOrder: ['stats', 'recent', 'word', 'quickAccess', 'lexicon'],
    width: 'full',
  },
  {
    id: 'showcase',
    nameAr: 'العرض الغامر',
    nameEn: 'Showcase',
    tagline: 'غلاف ملء الشاشة وشريط تنقّل عائم',
    description:
      'موقع تعريفي بصري: غلاف واسع بخط ضخم، كلمة اليوم كلوحة مميزة، ثم شبكة مساحات كبيرة قبل المعجم.',
    nav: 'floating',
    icon: Sparkles,
    homeOrder: ['hero', 'word', 'quickAccess', 'lexicon', 'recent'],
    width: 'full',
  },
];

export const DEFAULT_LAYOUT_ID: LayoutId = 'editorial';

export function getLayoutMeta(id: string | undefined | null): LayoutMeta {
  return LAYOUTS.find((layout) => layout.id === id) ?? LAYOUTS[0];
}

export function isLayoutId(value: unknown): value is LayoutId {
  return typeof value === 'string' && LAYOUTS.some((layout) => layout.id === value);
}

/** Extra affordances shown in the switcher UI. */
export const LAYOUT_HINTS = {
  top: PanelLeft,
  sidebar: PanelLeft,
  floating: MousePointerClick,
} as const;
