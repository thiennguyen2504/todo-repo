import React from 'react';

export default function Skeleton() {
  return (
    <div className="flex items-center gap-4 px-4 sm:px-5 py-3.5 border-b border-[var(--color-border)] last:border-b-0">
      {/* Checkbox */}
      <div className="w-5 h-5 skeleton-shimmer rounded-md shrink-0"></div>

      {/* Content */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-3.5 skeleton-shimmer rounded-md w-3/5"></div>
        <div className="h-3 skeleton-shimmer rounded-md w-2/5"></div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-1.5">
        <div className="w-8 h-8 skeleton-shimmer rounded-lg"></div>
        <div className="w-8 h-8 skeleton-shimmer rounded-lg"></div>
      </div>
    </div>
  );
}
