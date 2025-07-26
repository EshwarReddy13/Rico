'use client'

import { RicoEditor } from '@rico/editor'
import { useEffect, useState } from 'react'
import { useAuth } from '../../../contexts/auth-context'
import { useParams, useSearchParams, useRouter } from 'next/navigation'

export default function DynamicDocumentPage() {
  const [isDark, setIsDark] = useState(false)
  const [key, setKey] = useState(0) // Force re-render key
  const { user } = useAuth()
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const docId = params.docId as string
  const title = searchParams.get('title')

  // Listen for route changes and force re-render
  useEffect(() => {
    const handleRouteChange = () => {
      console.log('Route changed, forcing re-render')
      setKey(prev => prev + 1)
    }

    // Force re-render when component mounts or URL changes
    handleRouteChange()

    // Listen for popstate (back/forward button)
    window.addEventListener('popstate', handleRouteChange)
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [docId, title])

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

  const handleSave = (content: any) => {
    console.log('Document saved to user\'s storage:', content)
    // Here the user's app would save the content to their own storage
    // (Google Drive, local database, etc.)
  }

  const handleModeChange = (mode: 'linear' | 'block') => {
    console.log('Mode changed to:', mode)
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Please log in to access the editor</p>
      </div>
    )
  }

  if (!docId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Document ID not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative p-10">
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-yellow-300 mb-2">Document Editor</h1>
          <p className="text-gray-600 dark:text-neutral-200">
            {title ? `Editing: ${title}` : `Editing document: ${docId}`}
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg overflow-hidden">
          <RicoEditor 
            key={`${docId}-${title}-${key}`} // Include key to force re-render
            user={user.email}
            file={docId}
            initialContent={title ? { title } : undefined}
            theme={isDark ? 'dark' : 'light'}
            onSave={handleSave}
            onModeChange={handleModeChange}
          />
        </div>
      </div>
    </div>
  )
} 