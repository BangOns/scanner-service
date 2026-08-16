"use client";

import React, { createContext, useContext, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  text: string;
}

interface ToastContextType {
  showToast: (text: string, type?: "success" | "error" | "info") => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-xl text-sm font-medium border transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-emerald-950/90 text-emerald-100 border-emerald-800/60 shadow-emerald-950/40"
                : toast.type === "error"
                ? "bg-rose-950/90 text-rose-100 border-rose-800/60 shadow-rose-950/40"
                : "bg-slate-900/90 text-slate-100 border-slate-800 shadow-slate-950/40"
            } backdrop-blur-md animate-in fade-in slide-in-from-bottom-2`}
          >
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-sky-400 shrink-0" />}
            <span className="flex-1">{toast.text}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition-opacity p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
