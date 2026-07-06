import React, { useState, useEffect, useRef } from 'react';
import { IconPlus } from './ui/Icons';

export default function TodoForm({ initialData, onSubmit, onCancel, isSubmitting, fieldErrors, variant = 'card' }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'PENDING');
  
  const [titleError, setTitleError] = useState('');
  const [titleTouched, setTitleTouched] = useState(false);
  
  const titleInputRef = useRef(null);

  useEffect(() => {
    // Auto-focus title input only in modal variant (not the persistent card)
    if (variant === 'modal' && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [initialData?.id, variant]);

  // Reset form when initialData changes (e.g. switching from edit to add)
  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setStatus(initialData?.status || 'PENDING');
    setTitleError('');
  }, [initialData?.id, initialData?.title, initialData?.description, initialData?.status]);

  const handleTitleBlur = () => {
    setTitleTouched(true);
    if (!title.trim()) {
      setTitleError('Vui lòng nhập tiêu đề công việc');
    } else {
      setTitleError('');
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    if (e.target.value.trim()) {
      setTitleError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTitleTouched(true);
    if (!title.trim()) {
      setTitleError('Vui lòng nhập tiêu đề công việc');
      return;
    }
    const payload = { title, description };
    if (initialData) {
      payload.status = status;
    }
    onSubmit(payload);

    // If this is a "card" (desktop always-visible) variant for adding, clear the form
    if (variant === 'card' && !initialData) {
      setTitle('');
      setDescription('');
      setTitleError('');
    }
  };

  const displayTitleError = fieldErrors?.title || (titleTouched ? titleError : '');
  const backendDescError = fieldErrors?.description;

  const isCard = variant === 'card';

  return (
    <div className={isCard
      ? 'bg-white border border-[var(--color-border)] rounded-[var(--radius-card)] shadow-[var(--shadow-card)] overflow-hidden animate-fade-in'
      : ''
    }>
      {/* Card header (only for card variant) */}
      {isCard && (
        <div className="px-5 py-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center">
              <IconPlus size={14} className="text-[var(--color-accent)]" />
            </div>
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              {initialData ? 'Cập nhật công việc' : 'Thêm công việc mới'}
            </h2>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        {/* Title field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`title-${variant}`} className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Tiêu đề <span className="text-[var(--color-danger)]">*</span>
          </label>
          <input
            id={`title-${variant}`}
            ref={titleInputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] transition-colors ${
              displayTitleError
                ? 'border-[var(--color-danger)] focus-ring-danger'
                : 'border-[var(--color-border)] focus-ring'
            }`}
            placeholder="Nhập tiêu đề công việc"
          />
          {displayTitleError && (
            <span className="text-xs text-[var(--color-danger)] mt-0.5" role="alert">
              {displayTitleError}
            </span>
          )}
        </div>

        {/* Description field */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`description-${variant}`} className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
            Mô tả
          </label>
          <textarea
            id={`description-${variant}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] resize-none transition-colors ${
              backendDescError
                ? 'border-[var(--color-danger)] focus-ring-danger'
                : 'border-[var(--color-border)] focus-ring'
            }`}
            placeholder="Nhập mô tả công việc"
            rows="3"
          />
          <span className="text-xs text-[var(--color-text-muted)]">
            {backendDescError || '(không bắt buộc)'}
          </span>
        </div>

        {/* Status field — only shown when editing */}
        {initialData && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor={`status-${variant}`} className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
              Trạng thái
            </label>
            <select
              id={`status-${variant}`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-[var(--color-border)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] focus-ring cursor-pointer transition-colors"
            >
              <option value="PENDING">Chưa hoàn thành</option>
              <option value="COMPLETED">Đã hoàn thành</option>
            </select>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] bg-white border border-[var(--color-border)] rounded-[var(--radius-button)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !title.trim()}
            className={`${onCancel ? 'flex-1' : 'w-full'} px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-accent)] rounded-[var(--radius-button)] hover:bg-[var(--color-accent-hover)] focus-ring transition-all disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
          </button>
        </div>
      </form>
    </div>
  );
}
