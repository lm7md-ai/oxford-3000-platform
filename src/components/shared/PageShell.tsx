'use client';

import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop';
import { BackToTop } from '@/components/shared/ScrollProgress';
import { cn } from '@/lib/utils';

interface PageShellProps {
  currentPath: string;
  children: React.ReactNode;
  className?: string;
  /** Wider layout for dashboards / galleries */
  wide?: boolean;
}

/**
 * Standard workspace frame: ambient atmosphere, animated header, a fluid
 * content column with a page-enter transition, and a back-to-top affordance.
 */
export function PageShell({ currentPath, children, className, wide = false }: PageShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip">
      <AmbientBackdrop />
      <a href="#main-content" className="skip-link no-print">
        تخطَّ إلى المحتوى الرئيسي
      </a>
      <Header currentPath={currentPath} />

      {/* CSS-driven entrance: paints even before hydration completes */}
      <main
        id="main-content"
        className={cn(
          'anim-rise relative z-10 flex-1 py-7 sm:py-9',
          wide ? 'container max-w-[1560px]' : 'container',
          className
        )}
      >
        <div className="space-y-7 sm:space-y-8">{children}</div>
      </main>

      <BackToTop />
    </div>
  );
}
