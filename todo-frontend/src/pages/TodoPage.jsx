import React, { useState } from 'react';
import useTodos from '../hooks/useTodos';
import SearchFilterBar from '../components/SearchFilterBar';
import TodoList from '../components/TodoList';
import Pagination from '../components/Pagination';
import TodoForm from '../components/TodoForm';
import { IconX } from '../components/ui/Icons';

export default function TodoPage() {
  const {
    todos,
    pagination,
    filter,
    isListLoading,
    togglingId,
    deletingId,
    changeFilter,
    changePage,
    addTodo,
    editTodo,
    removeTodo,
    toggleStatus
  } = useTodos();

  // Desktop: form is always visible in the right column
  // Mobile: form opens as a modal
  const [isMobileFormOpen, setIsMobileFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formFieldErrors, setFormFieldErrors] = useState({});

  const handleOpenAddForm = () => {
    setEditingTodo(null);
    setFormFieldErrors({});
    setIsMobileFormOpen(true);
  };

  const handleOpenEditForm = (todo) => {
    setEditingTodo(todo);
    setFormFieldErrors({});
    setIsMobileFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsMobileFormOpen(false);
    setEditingTodo(null);
    setFormFieldErrors({});
  };

  const handleSubmitForm = async (payload) => {
    setIsSubmittingForm(true);
    setFormFieldErrors({});
    try {
      if (editingTodo) {
        await editTodo(editingTodo.id, payload);
      } else {
        await addTodo(payload);
      }
      handleCloseForm();
    } catch (err) {
      if (err.fieldErrors) {
        setFormFieldErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  // Reset desktop form after submit (clear editingTodo only on mobile close)
  const handleDesktopSubmit = async (payload) => {
    setIsSubmittingForm(true);
    setFormFieldErrors({});
    try {
      if (editingTodo) {
        await editTodo(editingTodo.id, payload);
        setEditingTodo(null);
      } else {
        await addTodo(payload);
      }
    } catch (err) {
      if (err.fieldErrors) {
        setFormFieldErrors(err.fieldErrors);
      }
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleDesktopCancel = () => {
    setEditingTodo(null);
    setFormFieldErrors({});
  };

  return (
    <main className="flex-1">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">
            Quản lý công việc
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Sắp xếp và theo dõi công việc của bạn
          </p>
        </div>

        {/* Two-column layout: Desktop */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left column — toolbar + task list */}
          <div className="flex-1 min-w-0 w-full">
            <SearchFilterBar
              filter={filter}
              onChangeFilter={changeFilter}
              onAddClick={handleOpenAddForm}
            />

            <TodoList
              todos={todos}
              isListLoading={isListLoading}
              filter={filter}
              onToggle={toggleStatus}
              onEdit={handleOpenEditForm}
              onDelete={removeTodo}
              togglingId={togglingId}
              deletingId={deletingId}
              onChangeFilter={changeFilter}
              onAddClick={handleOpenAddForm}
            />

            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={changePage}
            />
          </div>

          {/* Right column — add/edit form card (desktop only) */}
          <div className="hidden lg:block w-[340px] shrink-0 sticky top-[72px]">
            <TodoForm
              key={editingTodo?.id || 'new'}
              initialData={editingTodo}
              onSubmit={handleDesktopSubmit}
              onCancel={editingTodo ? handleDesktopCancel : undefined}
              isSubmitting={isSubmittingForm}
              fieldErrors={formFieldErrors}
              variant="card"
            />
          </div>
        </div>
      </div>

      {/* Mobile modal form */}
      {isMobileFormOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 animate-overlay lg:hidden"
          onClick={handleCloseForm}
        >
          <div
            className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-[var(--radius-card)] shadow-[var(--shadow-modal)] animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)]">
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                {editingTodo ? 'Cập nhật công việc' : 'Thêm công việc mới'}
              </h2>
              <button
                type="button"
                onClick={handleCloseForm}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] focus-ring transition-colors"
                aria-label="Đóng"
              >
                <IconX size={18} />
              </button>
            </div>
            <div className="p-0">
              <TodoForm
                initialData={editingTodo}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseForm}
                isSubmitting={isSubmittingForm}
                fieldErrors={formFieldErrors}
                variant="modal"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
