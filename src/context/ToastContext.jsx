import { createContext, useContext, useState } from 'react';
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  return (
    <ToastContext.Provider value={{
      toasts,
      addToast: (msg, type='info') => {
        const id = Date.now();
        setToasts(p => [...p, {id, msg, type}]);
        setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
      },
      removeToast: (id) => setToasts(p => p.filter(t => t.id !== id))
    }}>
      {children}
    </ToastContext.Provider>
  );
}
export const useToast = () => useContext(ToastContext);