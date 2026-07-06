import React, { createContext, useState, useContext, useCallback } from 'react';

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

  return (
    <ToastContext.Provider value={{ showToast, removeToast, toasts }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((toast) => {
          let bgColor = 'bg-blue-500';
          if (toast.type === 'success') bgColor = 'bg-green-500';
          else if (toast.type === 'error') bgColor = 'bg-red-500';

          return (
            <div key={toast.id} className={`${bgColor} text-white px-4 py-2 rounded shadow-lg flex items-center justify-between min-w-[250px]`}>
              <span>{toast.message}</span>
              <button 
                onClick={() => removeToast(toast.id)} 
                className="ml-4 font-bold focus:outline-none"
              >
                ✕
              </button>
            </div>
          );
        })}
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
