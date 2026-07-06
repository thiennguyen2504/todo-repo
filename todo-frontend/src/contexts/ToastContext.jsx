import React, { createContext, useState, useContext, useCallback } from 'react';
import { IconX } from '../components/ui/Icons';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(({ type = 'info', message }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2);
    const newToast = { id, type, message };
    
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 3000);
  }, [removeToast]);

  const getToastStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-[var(--color-success)] text-white';
      case 'error':
        return 'bg-[var(--color-danger)] text-white';
      default:
        return 'bg-[var(--color-info)] text-white';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <div className="fixed top-16 right-4 z-[60] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`${getToastStyles(toast.type)} px-4 py-2.5 rounded-[var(--radius-input)] shadow-[var(--shadow-card-hover)] flex items-center justify-between min-w-[260px] animate-slide-up text-sm`}
          >
            <span>{toast.message}</span>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-4 p-0.5 rounded hover:bg-white/20 focus-ring transition-colors"
              aria-label="Đóng thông báo"
            >
              <IconX size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
