import React, { useState } from 'react';
import ConfirmDialog from './ui/ConfirmDialog';
import { IconEdit, IconTrash, IconClock } from './ui/Icons';

export default function TodoItem({ todo, onToggle, onEdit, onDelete, isToggling, isDeleting }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isCompleted = todo.status === 'COMPLETED';

  const formattedDate = new Date(todo.createdAt).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div
        className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 transition-colors ${
          isDeleting ? 'opacity-40 pointer-events-none' : 'hover:bg-[var(--color-bg-hover)]'
        }`}
      >
        {/* Checkbox + content */}
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(todo.id)}
            disabled={isToggling}
            aria-label={`Đánh dấu "${todo.title}" là ${isCompleted ? 'chưa hoàn thành' : 'đã hoàn thành'}`}
            className="mt-0.5 sm:mt-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5">
              <h4
                className={`text-sm font-medium truncate transition-colors ${
                  isCompleted
                    ? 'line-through text-[var(--color-text-muted)]'
                    : 'text-[var(--color-text-primary)]'
                }`}
              >
                {todo.title}
              </h4>
              <span
                className={`shrink-0 inline-flex px-2 py-0.5 text-[11px] font-medium rounded-[var(--radius-badge)] leading-tight ${
                  isCompleted
                    ? 'bg-[var(--color-status-completed-bg)] text-[var(--color-status-completed-text)]'
                    : 'bg-[var(--color-status-pending-bg)] text-[var(--color-status-pending-text)]'
                }`}
              >
                {isCompleted ? 'Hoàn thành' : 'Đang chờ'}
              </span>
            </div>
            <div
              className={`flex flex-col sm:flex-row sm:items-center sm:gap-2 text-xs mt-1 transition-colors ${
                isCompleted
                  ? 'text-[var(--color-text-muted)]'
                  : 'text-[var(--color-text-secondary)]'
              }`}
            >
              {todo.description && (
                <p className="truncate mb-1 sm:mb-0 max-w-full">
                  {todo.description}
                </p>
              )}
              {todo.description && <span className="hidden sm:inline opacity-50 shrink-0">•</span>}
              <span className="shrink-0 flex items-center gap-1 opacity-80" title="Ngày tạo">
                <IconClock size={12} />
                {formattedDate}
              </span>
            </div>
          </div>
        </div>

        {/* Actions — visible on hover (desktop) / always visible (mobile) */}
        <div className="flex items-center gap-1 shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ml-8 sm:ml-0">
          <button
            type="button"
            onClick={() => onEdit(todo)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] rounded-lg focus-ring transition-colors"
            title="Chỉnh sửa"
            aria-label={`Chỉnh sửa "${todo.title}"`}
          >
            <IconEdit size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsConfirmOpen(true)}
            className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] rounded-lg focus-ring transition-colors"
            title="Xóa"
            aria-label={`Xóa "${todo.title}"`}
          >
            <IconTrash size={15} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xóa công việc"
        message={`Bạn có chắc chắn muốn xóa công việc "${todo.title}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}
