import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastProps extends ToastMessage {
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, type, title, description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-600" id="toast-success-icon" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" id="toast-warning-icon" />,
    error: <XCircle className="h-5 w-5 text-rose-600" id="toast-error-icon" />,
    info: <Info className="h-5 w-5 text-[#1A56A0]" id="toast-info-icon" />,
  };

  const borderColors = {
    success: 'border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-200',
    warning: 'border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200',
    error: 'border-rose-500/30 bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200',
    info: 'border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200',
  };

  return (
    <div
      id={`toast-${id}`}
      className={`flex items-start gap-3 w-full max-w-sm p-4 rounded-xl border shadow-lg transition-all duration-300 animate-slide-in ${borderColors[type]}`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
      <div className="flex-grow min-w-0">
        <h4 className="text-sm font-semibold tracking-wide" id={`toast-title-${id}`}>{title}</h4>
        {description && (
          <p className="mt-1 text-xs opacity-90 leading-relaxed" id={`toast-desc-${id}`}>
            {description}
          </p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-0.5 rounded-lg"
        id={`toast-close-${id}`}
        aria-label="Close toast"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  return (
    <div
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} onClose={onClose} />
        </div>
      ))}
    </div>
  );
};
