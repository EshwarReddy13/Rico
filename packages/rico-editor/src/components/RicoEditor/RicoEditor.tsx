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
  onModeChange,
  onClose
}: RicoEditorProps) {
  const linearEditorRef = React.useRef<any>(null)
  const [state, setState] = useState<RicoEditorState>({
    isLoading: !initialContent,
    mode,
    content: initialContent || null,
    documentTitle: initialContent?.title || 'Untitled Document',
    lastSaved: null,
    isDirty: false
  })

  const [document, setDocument] = useState<any>(null)
  const [currentFile, setCurrentFile] = useState(file)
  const [servicesReady, setServicesReady] = useState(false)

  const firebaseServiceRef = useRef<FirebaseService | undefined>(undefined)
  const documentServiceRef = useRef<DocumentService | undefined>(undefined)

  // Initialize services
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return; // Do nothing on the server.
    }

    console.log('🚀 RicoEditor mounted on CLIENT. Setting up services.')

    // Use singleton pattern to prevent multiple Firebase initializations
    if (!(window as any).__firebaseService) {
      firebaseServiceRef.current = new FirebaseService()
      firebaseServiceRef.current.initialize()
      ;(window as any).__firebaseService = firebaseServiceRef.current
    } else {
      firebaseServiceRef.current = (window as any).__firebaseService
    }

    if (!(window as any).__documentService) {
      if (firebaseServiceRef.current) {
        documentServiceRef.current = new DocumentService(firebaseServiceRef.current)
        ;(window as any).__documentService = documentServiceRef.current
      }
    } else {
      documentServiceRef.current = (window as any).__documentService
    }

    setServicesReady(true)
  }, [])

  // Handle document loading/creation
  useEffect(() => {
    // Wait for services to be initialized
    if (!servicesReady || !documentServiceRef.current) {
      console.log('Document service not ready, waiting...')
      return
    }

    const loadOrCreateDocument = async () => {
      try {
        if (!initialContent) {
          setState(prev => ({ ...prev, isLoading: true }))
        }
        
        const existingDoc = await documentServiceRef.current!.loadDocument(currentFile)
        
        if (existingDoc) {
          setDocument(existingDoc)
          setState(prev => ({
            ...prev,
            isLoading: false,
            content: existingDoc.content,
            documentTitle: existingDoc.title,
            lastSaved: new Date(existingDoc.updatedAt)
          }))
        } else {
          const documentTitle = initialContent?.title || `Document ${currentFile}`
          
          // Ensure we have proper content structure, not just a title object
          let properContent = initialContent
          if (initialContent && typeof initialContent === 'object' && initialContent.title && !initialContent.type) {
            // If we only have a title object, create proper document structure
            properContent = {
              type: 'doc',
              content: [
                {
                  type: 'page',
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'Start writing your document...' }]
                    }
                  ]
                }
              ]
            }
          } else if (!initialContent) {
            properContent = { type: 'doc', content: [] }
          }
          
          const newDoc = await documentServiceRef.current!.createDocument({
            title: documentTitle,
            content: properContent,
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
        setState(prev => ({
          ...prev,
          isLoading: false,
          content: initialContent || { type: 'doc', content: [] },
          documentTitle: initialContent?.title || `Document ${currentFile}`
        }))
      }
    }

    loadOrCreateDocument()
  }, [currentFile, user, initialContent, servicesReady]) // Use servicesReady instead of ref

  
  // Handle file prop changes (for navigation within the app)
  useEffect(() => {
    if (file !== currentFile) {
      console.log('File prop changed from', currentFile, 'to', file, 'Resetting component state.')
      setCurrentFile(file)
      setDocument(null)
      setState({
        isLoading: !initialContent,
        mode,
        content: initialContent || null,
        documentTitle: initialContent?.title || 'Untitled Document',
        lastSaved: null,
        isDirty: false
      })
    }
  }, [file, initialContent, mode])

  // Auto-save functionality
  useAutoSave(state.content, (content) => {
    if (documentServiceRef.current && document) {
      documentServiceRef.current.autoSaveDocument(currentFile, content).catch(error => {
        console.error('Auto-save failed:', error)
      })
      setState(prev => ({ 
        ...prev, 
        lastSaved: new Date(),
        isDirty: false 
      }))
    }
  }, 5000)

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

  const handleTitleChange = (title: string) => {
    setState(prev => ({ 
      ...prev, 
      documentTitle: title, 
      isDirty: true 
    }))
  }

  const handleSave = async (content: any) => {
    try {
      if (documentServiceRef.current && document) {
        await documentServiceRef.current.saveDocument(currentFile, content, state.documentTitle)
        setState(prev => ({ 
          ...prev, 
          lastSaved: new Date(), 
          isDirty: false 
        }))
      }
      onSave?.(content)
    } catch (error) {
      console.error('Manual save failed:', error)
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
      className={`rico-editor min-h-screen h-full w-full flex flex-col ${theme} ${className || ''}`}
      style={{ 
        backgroundColor: theme === 'dark' ? '#1f2937' : '#f8f9fa',
        backgroundImage: theme === 'dark' 
          ? `linear-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px),
             linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)`
          : `linear-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0, 0, 0, 0.08) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        backgroundRepeat: 'repeat'
      }}
    >
      <Toolbar 
          mode={state.mode}
          onModeChange={handleModeToggle}
          theme={theme}
          onSave={() => handleSave(state.content)}
          onClose={async () => {
            onClose?.(); 
          }}
          lastSaved={state.lastSaved}
          isDirty={state.isDirty}
          editor={linearEditorRef.current?.editor}
          title={state.documentTitle}
          onTitleChange={handleTitleChange}
        />
      
      <div className="flex-1 flex justify-center overflow-auto">
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg min-h-full">
            {state.mode === 'linear' ? (
              <LinearEditor 
                ref={linearEditorRef}
                content={state.content}
                onChange={handleContentChange}
                theme={theme}
              />
            ) : (
              <BlockEditor 
                blocks={state.content}
                onChange={handleContentChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 