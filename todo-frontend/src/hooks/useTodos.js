import { useState, useEffect, useCallback } from 'react';
import todoApi from '../api/todoApi';
import { useToast } from '../contexts/ToastContext';
import useDebounce from './useDebounce';

export default function useTodos() {
  const { showToast } = useToast();
  
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState({ page: 0, size: 10, totalElements: 0, totalPages: 0 });
  const [filter, setFilter] = useState({ search: '', status: '', sortBy: 'createdAt', sortDir: 'desc' });
  
  const [isListLoading, setIsListLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filter.search, 500);

  const fetchTodos = useCallback(async () => {
    setIsListLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        keyword: debouncedSearch,
        status: filter.status,
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
      };
      
      const response = await todoApi.getTodos(params);
      
      // Expected structure from Spring backend wrapper:
      // { success: true, message: "...", data: { content: [...], page: { number, size, totalElements, totalPages } } }
      // Or simply { content, number, size, totalElements, totalPages } if returning Page directly.
      // Assuming response is the standard Spring Data Page object wrapper inside `data`.
      const resData = response.data || response;
      const pageData = resData.data || resData;
      
      setTodos(pageData.content || []);
      setPagination(prev => ({
        ...prev,
        page: pageData.number ?? prev.page,
        size: pageData.size ?? prev.size,
        totalElements: pageData.totalElements ?? prev.totalElements,
        totalPages: pageData.totalPages ?? prev.totalPages
      }));
    } catch (err) {
      setError(err);
      showToast({ type: 'error', message: err.friendlyMessage });
    } finally {
      setIsListLoading(false);
    }
  }, [debouncedSearch, filter.status, filter.sortBy, filter.sortDir, pagination.page, pagination.size, showToast]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const addTodo = async (payload) => {
    setIsSubmitting(true);
    try {
      await todoApi.createTodo(payload);
      showToast({ type: 'success', message: 'Tạo công việc thành công!' });
      fetchTodos();
    } catch (err) {
      showToast({ type: 'error', message: err.friendlyMessage });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editTodo = async (id, payload) => {
    setIsSubmitting(true);
    try {
      await todoApi.updateTodo(id, payload);
      showToast({ type: 'success', message: 'Cập nhật thành công!' });
      fetchTodos();
    } catch (err) {
      showToast({ type: 'error', message: err.friendlyMessage });
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTodo = async (id) => {
    setDeletingId(id);
    try {
      await todoApi.deleteTodo(id);
      showToast({ type: 'success', message: 'Xoá thành công!' });
      fetchTodos();
    } catch (err) {
      showToast({ type: 'error', message: err.friendlyMessage });
      throw err;
    } finally {
      setDeletingId(null);
    }
  };

  const toggleStatus = async (id) => {
    const todoToToggle = todos.find(t => t.id === id);
    if (!todoToToggle) return;
    
    // optimistic update
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t
    ));
    setTogglingId(id);

    try {
      await todoApi.toggleTodoStatus(id);
    } catch (err) {
      // rollback
      setTodos(prev => prev.map(t => 
        t.id === id ? { ...t, status: todoToToggle.status } : t
      ));
      showToast({ type: 'error', message: err.friendlyMessage });
    } finally {
      setTogglingId(null);
    }
  };

  const changeFilter = (newFilter) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
    // reset to first page when filter changes
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const changePage = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return {
    todos,
    pagination,
    filter,
    isListLoading,
    togglingId,
    deletingId,
    isSubmitting,
    error,
    changeFilter,
    changePage,
    addTodo,
    editTodo,
    removeTodo,
    toggleStatus,
    fetchTodos
  };
}
