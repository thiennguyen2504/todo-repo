import React from 'react';
import { IconClipboard, IconPlus } from './Icons';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] animate-fade-in">
      {/* SVG accent illustration */}
      <div className="mb-5 text-[var(--color-text-muted)] opacity-40">
        <IconClipboard size={52} />
      </div>

      <h3 className="text-base font-semibold text-[var(--color-text-primary)] mb-1.5">
        {title}
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-6 max-w-xs leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-button)] focus-ring transition-colors"
        >
          <IconPlus size={15} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
