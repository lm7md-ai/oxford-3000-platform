'use client';

import * as React from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

/**
 * Route-level error boundary. Keeps the design language intact and offers a
 * recovery path instead of a blank screen.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Surface the error in the console for debugging without crashing the UI
    console.error('Oxford 3000 runtime error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="archetype-card w-full max-w-md space-y-4 p-8 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-amber-500/15 text-amber-500">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <h1 className="font-heading text-xl font-black">حدث خطأ غير متوقع</h1>
        <p className="text-sm text-muted-foreground">
          تعذّر تحميل هذا الجزء من المنصة. يمكنك إعادة المحاولة، أو العودة إلى شبكة المفردات.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={reset}
            className="archetype-btn inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black text-primary-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            إعادة المحاولة
          </button>
          <a
            href="/"
            className="archetype-btn inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2 text-xs font-black"
          >
            <Home className="h-3.5 w-3.5 text-primary" />
            الصفحة الرئيسية
          </a>
        </div>
        {error.digest && (
          <p className="font-mono text-[10px] text-muted-foreground">digest: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
