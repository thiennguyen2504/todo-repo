import { useState, useEffect, useCallback } from 'react';
import todoApi from '../api/todoApi';
import { useToast } from '../contexts/ToastContext';
import useDebounce from './useDebounce';

function getInitialState() {
  // Đọc state từ URL query string lúc khởi tạo (load trang)
  const params = new URLSearchParams(window.location.search);
  return {
    page: parseInt(params.get('page') || '0', 10),
    size: parseInt(params.get('size') || '10', 10),
    search: params.get('search') || '',
    status: params.get('status') || '',
    sortBy: params.get('sortBy') || 'createdAt',
    sortDir: params.get('sortDir') || 'desc',
  };
}

export default function useTodos() {
  const { showToast } = useToast();
  
  const initialState = getInitialState();
  
  const [todos, setTodos] = useState([]);
  const [pagination, setPagination] = useState({ page: initialState.page, size: initialState.size, totalElements: 0, totalPages: 0 });
  const [filter, setFilter] = useState({ search: initialState.search, status: initialState.status, sortBy: initialState.sortBy, sortDir: initialState.sortDir });
  
  const [isListLoading, setIsListLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const debouncedSearch = useDebounce(filter.search, 500);

  // Sync state vào URL query string
  // Lựa chọn: Dùng window.history.replaceState thuần để tránh việc phải cài 
  // react-router-dom chỉ cho việc lưu query params đơn giản trên 1 trang duy nhất.
  useEffect(() => {
    const params = new URLSearchParams();
    if (filter.search) params.set('search', filter.search);
    if (filter.status) params.set('status', filter.status);
    if (filter.sortBy !== 'createdAt') params.set('sortBy', filter.sortBy);
    if (filter.sortDir !== 'desc') params.set('sortDir', filter.sortDir);
    if (pagination.page > 0) params.set('page', pagination.page);
    if (pagination.size !== 10) params.set('size', pagination.size);
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [filter, pagination.page, pagination.size]);

  const fetchTodos = useCallback(async () => {
    setIsListLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.page,
        size: pagination.size,
        search: debouncedSearch,
        status: filter.status,
        sortBy: filter.sortBy,
        sortDir: filter.sortDir,
      };
      
      const response = await todoApi.getTodos(params);
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
      showToast({ type: 'success', message: 'Đã thêm công việc' });
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
      showToast({ type: 'success', message: 'Đã cập nhật công việc' });
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
      showToast({ type: 'success', message: 'Đã xóa công việc' });
      
      // Nếu đang ở trang cuối mà xoá hết item thì tự lùi về trang trước
      if (todos.length === 1 && pagination.page > 0) {
        setPagination(prev => ({ ...prev, page: prev.page - 1 }));
      } else {
        fetchTodos();
      }
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
    
    setTodos(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED' } : t
    ));
    setTogglingId(id);

    try {
      await todoApi.toggleTodoStatus(id);
      showToast({ type: 'success', message: `Đã đổi trạng thái công việc` });
    } catch (err) {
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
