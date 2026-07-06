import React from 'react';

export default function SearchFilterBar({ filter, onChangeFilter }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div className="flex-1 w-full">
        <input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={filter.search}
          onChange={(e) => onChangeFilter({ search: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
        <select
          value={filter.status}
          onChange={(e) => onChangeFilter({ status: e.target.value })}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chưa hoàn thành</option>
          <option value="COMPLETED">Đã hoàn thành</option>
        </select>

        <select
          value={`${filter.sortBy}-${filter.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split('-');
            onChangeFilter({ sortBy, sortDir });
          }}
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
        >
          <option value="createdAt-desc">Mới nhất</option>
          <option value="createdAt-asc">Cũ nhất</option>
          <option value="title-asc">Theo tên (A-Z)</option>
          <option value="title-desc">Theo tên (Z-A)</option>
        </select>
      </div>
    </div>
  );
}
