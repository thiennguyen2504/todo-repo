import React from 'react';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/Navbar';
import TodoPage from './pages/TodoPage';

function App() {
  return (
    <ToastProvider>
      <Navbar />
      <TodoPage />
    </ToastProvider>
  );
}

export default App;
