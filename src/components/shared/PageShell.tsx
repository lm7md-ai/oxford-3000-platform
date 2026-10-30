'use client';

import * as React from 'react';
import { Header } from '@/components/shared/Header';
import { AmbientBackdrop } from '@/components/shared/AmbientBackdrop';
import { BackToTop } from '@/components/shared/ScrollProgress';
import { WorkspaceShell } from '@/components/layouts/WorkspaceShell';
import { ShowcaseShell } from '@/components/layouts/ShowcaseShell';
import { useStore } from '@/lib/store';
import { getLayoutMeta } from '@/lib/layouts';
import { cn } from '@/lib/utils';

interface PageShellProps {
  currentPath: string;
  children: React.ReactNode;
  className?: string;
  /** Wider layout for dashboards / galleries */
  wide?: boolean;
}

/**
 * The frame decides *which site you are on*: the editorial masthead, the
 * workspace rail, or the showcase pill. Content is identical — structure is not.
 */
export function PageShell({ currentPath, children, className, wide = false }: PageShellProps) {
  const layoutId = useStore((state) => state.layoutId);
  const layout = getLayoutMeta(layoutId);

  const content = (
    <div className={cn(wide ? 'space-y-7 sm:space-y-8' : 'space-y-7 sm:space-y-8', className)}>
      {children}
    </div>
  );

  if (layout.id === 'workspace') {
    return <WorkspaceShell currentPath={currentPath}>{content}</WorkspaceShell>;
  }

  if (layout.id === 'showcase') {
    return <ShowcaseShell currentPath={currentPath}>{content}</ShowcaseShell>;
  }

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
          wide ? 'container max-w-[1560px]' : 'container'
        )}
      >
        {content}
      </main>

      <BackToTop />
    </div>
  );
}
