import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const icons = {
  success: <CheckCircle size={16} className="text-green-500" />,
  error:   <XCircle size={16} className="text-red-500" />,
  warning: <AlertCircle size={16} className="text-brand-500" />,
};

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] bg-white border border-slate-200 shadow-lg rounded-lg px-4 py-3 flex items-center gap-3 fade-in min-w-[280px]">
      {icons[type]}
      <span className="text-sm text-slate-800 flex-1">{message}</span>
      <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>
    </div>
  );
};

interface ToastState { message: string; type: ToastType; id: number; }
let toastCallback: ((t: ToastState) => void) | null = null;

export const showToast = (message: string, type: ToastType = 'success') => {
  if (toastCallback) toastCallback({ message, type, id: Date.now() });
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);
  useEffect(() => {
    toastCallback = (t) => setToasts(prev => [...prev, t]);
    return () => { toastCallback = null; };
  }, []);
  return (
    <>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => setToasts(p => p.filter(x => x.id !== t.id))} />
      ))}
    </>
  );
};
