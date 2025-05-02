import { ReactNode, useCallback, useState } from "react";
import { Toast, ToastType } from "@/types/toast";

import { ToastContext } from ".";

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 5000);
    },
    [removeToast]
  );

  const toastTypes = {
    info: "alert-info",
    success: "alert-success",
    warning: "alert-warning",
    error: "alert-error",
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <div className="stack fixed bottom-14 right-4 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`alert ${
              toastTypes[toast.type]
            } cursor-pointer shadow-lg`}
            onClick={() => removeToast(toast.id)}
          >
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
