import { useState, useEffect, useCallback } from 'react'
import { Document, CreateDocumentData } from '../services/firebase'

// Generic interface for document services
interface IDocumentService {
  loadDocument(docId: string): Promise<Document | null>
  createDocument(data: CreateDocumentData): Promise<Document>
  saveDocument(docId: string, content: any, title?: string): Promise<void>
  autoSaveDocument(docId: string, content: any): Promise<void>
}

export function useDocument(
  documentService: IDocumentService,
  docId: string | null,
  userId: string
) {
  const [document, setDocument] = useState<Document | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load document
  const loadDocument = useCallback(async (id: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const doc = await documentService.loadDocument(id)
      setDocument(doc)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load document')
    } finally {
      setIsLoading(false)
    }
  }, [documentService])

  // Create new document
  const createDocument = useCallback(async (data: CreateDocumentData) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const newDoc = await documentService.createDocument(data)
      setDocument(newDoc)
      return newDoc
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create document')
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [documentService])

  // Save document
  const saveDocument = useCallback(async (content: any, title?: string) => {
    if (!document) {
      throw new Error('No document to save')
    }
    
    try {
      await documentService.saveDocument(document.id, content, title)
      setDocument(prev => prev ? { ...prev, content, title: title || prev.title } : null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save document')
      throw err
    }
  }, [documentService, document])

  // Auto-save document
  const autoSaveDocument = useCallback(async (content: any) => {
    if (!document) return
    
    try {
      await documentService.autoSaveDocument(document.id, content)
    } catch (err) {
      console.error('Auto-save failed:', err)
      // Don't set error for auto-save failures
    }
  }, [documentService, document])

  // Load document on mount or when docId changes
  useEffect(() => {
    if (docId) {
      loadDocument(docId)
    }
  }, [docId, loadDocument])

  return {
    document,
    isLoading,
    error,
    loadDocument,
    createDocument,
    saveDocument,
    autoSaveDocument
  }
} 