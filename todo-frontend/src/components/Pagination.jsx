import React from 'react';
import { IconChevronLeft, IconChevronRight } from './ui/Icons';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-[var(--radius-button)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <IconChevronLeft size={14} />
        Trước
      </button>
      <span className="text-sm text-[var(--color-text-muted)]">
        Trang <span className="font-medium text-[var(--color-text-primary)]">{page + 1}</span> / <span className="font-medium text-[var(--color-text-primary)]">{totalPages}</span>
      </span>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages - 1}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-[var(--radius-button)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Sau
        <IconChevronRight size={14} />
      </button>
    </div>
  );
}
