import {
  BookOpen,
  MessageSquare,
  Sparkles,
  Layers,
  Gamepad2,
  BarChart3,
  Palette,
  type LucideIcon,
} from 'lucide-react';

export type NavGroupId = 'learn' | 'create' | 'progress';

export interface NavItem {
  href: string;
  label: string;
  labelEn: string;
  description: string;
  icon: LucideIcon;
  group: NavGroupId;
  accent: string;
  isNew?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  {
    href: '/',
    label: 'شبكة المفردات',
    labelEn: 'Lexicon Grid',
    description: 'تصفّح ٣٠٠٢ كلمة من Oxford 3000 مع البحث العربي والنطق والتدريب.',
    icon: BookOpen,
    group: 'learn',
    accent: 'from-violet-500 to-indigo-500',
  },
  {
    href: '/flashcards',
    label: 'بطاقات SRS',
    labelEn: 'SRS Flashcards',
    description: 'مراجعة متباعدة ثلاثية الأبعاد لتثبيت المفردات في الذاكرة طويلة المدى.',
    icon: Layers,
    group: 'learn',
    accent: 'from-sky-500 to-cyan-500',
  },
  {
    href: '/games',
    label: 'الألعاب والمسابقات',
    labelEn: 'Games',
    description: 'اختبارات سريعة، أزواج صوتية، وتحديات لكسب نقاط الخبرة.',
    icon: Gamepad2,
    group: 'learn',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    href: '/tutor',
    label: 'المعلم الذكي',
    labelEn: 'AI Tutor',
    description: 'محادثات تمثيل أدوار مع تصحيح نحوي فوري وترجمة سياقية.',
    icon: MessageSquare,
    group: 'create',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    href: '/story',
    label: 'استوديو الجمل والقصص',
    labelEn: 'Sentence & Story Studio',
    description: 'توليد جمل وقصص تفاعلية بالذكاء الاصطناعي مع تقييم النطق سطرًا بسطر.',
    icon: Sparkles,
    group: 'create',
    accent: 'from-fuchsia-500 to-pink-500',
  },
  {
    href: '/analytics',
    label: 'التحليلات',
    labelEn: 'Analytics',
    description: 'متابعة الإتقان، السلاسل اليومية، ونقاط الخبرة عبر مستويات CEFR.',
    icon: BarChart3,
    group: 'progress',
    accent: 'from-blue-500 to-indigo-500',
  },
  {
    href: '/design',
    label: 'استوديو التصميم',
    labelEn: 'Design Lab',
    description: 'معرض لغات التصميم الست — بما فيها الجيل الرابع الزجاجي الشفقّي الجديد.',
    icon: Palette,
    group: 'progress',
    accent: 'from-violet-500 via-cyan-400 to-pink-500',
    isNew: true,
  },
];

export const NAV_GROUPS: {
  id: NavGroupId;
  label: string;
  labelEn: string;
  hint: string;
}[] = [
  { id: 'learn', label: 'التعلّم اليومي', labelEn: 'Daily learning', hint: 'المفردات والمراجعة واللعب' },
  { id: 'create', label: 'الإبداع بالذكاء', labelEn: 'AI creation', hint: 'توليد ومحادثة وتقييم' },
  { id: 'progress', label: 'التقدّم والتصميم', labelEn: 'Progress & design', hint: 'قياس الأداء وتغيير الهوية' },
];

export function isPathActive(currentPath: string, href: string): boolean {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(`${href}/`);
}
