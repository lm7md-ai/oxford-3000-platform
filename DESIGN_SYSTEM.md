# Oxford 3000 — Design System v3

> نظام تصميم متكامل يقود **6 لغات تصميم** فوق **4 أجيال**، مبنية كلها على رموز
> (tokens) واحدة، مع مكتبة حركة موحدة وقوائم تنقل متقدمة.

---

## 1. الأجيال ولغات التصميم

| الجيل | لغة التصميم | المعرّف (`data-archetype`) | الهوية البصرية |
| :---: | :--- | :--- | :--- |
| G1 | السويسري التحريري | `swiss` | زوايا 0px، خطوط شعرية، شبكة خلفية، تباعد دقيق |
| G1 | الأكاديمي التراثي | `oxford-heritage` | حافة ذهبية يسارية، ورق دافئ، سيريف كلاسيكي |
| G2 | الوحشية الجديدة | `neo-brutalism` | حدود 2px، ظل صلب مائل، نصف ظلال (halftone) |
| G2 | العضوي الفخاري | `organic-terracotta` | انحناء 1.5rem، ظل منتشر ملوّن، حبيبات ورقية |
| G3 | الطرفية السيبرانية | `cyber-terminal` | خطوط مسح، أقواس HUD، وهج نيون |
| **G4** | **الزجاج السائل الشفقّي** | **`liquid-aurora`** | **زجاج ضبابي، هالات شفقية متحركة، انكسار لوني، عمق مضيء** |

الجيل الرابع (`liquid-aurora`) هو التصميم العصري الجديد: طبقات ضوء حيّة خلف
المحتوى (`AmbientBackdrop`)، بطاقات زجاجية بحافة داخلية مضيئة، أزرار حبوب
(pills) بلمعة عابرة، وحلقة انكسار لوني تدور ببطء داخل كل بطاقة.

### نماذج الجيل الرابع الأربعة

| النموذج | الطابع |
| :--- | :--- |
| `aurora-liquid-glass` | شفق بنفسجي/سماوي على خلفية ليلية — الافتراضي للجيل |
| `prism-chrome` | كروم لامع وأضلاع موشورية في إضاءة استوديو |
| `nocturne-aurora` | أزرق محيطي حيوي وشرائط بنفسجية عميقة |
| `lumen-horizon` | زجاج دافئ بلون الغروب (برتقالي/وردي) |

**الإجمالي:** 28 نموذجًا موزعة على 6 لغات تصميم.

---

## 2. الرموز (Tokens)

كل الألوان تمر عبر متغيرات CSS مكتوبة كثلاثيات RGB لتوافق شفافية Tailwind:

```css
rgb(var(--background) / <alpha-value>)
```

`ThemeProvider` يحوّل أي لون (`#hex` أو `rgb()`/`rgba()`) إلى ثلاثية، ويمزج
الألوان الشفافة فوق خلفية الصفحة تلقائيًا لضمان التباين.

| المجموعة | المتغيرات |
| :--- | :--- |
| الألوان | `--background`, `--surface`, `--foreground`, `--primary`, `--accent`, `--muted`, `--muted-foreground`, `--border`, `--ring` |
| العمق | `--card-shadow`, `--card-shadow-hover`, `--shadow-color`, `--card-border-width` |
| الشكل | `--radius`, `--font-heading`, `--font-body` |
| الحركة | `--ease-out-expo`, `--ease-spring`, `--ease-in-out-soft`, `--dur-fast/base/slow` |
| الشفق | `--aurora-1..4` |

---

## 3. الطبقات في `src/styles/globals.css`

1. **Tokens + Base** — ألوان، تركيز لوحة المفاتيح (`:focus-visible`)، تحديد النص، تقليل الحركة.
2. **Typography** — `.text-gradient`, `.text-aurora`, `.eyebrow`, `.underline-sweep`.
3. **Surfaces** — `.glass-panel`, `.glass-strong`, `.aurora-field`, `.aurora-grid`, `.gradient-border`, `.noise-overlay`.
4. **Archetype engines** — كل لغة تصميم تعيد تعريف `.archetype-card` / `.archetype-btn` / `.archetype-badge` (الحواف، الظل، الملمس، الحركة).
5. **Navigation** — `.nav-shell`, `.nav-link`, `.nav-active-pill`, `.mega-panel`, `.mega-item`.
6. **Motion library** — 18 keyframe + `.anim-rise`, `.anim-float`, `.stagger`, `.hover-lift`, `.tap-shrink`, `.sheen`.
7. **Primitives** — `.chip`, `.kbd`, `.stat-tile`, `.skeleton`, `.marquee-*`, `.progress-*`, `.ring-progress`.
8. **Bidi** — `.ltr-isolate`, `.rtl-text` (عزل اتجاهي صارم للنص الإنجليزي داخل واجهة عربية).
9. **Utilities** — 3D flip، شبكات خلفية، تقليل التمرير، الطباعة.

> ملاحظة معمارية: قواعد `.archetype-card` الأساسية داخل `@layer components` كي
> تتمكن أدوات Tailwind (`bg-*`, `border-*`, `rounded-*`) من تجاوزها، بينما تبقى
> قواعد كل لغة تصميم خارج الطبقات (أولوية أعلى) لفرض الهوية البصرية.

---

## 4. الحركة

`src/lib/motion.ts` هو المصدر الوحيد لمنحنيات الحركة:

- `EASE_OUT_EXPO`, `EASE_SPRING`, `springSoft`, `springSnappy`
- Variants: `fadeUp`, `scaleIn`, `blurIn`, `menuPanel`, `drawerPanel`, `pageEnter`
- مساعدات: `staggerContainer()`, `staggerItem`

المكوّنات الجاهزة:

| المكوّن | الوظيفة |
| :--- | :--- |
| `<Reveal>` / `<RevealGroup>` / `<RevealItem>` | ظهور عند التمرير وتتابع تلقائي |
| `<AnimatedNumber>` | عدّاد رقمي (rAF) يتوقف عند تفضيل تقليل الحركة |
| `<PageShell>` | إطار الصفحة: خلفية محيطة، هيدر، انتقال دخول، زر عودة للأعلى |
| `<PageHeader>` | بطل صفحة متحرك مع شرائح ومؤشرات |
| `<ScrollProgress>` | شريط تقدّم قراءة أعلى الشاشة |

كل الحركات تحترم `prefers-reduced-motion` **و** مفتاح «تقليل الحركة» في الإعدادات
(الصنف `reduce-motion` على `<html>`).

---

## 5. القوائم والتنقل

- **Mega menu** («استكشف»): ثلاث مجموعات (تعلّم / إبداع / تقدّم) مع أوصاف وأيقونات، ويفتح بالنقر أو التمرير ويُغلق بـ Escape/النقر خارجًا.
- **مؤشر الصفحة النشطة** متحرك عبر `layoutId` (framer-motion).
- **لوحة الأوامر** `⌘K` / `Ctrl+K` / `/`: بحث ثنائي اللغة في الصفحات والمعجم + إجراءات سريعة + تنقل بالأسهم.
- **منتقي التصميم السريع**: اللغات الست + «مفاجئ» + الدخول للاستوديو.
- **درج الجوال**: قائمة كاملة، شريط لغات التصميم، ومفاتيح الوصول (صوت، وضع داكن، تقليل الحركة).
- **شريط تقدّم قراءة** + مؤشر **هدف اليوم** في الهيدر + زر عودة للأعلى.

---

## 6. المتجر (`src/lib/store.ts`)

- حفظ بإصدار (`schemaVersion: 2`) مع دمج آمن للبيانات القديمة/التالفة.
- مزامنة بين تبويبات المتصفح (حدث `storage`).
- ترقية بعد التحميل (`hydrate`) لتجنّب اختلاف SSR/CSR.
- اقتصاد XP: `totalXp`, `xpToday`, `dailyGoalXp`, `currentStreakDays`.
- سلّم رتب من 6 مستويات (`XP_LEVELS` + `getLevelInfo`).
- تفضيلات: صوت، تقليل حركة، وضع مضغوط، سرعة النطق، مفتاح API.
- سجل: آخر 24 كلمة، آخر 10 عمليات بحث.

---

## 7. الصفحات

| المسار | الوصف |
| :--- | :--- |
| `/` | بطل متحرك + كلمة اليوم + إحصاءات + وصول سريع + «استمر من حيث توقفت» + المعجم |
| `/flashcards` | مراجعة متباعدة 3D |
| `/games` | ألعاب ومسابقات |
| `/tutor` | معلم محادثة بالأدوار |
| `/story` | استوديو الجمل والقصص |
| `/analytics` | تحليلات + هدف يومي + سلّم الرتب + نشاط أخير |
| `/design` | **معمل التصميم**: معاينة حيّة للجيل الرابع، 6 لغات، معمل حركة، مفتّش رموز، كتالوج كامل |

---

## 8. إمكانية الوصول

- `skip-link` في كل صفحة، أهداف تركيز مرئية، `aria-pressed` / `aria-expanded` / `aria-current`.
- ملفات `loading.tsx`, `error.tsx`, `not-found.tsx` متسقة التصميم.
- احترام تفضيلات الحركة والوضع الداكن و`color-scheme`.
- نصوص بديلة وأوصاف (`DialogTitle`/`DialogDescription`) في كل الحوارات.
