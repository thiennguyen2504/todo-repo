import React from 'react';
import { IconSearch, IconPlus } from './ui/Icons';

export default function SearchFilterBar({ filter, onChangeFilter, onAddClick }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-5">
      {/* Search input */}
      <div className="relative flex-1">
        <IconSearch
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
        />
        <input
          type="text"
          placeholder="Tìm kiếm công việc..."
          value={filter.search}
          onChange={(e) => onChangeFilter({ search: e.target.value })}
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[var(--color-border)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-placeholder)] focus-ring transition-colors"
          aria-label="Tìm kiếm công việc"
        />
      </div>

      {/* Filters row */}
      <div className="flex gap-3 w-full sm:w-auto">
        {/* Status filter */}
        <select
          value={filter.status}
          onChange={(e) => onChangeFilter({ status: e.target.value })}
          className="flex-1 sm:flex-none sm:w-[160px] px-3.5 py-2.5 text-sm bg-white border border-[var(--color-border)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] focus-ring cursor-pointer transition-colors"
          aria-label="Lọc theo trạng thái"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="PENDING">Chưa hoàn thành</option>
          <option value="COMPLETED">Đã hoàn thành</option>
        </select>

        {/* Sort filter */}
        <select
          value={`${filter.sortBy}-${filter.sortDir}`}
          onChange={(e) => {
            const [sortBy, sortDir] = e.target.value.split('-');
            onChangeFilter({ sortBy, sortDir });
          }}
          className="flex-1 sm:flex-none sm:w-[150px] px-3.5 py-2.5 text-sm bg-white border border-[var(--color-border)] rounded-[var(--radius-input)] text-[var(--color-text-primary)] focus-ring cursor-pointer transition-colors"
          aria-label="Sắp xếp"
        >
          <option value="createdAt-desc">Mới nhất</option>
          <option value="createdAt-asc">Cũ nhất</option>
          <option value="title-asc">Theo tên (A-Z)</option>
          <option value="title-desc">Theo tên (Z-A)</option>
        </select>

        {/* Add button — mobile only (desktop form is always visible) */}
        <button
          type="button"
          onClick={onAddClick}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--color-accent)] hover:bg-[var(--color-accent-hover)] rounded-[var(--radius-button)] focus-ring transition-colors whitespace-nowrap shrink-0"
        >
          <IconPlus size={16} />
          <span className="hidden sm:inline">Thêm</span>
        </button>
      </div>
    </div>
  );
}
