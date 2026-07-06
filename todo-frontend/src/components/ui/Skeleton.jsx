import React from 'react';

export default function Skeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 p-4 border-b border-gray-100 bg-white">
      <div className="w-5 h-5 bg-gray-200 rounded shrink-0"></div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
        <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
