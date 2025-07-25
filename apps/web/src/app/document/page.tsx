'use client'

import { RicoEditor } from '@rico/editor'
import { useEffect, useState } from 'react'

export default function DocumentPage() {
  const [isDark, setIsDark] = useState(false)

  function toggleDarkMode() {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark')
      setIsDark(document.documentElement.classList.contains('dark'))
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        document.documentElement.classList.add('dark')
        setIsDark(true)
      }
    }
  }, [])

  return (
    <div className="min-h-screen relative">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-20 rounded-full bg-yellow-400 dark:bg-neutral-800 text-gray-900 dark:text-yellow-300 shadow-lg p-2 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
        aria-label="Toggle dark mode"
        type="button"
      >
        <span className="inline-block align-middle">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" className="fill-yellow-400 dark:fill-neutral-800" />
            <path
              className="stroke-yellow-500 dark:stroke-yellow-300"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
            />
          </svg>
        </span>
      </button>

      <div className="container mx-auto py-8 relative z-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-300 mb-2">Rico Editor Demo</h1>
          <p className="text-gray-600 dark:text-neutral-200">
            Testing the RicoEditor component - exactly how external developers would use it
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
          <RicoEditor 
            user="demo@rico.dev" 
            file="sample-document-123"
            theme={isDark ? 'dark' : 'light'}
          />
        </div>
      </div>
    </div>
  )
} 