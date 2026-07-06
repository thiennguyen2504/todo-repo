import React from 'react';
import { IconCheckSquare, IconUser } from './ui/Icons';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-[var(--color-border)] sticky top-0 z-40">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo / Product name */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[var(--color-accent)] rounded-[var(--radius-badge)] flex items-center justify-center">
              <IconCheckSquare size={18} className="text-white" />
            </div>
            <span className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight">
              TaskFlow
            </span>
          </div>

          {/* User avatar placeholder */}
          <button
            type="button"
            className="w-9 h-9 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] flex items-center justify-center focus-ring transition-colors hover:bg-[var(--color-accent)] hover:text-white"
            aria-label="Menu người dùng"
          >
            <IconUser size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}
