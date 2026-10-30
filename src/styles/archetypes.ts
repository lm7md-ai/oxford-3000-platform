/**
 * =========================================================================
 *  DESIGN ARCHETYPE REGISTRY — "Design Language Generations"
 * =========================================================================
 *  Every theme in the platform is driven by one of these deep morphological
 *  archetypes. The archetype controls border physics, shadow depth, texture,
 *  motion personality and the overall "design generation" the UI belongs to.
 *
 *  Generations:
 *    1. Editorial & Heritage  → swiss · oxford-heritage
 *    2. Pop & Organic         → neo-brutalism · organic-terracotta
 *    3. Cyber & Terminal      → cyber-terminal
 *    4. Aurora Liquid Glass   → liquid-aurora  (NEW · modern generation)
 * =========================================================================
 */

export type DesignArchetype =
  | 'swiss'
  | 'neo-brutalism'
  | 'organic-terracotta'
  | 'cyber-terminal'
  | 'oxford-heritage'
  | 'liquid-aurora';

export type ArchetypeTexture =
  | 'grid'
  | 'halftone'
  | 'grain'
  | 'scanlines'
  | 'gilded'
  | 'aurora';

export type ArchetypeMotion = 'snappy' | 'springy' | 'smooth' | 'fluid';

export interface ArchetypeMeta {
  id: DesignArchetype;
  /** Canonical English name */
  name: string;
  /** Arabic display name */
  nameAr: string;
  /** One-line Arabic tagline */
  tagline: string;
  /** Long Arabic description */
  description: string;
  /** Key visual traits (Arabic chips) */
  traits: string[];
  /** Design generation number (1 → 4) */
  generation: 1 | 2 | 3 | 4;
  texture: ArchetypeTexture;
  motion: ArchetypeMotion;
  /** Signature palette used for preview chips */
  signature: string[];
  /** CSS gradient used in previews / backdrop accents */
  gradient: string;
  /** Brand-new fourth design language */
  isNew?: boolean;
}

export const ARCHETYPES: ArchetypeMeta[] = [
  {
    id: 'liquid-aurora',
    name: 'Aurora Liquid Glass',
    nameAr: 'الزجاج السائل الشفقّي',
    tagline: 'الجيل الرابع — تصميم عصري قائم على الضوء والزجاج',
    description:
      'طبقات زجاجية شفافة مع كسر ضوئي (chromatic refraction)، هالات شفقية متحركة ببطء، حدود مضيئة، وعمق ثلاثي الأبعاد ناعم. تصميم عصري بالكامل يضع المحتوى فوق ضوء حي.',
    traits: ['زجاج ضبابي', 'هالات شفقية', 'انكسار لوني', 'حركة سائلة', 'عمق مضيء'],
    generation: 4,
    texture: 'aurora',
    motion: 'fluid',
    signature: ['#8B5CF6', '#22D3EE', '#F472B6', '#0B1120', '#E2E8F0'],
    gradient:
      'radial-gradient(120% 120% at 12% 8%, #8B5CF6 0%, transparent 55%), radial-gradient(100% 100% at 88% 4%, #22D3EE 0%, transparent 50%), radial-gradient(90% 90% at 50% 100%, #F472B6 0%, transparent 55%)',
    isNew: true,
  },
  {
    id: 'swiss',
    name: 'Swiss Minimalist',
    nameAr: 'السويسري التحريري',
    tagline: 'شبكة صارمة، حياد معلوماتي، وتباين طباعي خالص',
    description:
      'إرث المدرسة السويسرية: زوايا قائمة تمامًا، خطوط شعرية رقيقة، شبكة خلفية خفيفة، وتباعد طباعي دقيق. الواجهة تختفي لصالح المحتوى.',
    traits: ['زوايا 0px', 'شبكة خلفية', 'خطوط شعرية', 'تباعد دقيق', 'تباين عالٍ'],
    generation: 1,
    texture: 'grid',
    motion: 'snappy',
    signature: ['#000000', '#E11D48', '#FFFFFF', '#F8F9FA', '#495057'],
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F1F3F5 60%, #E9ECEF 100%)',
  },
  {
    id: 'neo-brutalism',
    name: 'Neo-Brutalism Pop',
    nameAr: 'الوحشية الجديدة',
    tagline: 'ظلال صلبة، حدود سميكة، وطاقة بوب فنية',
    description:
      'حدود سوداء سميكة وظلال ساقطة صلبة بلا تمويه، أزرار بفيزياء ضغط حقيقية، وألوان صارخة جريئة. واجهة تصرخ بالثقة ولا تختبئ خلف النعومة.',
    traits: ['ظل صلب', 'حدود 2.5px', 'ضغط فيزيائي', 'ألوان صارخة', 'نصف ظلال (halftone)'],
    generation: 2,
    texture: 'halftone',
    motion: 'springy',
    signature: ['#000000', '#FEF08A', '#7C3AED', '#F43F5E', '#FFFFFF'],
    gradient: 'linear-gradient(135deg, #FEF08A 0%, #FB7185 55%, #A78BFA 100%)',
  },
  {
    id: 'organic-terracotta',
    name: 'Organic Clay',
    nameAr: 'العضوي الفخاري',
    tagline: 'انحناءات دافئة، ظلال منتشرة، وملمس يدوي',
    description:
      'خطوط دائرية سخية، ظلال ناعمة منتشرة، وحبيبات ورقية خفيفة. إحساس الحِرفية اليدوية يخفف الحمل الذهني ويجعل التعلم أكثر دفئًا.',
    traits: ['انحناء 24px', 'ظل منتشر', 'ملمس ورقي', 'ألوان ترابية', 'حبّات دقيقة'],
    generation: 2,
    texture: 'grain',
    motion: 'smooth',
    signature: ['#C86D51', '#FFF7ED', '#8A9A86', '#FDBA74', '#431407'],
    gradient: 'linear-gradient(135deg, #FFF7ED 0%, #FED7AA 60%, #C86D51 100%)',
  },
  {
    id: 'cyber-terminal',
    name: 'Cyber Terminal HUD',
    nameAr: 'الطرفية السيبرانية',
    tagline: 'واجهة HUD نيون، خطوط مسح، وإضاءة نيون دقيقة',
    description:
      'لوحة تحكم مستقبلية: خلفية شبه سوداء، خطوط مسح أفقية، أقواس زوايا تقنية، وهج نيون يتبع اللون الأساسي. مثالي للجلسات الليلية الطويلة.',
    traits: ['خطوط مسح', 'أقواس HUD', 'وهج نيون', 'خط أحادي', 'حواف حادة'],
    generation: 3,
    texture: 'scanlines',
    motion: 'snappy',
    signature: ['#06B6D4', '#10B981', '#030712', '#1E293B', '#F8FAFC'],
    gradient: 'linear-gradient(135deg, #030712 0%, #0F172A 50%, #06B6D4 100%)',
  },
  {
    id: 'oxford-heritage',
    name: 'Oxford Heritage',
    nameAr: 'الأكاديمي التراثي',
    tagline: 'رصانة أكاديمية، خطوط كلاسيكية، ولمسات ذهبية',
    description:
      'أرشيف جامعي فاخر: خطوط سيريفية للعناوين، فواصل ذهبية رقيقة، وخلفية ورقية دافئة. يوحي بالمصداقية العلمية والعمق المعرفي.',
    traits: ['سيريف كلاسيكي', 'فاصل ذهبي', 'ورق دافئ', 'تباين رصين', 'ظل خفيف'],
    generation: 1,
    texture: 'gilded',
    motion: 'smooth',
    signature: ['#1E3A8A', '#D97706', '#FDFBF7', '#0A192F', '#E2D9C8'],
    gradient: 'linear-gradient(135deg, #FDFBF7 0%, #E2D9C8 60%, #1E3A8A 100%)',
  },
];

export const ARCHETYPE_MAP: Record<DesignArchetype, ArchetypeMeta> = ARCHETYPES.reduce(
  (acc, meta) => ({ ...acc, [meta.id]: meta }),
  {} as Record<DesignArchetype, ArchetypeMeta>
);

export function getArchetypeMeta(id: string | undefined): ArchetypeMeta {
  if (id && id in ARCHETYPE_MAP) {
    return ARCHETYPE_MAP[id as DesignArchetype];
  }
  return ARCHETYPE_MAP['neo-brutalism'];
}

/** The brand-new fourth design language, surfaced by the Design Lab. */
export const FLAGSHIP_ARCHETYPE: DesignArchetype = 'liquid-aurora';

export const DESIGN_GENERATIONS: {
  generation: 1 | 2 | 3 | 4;
  label: string;
  labelAr: string;
  archetypes: DesignArchetype[];
}[] = [
  {
    generation: 1,
    label: 'Editorial & Heritage',
    labelAr: 'التحريري والتراثي',
    archetypes: ['swiss', 'oxford-heritage'],
  },
  {
    generation: 2,
    label: 'Pop & Organic',
    labelAr: 'البوب والعضوي',
    archetypes: ['neo-brutalism', 'organic-terracotta'],
  },
  {
    generation: 3,
    label: 'Cyber & Terminal',
    labelAr: 'السيبراني والطرفية',
    archetypes: ['cyber-terminal'],
  },
  {
    generation: 4,
    label: 'Aurora Liquid Glass',
    labelAr: 'الزجاج السائل الشفقّي',
    archetypes: ['liquid-aurora'],
  },
];

/** Texture opacity used by the CSS layer (data-texture attribute). */
export const TEXTURE_INTENSITY: Record<ArchetypeTexture, number> = {
  grid: 0.06,
  halftone: 0.07,
  grain: 0.05,
  scanlines: 0.08,
  gilded: 0.04,
  aurora: 0.5,
};
