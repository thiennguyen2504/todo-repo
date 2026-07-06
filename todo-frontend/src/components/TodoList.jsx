import React from 'react';
import TodoItem from './TodoItem';
import Skeleton from './ui/Skeleton';
import EmptyState from './ui/EmptyState';

export default function TodoList({
  todos,
  isListLoading,
  filter,
  onToggle,
  onEdit,
  onDelete,
  togglingId,
  deletingId,
  onChangeFilter, // optional if needed for reset
  onAddClick      // optional if needed to add new
}) {
  const hasActiveFilter = filter.search || filter.status;

  if (isListLoading && todos.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (todos.length === 0) {
    if (hasActiveFilter) {
      return (
        <EmptyState
          title="Không tìm thấy công việc phù hợp"
          description="Vui lòng thử điều kiện tìm kiếm/lọc khác."
          actionLabel="Xóa bộ lọc"
          onAction={() => onChangeFilter({ search: '', status: '' })}
        />
      );
    } else {
      return (
        <EmptyState
          title="Chưa có công việc nào"
          description="Bạn chưa có công việc nào cần làm. Hãy thêm công việc mới nhé."
          actionLabel="Thêm công việc"
          onAction={onAddClick}
        />
      );
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 relative">
      {isListLoading && (
        <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="divide-y divide-gray-100">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
            isToggling={togglingId === todo.id}
            isDeleting={deletingId === todo.id}
          />
        ))}
      </div>
    </div>
  );
}
