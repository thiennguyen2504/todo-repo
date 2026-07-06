import React, { useEffect } from 'react';
import { IconX } from './Icons';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  isLoading = false,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-overlay"
      onClick={() => { if (!isLoading) onCancel(); }}
    >
      <div
        className="bg-white rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] w-full max-w-md mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
          <h3 className="text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors disabled:opacity-50"
            aria-label="Đóng"
          >
            <IconX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-[var(--color-border)]">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-[var(--radius-button)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-danger)] rounded-[var(--radius-button)] hover:bg-[var(--color-danger-hover)] focus-ring transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Đang xử lý...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
