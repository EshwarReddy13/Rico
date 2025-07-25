import React, { useEffect, useState } from 'react';

export default function LoadingScreen() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const textColor = isDark ? 'text-yellow-300' : 'text-yellow-400';

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-neutral-950 transition-colors">
      <span className={`text-3xl font-bold mb-4 ${textColor}`}>Rico Loading...</span>
      <svg className={`animate-spin h-10 w-10 ${textColor}`} viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>
  );
} 