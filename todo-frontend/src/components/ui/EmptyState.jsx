import React from 'react';

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center bg-gray-50 border border-dashed border-gray-300 rounded-lg my-4">
      <div className="text-4xl mb-4 text-gray-400">📝</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
