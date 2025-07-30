'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'
import { LogOut, FileText, Plus, Search, Calendar, Clock, Edit3, Eye } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FileNamePrompt } from '@/components/FileNamePrompt'
import { FirebaseService, DocumentService } from '@rico/editor'
import { useNavigation } from '@/hooks/useNavigation'

interface Document {
  id: string
  title: string
  content: any
  userId: string
  createdAt: string
  updatedAt: string
}

/**
 * Documents page - displays all user documents
 */
export default function DocumentsPage() {
  const { user, signOut } = useAuth()
  const { navigate } = useNavigation()
  const [isDark, setIsDark] = useState(false)
  const [showFileNamePrompt, setShowFileNamePrompt] = useState(false)
  const [isCreatingDocument, setIsCreatingDocument] = useState(false)
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

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

  useEffect(() => {
    if (user) {
      loadDocuments()
    }
  }, [user])

  const loadDocuments = async () => {
    if (!user) return

    setIsLoading(true)
    try {
      // Use singleton pattern to prevent multiple Firebase initializations
      let firebaseService: FirebaseService
      let documentService: DocumentService
      
      // Check if we already have a global instance
      if (!(window as any).__firebaseService) {
        firebaseService = new FirebaseService()
        firebaseService.initialize()
        ;(window as any).__firebaseService = firebaseService
      } else {
        firebaseService = (window as any).__firebaseService
      }
      
      if (!(window as any).__documentService) {
        documentService = new DocumentService(firebaseService)
        ;(window as any).__documentService = documentService
      } else {
        documentService = (window as any).__documentService
      }
      
      // Get user documents from Realtime Database
      const userDocuments = await documentService.getUserDocuments(user.email || '')
      console.log('User documents found:', userDocuments.length)
      
      setDocuments(userDocuments)
    } catch (error) {
      console.error('Failed to load documents:', error)
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Sign out failed:', error)
    }
  }

  const handleNewDocument = () => {
    setShowFileNamePrompt(true)
  }

  const handleFileNameConfirm = async (fileName: string) => {
    setIsCreatingDocument(true)
    try {
      // Generate a unique document ID
      const docId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      // Navigate to the new document
      navigate(`/document/${docId}`)
    } catch (error) {
      console.error('Failed to create document:', error)
    } finally {
      setIsCreatingDocument(false)
      setShowFileNamePrompt(false)
    }
  }

  const handleFileNameCancel = () => {
    setShowFileNamePrompt(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading documents...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Documents</h1>
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              size="sm"
              className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            >
              {isDark ? '☀️' : '🌙'}
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              onClick={handleNewDocument}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isCreatingDocument}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Document
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="dark:bg-neutral-800 dark:border-neutral-700 dark:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {searchTerm ? 'No documents found' : 'No documents yet'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first document to get started'}
            </p>
            {!searchTerm && (
              <Button
                onClick={handleNewDocument}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Document
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="hover:shadow-lg transition-shadow duration-200 dark:bg-neutral-800 dark:border-neutral-700">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-xs">
                          {doc.title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1">
                          {doc.title}
                        </CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                          Created by {doc.userId}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="w-4 h-4 mr-2" />
                      Created {formatDate(doc.createdAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      Updated {formatDate(doc.updatedAt)}
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/document/${doc.id}`}>
                        <Button variant="outline" size="sm" className="flex-1 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                          <Eye className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </Link>
                      <Link href={`/document/${doc.id}`}>
                        <Button variant="outline" size="sm" className="flex-1 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white">
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* File Name Prompt Modal */}
        {showFileNamePrompt && (
          <FileNamePrompt
            isOpen={showFileNamePrompt}
            onClose={handleFileNameCancel}
            onConfirm={handleFileNameConfirm}
            isLoading={isCreatingDocument}
          />
        )}
      </div>
    </div>
  )
} 