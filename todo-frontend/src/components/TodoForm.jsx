import React, { useState, useEffect, useRef } from 'react';

export default function TodoForm({ initialData, onSubmit, onCancel, isSubmitting, fieldErrors }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'PENDING');
  
  const [titleError, setTitleError] = useState('');
  
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setTitleError('Title is required');
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
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    const payload = { title, description };
    if (initialData) {
      payload.status = status;
    }
    onSubmit(payload);
  };

  const backendTitleError = fieldErrors?.title || titleError;
  const backendDescError = fieldErrors?.description;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col">
        <label htmlFor="title" className="text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
        <input
          id="title"
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={handleTitleChange}
          onBlur={handleTitleBlur}
          className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${backendTitleError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Nhập tiêu đề công việc"
        />
        {backendTitleError && <span className="text-red-500 text-xs mt-1">{backendTitleError}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="description" className="text-sm font-medium text-gray-700 mb-1">Mô tả</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${backendDescError ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-blue-200'}`}
          placeholder="Nhập mô tả (không bắt buộc)"
          rows="3"
        />
        {backendDescError && <span className="text-red-500 text-xs mt-1">{backendDescError}</span>}
      </div>

      {initialData && (
        <div className="flex flex-col">
          <label htmlFor="status" className="text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
          >
            <option value="PENDING">Chưa hoàn thành</option>
            <option value="COMPLETED">Đã hoàn thành</option>
          </select>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Hủy
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Thêm mới')}
        </button>
      </div>
    </form>
  );
}
