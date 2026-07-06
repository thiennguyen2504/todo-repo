import React, { useState } from 'react';
import useTodos from '../hooks/useTodos';
import SearchFilterBar from '../components/SearchFilterBar';
import TodoList from '../components/TodoList';
import Pagination from '../components/Pagination';
import TodoForm from '../components/TodoForm';

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

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [formFieldErrors, setFormFieldErrors] = useState({});

  const handleOpenAddForm = () => {
    setEditingTodo(null);
    setFormFieldErrors({});
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (todo) => {
    setEditingTodo(todo);
    setFormFieldErrors({});
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
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

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý công việc</h1>
          <p className="text-gray-500 text-sm mt-1">Sắp xếp và theo dõi công việc của bạn</p>
        </div>
        <button
          onClick={handleOpenAddForm}
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors w-full sm:w-auto shadow-sm flex justify-center items-center gap-2"
        >
          <span>+</span> Thêm công việc
        </button>
      </div>

      <SearchFilterBar filter={filter} onChangeFilter={changeFilter} />

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

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm sm:p-0">
          <div className="w-full max-w-lg bg-white rounded-lg shadow-xl" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {editingTodo ? 'Cập nhật công việc' : 'Thêm công việc mới'}
              </h2>
              <button 
                onClick={handleCloseForm} 
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                ✕
              </button>
            </div>
            <div className="p-0 border-t-0">
              <TodoForm
                initialData={editingTodo}
                onSubmit={handleSubmitForm}
                onCancel={handleCloseForm}
                isSubmitting={isSubmittingForm}
                fieldErrors={formFieldErrors}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
