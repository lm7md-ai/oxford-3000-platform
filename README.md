# Oxford 3000™ — Master CEFR Lexicon Platform

منصة تفاعلية لإتقان مفردات Oxford 3000 (A1–B2): بحث عربي بدون تشكيل، محركا نطق،
تقييم نطق فوري، قصص ومعلم بالذكاء الاصطناعي، مراجعة متباعدة (SRS)،
وست لغات تصميم كاملة — Next.js 15 + React 19 + Tailwind.

---

## التشغيل السريع

```bash
npm install
npm run dev
```

ثم افتح: **http://localhost:3000**

> إن ظهرت الصفحة بيضاء أو أخطاء `404` على ملفات `_next/static/chunks/*`،
> فالمشكلة ذاكرة بناء قديمة وليست الكود. الحل:
> `rm -rf .next .next-dev` (ويندوز: `rmdir /s /q .next .next-dev`) ثم أعد `npm run dev`.
> تم منع تكرار هذه الحالة نهائيًا بالفصل بين مجلد كاش التطوير `.next-dev`
> ومجلد بناء الإنتاج `.next`.

---

## الأوامر

| الأمر | الوظيفة |
| :--- | :--- |
| `npm run dev` | خادم تطوير على `0.0.0.0:3000` (يدعم المعاينة داخل المتصفح) |
| `npm run build` | بناء وتصدير ثابت إلى `out/` |
| `npm start` | خدمة `out/` محليًا (بديل `next start` غير المدعوم مع `output: 'export'`) |
| `npm run preview` | نفس `npm start` |
| `npm run typecheck` | فحص TypeScript |
| `npm test` | حزمة E2E (67 اختبارًا) |

### التجربة كموقع GitHub Pages محليًا

```bash
# macOS / Linux
NEXT_PUBLIC_BASE_PATH=/oxford-3000-platform npm run build
NEXT_PUBLIC_BASE_PATH=/oxford-3000-platform npm start
```

```powershell
# Windows PowerShell
$env:NEXT_PUBLIC_BASE_PATH="/oxford-3000-platform"; npm run build
$env:NEXT_PUBLIC_BASE_PATH="/oxford-3000-platform"; npm start
```

مجلد النشر على Pages: `https://<user>.github.io/oxford-3000-platform/`
— البناء داخل GitHub Actions يضيف البادئة تلقائيًا (`GITHUB_ACTIONS=true`)،
أما البناء المحلي فيعمل على جذر الدومين (`http://localhost:3000/`) بلا أي إعداد.

الخادم `scripts/serve-static.mjs` يكتشف البادئة تلقائيًا من `out/index.html`،
ويلوّم `/` إلى مسار المشروع عند الحاجة، ويعيد `404.html` لأي مسار غير موجود.

---

## المتطلبات

- Node.js 20 أو أحدث
- متصفح حديث (Web Speech / SpeechRecognition للنطق والتقييم)
- مفتاح Grok (xAI) اختياري لميزات التوليد — يُحفظ محليًا في المتصفح فقط

---

## استكشاف الأخطاء

| العَرَض | السبب | الحل |
| :--- | :--- | :--- |
| صفحة بيضاء وأخطاء 404 لملفات chunks | تشغيل `npm run build` أثناء عمل `npm run dev` (قبل الإصلاح) | `rm -rf .next .next-dev && npm run dev` |
| `next start does not work with "output: export"` | Next.js لا يخدم التصدير الثابت | استخدم `npm start` |
| أصول مفقودة على Pages | بناء بدون بادئة المشروع | ابنِ داخل Actions أو مرّر `NEXT_PUBLIC_BASE_PATH` |
| الصوت لا يعمل | المتصفح يمنع الصوت قبل تفاعل المستخدم، أو لا يوجد voice | اضغط زر النطق بعد أول تفاعل، وجرّب متصفحًا آخر |

---

## البنية

```
src/
  app/                 صفحات App Router + layout + حالات loading/error/404
  components/shared/   الهيدر، القوائم، لوحة الأوامر، الهوية، الحركة
  features/            المعجم، التحليلات، الألعاب، القصص، المعلم، معمل التصميم
  lib/                 المتجر (zustand)، الحركة، التنقل، البحث العربي
  styles/              globals.css + themes.ts + archetypes.ts
scripts/               خادم التصدير الثابت
test/                  حزمة E2E (tier1–tier4)
```

للتفاصيل الكاملة عن نظام التصميم: `DESIGN_SYSTEM.md`.
