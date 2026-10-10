import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-[#283044] text-[#eef0ff] px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 text-xs font-bold font-inter">
        <span
          className="material-symbols-outlined text-[#acf847] text-[18px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          verified
        </span>
        <span>{message}</span>
      </div>
    </div>
  );
};
