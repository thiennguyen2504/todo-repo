import React, { useState } from 'react';
import ConfirmDialog from './ui/ConfirmDialog';

export default function TodoItem({ todo, onToggle, onEdit, onDelete, isToggling, isDeleting }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const isCompleted = todo.status === 'COMPLETED';

  const handleDeleteConfirm = () => {
    onDelete(todo.id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <div className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
        
        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(todo.id)}
            disabled={isToggling}
            className="mt-1 sm:mt-0 w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:cursor-wait shrink-0"
          />
          
          <div className="flex-1 min-w-0">
            <h4 className={`text-base font-medium truncate ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {todo.title}
            </h4>
            {todo.description && (
              <p className={`text-sm mt-1 sm:mt-0.5 whitespace-pre-wrap sm:truncate ${isCompleted ? 'text-gray-400' : 'text-gray-500'}`}>
                {todo.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 shrink-0 mt-2 sm:mt-0 sm:ml-4 border-t sm:border-t-0 border-gray-100 pt-2 sm:pt-0">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none flex items-center gap-1 text-sm sm:text-base"
            title="Chỉnh sửa"
          >
            ✏️ <span className="sm:hidden font-medium">Sửa</span>
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none flex items-center gap-1 text-sm sm:text-base"
            title="Xóa"
          >
            🗑️ <span className="sm:hidden font-medium">Xóa</span>
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
