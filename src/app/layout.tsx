import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Footer } from '@/components/shared/Footer';
import { THEMES } from '@/styles/themes';

const BASE_PATH = process.env.NODE_ENV === 'production' ? '/oxford-3000-platform' : '';

/** theme id → archetype id, generated from the single source of truth */
const THEME_ARCHETYPE_MAP = JSON.stringify(
  Object.fromEntries(THEMES.map((theme) => [theme.id, theme.archetype]))
);

const SITE_TITLE =
  'Oxford 3000™ Master Platform — Complete CEFR A1–B2 Lexicon & AI Tutoring';

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: '%s · Oxford 3000™',
  },
  description:
    'Master the complete Oxford 3000 American English Lexicon with AI Storytelling, Dual Audio TTS Engines, Speech Evaluation, Spaced Repetition SRS and six morphing design languages.',
  applicationName: 'Oxford 3000 Master Platform',
  keywords: [
    'Oxford 3000',
    'CEFR',
    'English vocabulary',
    'Arabic translation',
    'IPA',
    'SRS flashcards',
    'speech evaluation',
    'AI tutor',
    'تعلم الإنجليزية',
    'مفردات أكسفورد',
  ],
  manifest: `${BASE_PATH}/manifest.json`,
  icons: {
    icon: `${BASE_PATH}/icon-192.svg`,
    apple: `${BASE_PATH}/icon-192.svg`,
  },
  appleWebApp: {
    capable: true,
    title: 'Oxford 3000',
    statusBarStyle: 'black-translucent',
  },
  openGraph: {
    title: SITE_TITLE,
    description:
      '3,000+ canonical Oxford 3000 headwords with bilingual search, dual TTS engines, speech scoring, SRS and a full design-language studio.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F2F5FF' },
    { media: '(prefers-color-scheme: dark)', color: '#05070F' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Fraunces:ital,opsz,wght@0,9..144,100..900;1,9..144,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=JetBrains+Mono:wght@300..800&family=Manrope:wght@200..800&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=Outfit:wght@100..900&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&family=Sora:wght@100..800&family=Space+Grotesk:wght@300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-background font-body text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        {/*
          Applies the persisted design language before first paint so returning
          visitors never see a flash of the default palette.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
              var raw=localStorage.getItem('oxford_3000_enterprise_progress');
              if(!raw)return;
              var s=JSON.parse(raw)||{};
              var map=${THEME_ARCHETYPE_MAP};
              var theme=String(s.themeId||'');
              var archetype=map[theme]||theme;
              if(archetype)document.documentElement.setAttribute('data-archetype',archetype);
              if(theme)document.documentElement.setAttribute('data-theme',theme);
              if(s.isDarkMode)document.documentElement.classList.add('dark');
              if(s.reduceMotion)document.documentElement.classList.add('reduce-motion');
            }catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
