import React from 'react';
import { ToastProvider } from './contexts/ToastContext';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <ToastProvider>
      <TodoPage />
    </ToastProvider>
  );
}

export default App;
