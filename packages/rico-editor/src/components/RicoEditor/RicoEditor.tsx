import React, { useState, useEffect, useRef } from 'react'
import { RicoEditorProps, RicoEditorState } from './types'
import { Toolbar } from '../Toolbar'
import { LinearEditor } from '../LinearEditor'
import { BlockEditor } from '../BlockEditor'
import { FirebaseService, DocumentService } from '../../services/firebase'
import { useAutoSave } from '../../hooks/useAutoSave'

export function RicoEditor({
  user,
  file,
  initialContent,
  mode = 'linear',
  theme = 'light',
  className,
  onSave,
  onModeChange
}: RicoEditorProps) {
  const [state, setState] = useState<RicoEditorState>({
    isLoading: !initialContent, // Only show loading if no initial content
    mode,
    content: initialContent || null,
    documentTitle: initialContent?.title || 'Untitled Document',
    lastSaved: null,
    isDirty: false
  })

  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [document, setDocument] = useState<any>(null)
  const [currentFile, setCurrentFile] = useState(file)

  // Use refs to prevent recreation of services
  const firebaseServiceRef = useRef<FirebaseService | undefined>(undefined)
  const documentServiceRef = useRef<DocumentService | undefined>(undefined)

  // Initialize services once
  useEffect(() => {
    if (!firebaseServiceRef.current) {
      firebaseServiceRef.current = new FirebaseService()
      firebaseServiceRef.current.initialize()
      documentServiceRef.current = new DocumentService(firebaseServiceRef.current)
    }
  }, [])

  // Handle file prop changes (for navigation)
  useEffect(() => {
    if (file !== currentFile) {
      console.log('File changed from', currentFile, 'to', file)
      setCurrentFile(file)
      setDocument(null) // Reset document state
      setState(prev => ({ ...prev, isLoading: true })) // Reset loading state
    }
  }, [file, currentFile])

  // Handle initialContent changes (for navigation)
  useEffect(() => {
    if (initialContent && initialContent !== state.content) {
      console.log('Initial content changed, updating state')
      setState(prev => ({
        ...prev,
        content: initialContent,
        documentTitle: initialContent.title || `Document ${currentFile}`
      }))
    }
  }, [initialContent, currentFile])

  // Check Firebase ready status
  useEffect(() => {
    const checkFirebase = () => {
      if (firebaseServiceRef.current) {
        const ready = firebaseServiceRef.current.isReady()
        console.log('Firebase check - ready:', ready)
        
        setIsFirebaseReady(ready)
        if (!ready) {
          // Retry after 2 seconds if not ready
          setTimeout(checkFirebase, 2000)
        }
      }
    }
    
    // Start checking after a short delay
    const timer = setTimeout(checkFirebase, 1000)
    
    // Fallback after 10 seconds
    const fallbackTimer = setTimeout(() => {
      console.warn('Firebase not ready after 10 seconds, proceeding in offline mode')
      setIsFirebaseReady(false)
    }, 10000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(fallbackTimer)
    }
  }, [])

  // Handle document loading/creation
  useEffect(() => {
    if (!documentServiceRef.current) {
      console.log('Document service not initialized, using initial content')
      setState(prev => ({
        ...prev,
        isLoading: false,
        content: initialContent || { type: 'doc', content: [] },
        documentTitle: initialContent?.title || `Document ${currentFile}`
      }))
      return
    }

    // Load or create document
    const loadOrCreateDocument = async () => {
      try {
        // Only show loading if we don't have initial content
        if (!initialContent) {
          setState(prev => ({ ...prev, isLoading: true }))
        }
        
        // Try to load existing document
        const existingDoc = await documentServiceRef.current!.loadDocument(currentFile)
        
        if (existingDoc) {
          // Document exists, load it
          setDocument(existingDoc)
          setState(prev => ({
            ...prev,
            isLoading: false,
            content: existingDoc.content,
            documentTitle: existingDoc.title,
            lastSaved: new Date(existingDoc.updatedAt)
          }))
        } else {
          // Document doesn't exist, create it
          const documentTitle = initialContent?.title || `Document ${currentFile}`
          const newDoc = await documentServiceRef.current!.createDocument({
            title: documentTitle,
            content: initialContent || { type: 'doc', content: [] },
            userId: user,
            docId: currentFile
          })
          
          setDocument(newDoc)
          setState(prev => ({
            ...prev,
            isLoading: false,
            content: newDoc.content,
            documentTitle: newDoc.title,
            lastSaved: new Date(newDoc.createdAt)
          }))
        }
      } catch (error) {
        console.error('Document loading/creation failed:', error)
        // Even if Firebase fails, proceed with initial content
        setState(prev => ({
          ...prev,
          isLoading: false,
          content: initialContent || { type: 'doc', content: [] },
          documentTitle: initialContent?.title || `Document ${currentFile}`
        }))
      }
    }

    loadOrCreateDocument()
  }, [isFirebaseReady, currentFile, user, initialContent])

  // Auto-save functionality (internal)
  useAutoSave(state.content, (content) => {
    if (isFirebaseReady && document && documentServiceRef.current) {
      documentServiceRef.current.autoSaveDocument(currentFile, content).catch(error => {
        console.error('Auto-save failed:', error)
      })
      setState(prev => ({ 
        ...prev, 
        lastSaved: new Date(),
        isDirty: false 
      }))
    }
  }, 3000) // Every 3 seconds

  const handleModeToggle = (newMode: 'linear' | 'block') => {
    setState(prev => ({ ...prev, mode: newMode }))
    onModeChange?.(newMode)
  }

  const handleContentChange = (content: any) => {
    setState(prev => ({ 
      ...prev, 
      content, 
      isDirty: true 
    }))
  }

  const handleSave = async (content: any) => {
    try {
      if (isFirebaseReady && document && documentServiceRef.current) {
        await documentServiceRef.current.saveDocument(currentFile, content, state.documentTitle)
        setState(prev => ({ 
          ...prev, 
          lastSaved: new Date(), 
          isDirty: false 
        }))
      }
      
      // Call external onSave callback
      onSave?.(content)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  if (state.isLoading) {
    return (
      <div className={`rico-editor-loading ${className || ''}`}>
        <div 
          className="flex items-center justify-center h-64"
          style={{ 
            backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa' 
          }}
        >
          <div className="text-center">
            <div 
              className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-4"
              style={{ 
                borderColor: theme === 'dark' ? '#6b7280' : '#5f6368' 
              }}
            />
            <p style={{ 
              color: theme === 'dark' ? '#9ca3af' : '#5f6368' 
            }}>
              Loading Rico Editor...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`rico-editor h-full flex flex-col ${theme} ${className || ''}`}
      style={{ 
        backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff' 
      }}
    >
      <Toolbar 
        mode={state.mode}
        onModeChange={handleModeToggle}
        theme={theme}
        onSave={() => handleSave(state.content)}
        lastSaved={state.lastSaved}
        isDirty={state.isDirty}
      />
      
      {state.mode === 'linear' ? (
        <LinearEditor 
          content={state.content}
          onChange={handleContentChange}
        />
      ) : (
        <BlockEditor 
          blocks={state.content}
          onChange={handleContentChange}
        />
      )}
    </div>
  )
} 