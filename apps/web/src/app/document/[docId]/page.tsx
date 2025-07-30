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
    <div className="h-screen w-full">
          <RicoEditor 
            key={`${docId}-${title}-${key}`} // Include key to force re-render
            user={user.email}
            file={docId}
            initialContent={title ? { title } : undefined}
            theme={'light'}
            onSave={handleSave}
            onModeChange={handleModeChange}
          />
    </div>
  )
} 