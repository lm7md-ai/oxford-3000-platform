import * as React from 'react';

/**
 * Route-level loading skeleton. Uses the shared shimmer primitive so the
 * placeholder adopts the active design language automatically.
 */
export default function Loading() {
  return (
    <div className="container flex-1 space-y-6 py-10">
      <div className="archetype-card space-y-3 p-6">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton h-8 w-2/3" />
        <div className="skeleton h-3 w-1/2" />
        <div className="grid grid-cols-2 gap-2 pt-2 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="skeleton h-16" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="archetype-card space-y-3 p-5">
            <div className="flex items-center justify-between">
              <div className="skeleton h-5 w-10" />
              <div className="skeleton h-5 w-16" />
            </div>
            <div className="skeleton h-7 w-2/3" />
            <div className="skeleton h-3 w-1/2" />
            <div className="skeleton h-3 w-full" />
            <div className="skeleton h-3 w-4/5" />
            <div className="flex gap-2 pt-1">
              <div className="skeleton h-8 w-20" />
              <div className="skeleton ml-auto h-8 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
