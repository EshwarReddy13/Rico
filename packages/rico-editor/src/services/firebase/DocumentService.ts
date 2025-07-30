import { FirebaseService } from './FirebaseService'

export interface Document {
  id: string
  title: string
  content: any
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateDocumentData {
  title: string
  content?: any
  userId: string
  docId?: string
}

export class DocumentService {
  private firebaseService: FirebaseService

  constructor(firebaseService: FirebaseService) {
    this.firebaseService = firebaseService
  }

  private getDocumentPath(docId: string): string {
    return `documents/${docId}`
  }

  async createDocument(data: CreateDocumentData): Promise<Document> {
    const docId = data.docId || await this.generateUniqueDocumentId()
    const now = new Date().toISOString()

    const document: Document = {
      id: docId,
      title: data.title,
      content: data.content || { type: 'doc', content: [] },
      userId: data.userId,
      createdAt: now,
      updatedAt: now
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), document)
    return document
  }

  async loadDocument(docId: string): Promise<Document | null> {
    return await this.firebaseService.getDocument(this.getDocumentPath(docId))
  }

  async saveDocument(docId: string, content: any, title?: string): Promise<void> {
    const document = await this.loadDocument(docId)
    if (!document) {
      throw new Error('Document not found')
    }

    // Convert TipTap content to a plain object to avoid Firebase serialization issues
    const serializedContent = this.serializeContent(content)

    const updatedDocument = {
      ...document,
      content: serializedContent,
      ...(title && { title }),
      updatedAt: new Date().toISOString()
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), updatedDocument)
  }

  async autoSaveDocument(docId: string, content: any): Promise<void> {
    const document = await this.loadDocument(docId)
    if (!document) {
      return // Document doesn't exist, skip auto-save
    }

    // Convert TipTap content to a plain object to avoid Firebase serialization issues
    const serializedContent = this.serializeContent(content)

    const updatedDocument = {
      ...document,
      content: serializedContent,
      updatedAt: new Date().toISOString()
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), updatedDocument)
  }

  /**
   * Serialize TipTap content to a plain object for Firebase storage
   */
  private serializeContent(content: any): any {
    if (!content) return content
    
    // If it's already a plain object, return it
    if (typeof content === 'object' && content !== null && !content.hasOwnProperty) {
      return content
    }

    // If it's a TipTap editor instance, get the JSON
    if (content.getJSON && typeof content.getJSON === 'function') {
      return content.getJSON()
    }

    // If it's a ProseMirror document, convert to JSON
    if (content.toJSON && typeof content.toJSON === 'function') {
      return content.toJSON()
    }

    // For other cases, try to convert to a plain object
    try {
      // Deep clone the content to remove any non-serializable properties
      const cleanContent = JSON.parse(JSON.stringify(content))
      
      // Ensure it's a valid document structure
      if (cleanContent && typeof cleanContent === 'object') {
        return cleanContent
      }
      
      throw new Error('Invalid content structure')
    } catch (error) {
      console.warn('Failed to serialize content, using fallback:', error)
      return {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Content could not be serialized' }]
          }
        ]
      }
    }
  }

  async deleteDocument(docId: string): Promise<void> {
    await this.firebaseService.removeDocument(this.getDocumentPath(docId))
  }

  async documentExists(docId: string): Promise<boolean> {
    const document = await this.loadDocument(docId)
    return document !== null
  }

  async generateUniqueDocumentId(): Promise<string> {
    let attempts = 0
    const maxAttempts = 10

    while (attempts < maxAttempts) {
      const docId = this.generateDocumentId()
      const exists = await this.documentExists(docId)

      if (!exists) {
        return docId
      }

      attempts++
      console.warn(`Document ID collision detected, retrying... (attempt ${attempts})`)
    }

    throw new Error('Failed to generate unique document ID after multiple attempts')
  }

  private generateDocumentId(): string {
    const now = new Date()
    const dateStr = now.getFullYear().toString() +
                   (now.getMonth() + 1).toString().padStart(2, '0') +
                   now.getDate().toString().padStart(2, '0') +
                   now.getHours().toString().padStart(2, '0') +
                   now.getMinutes().toString().padStart(2, '0') +
                   now.getSeconds().toString().padStart(2, '0')

    return `rico_${dateStr}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Get all documents for a specific user from Realtime Database
   */
  async getUserDocuments(userId: string): Promise<Document[]> {
    try {
      const documents = await this.firebaseService.queryDocuments('documents', 'userId', userId)
      return documents.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        userId: doc.userId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    } catch (error) {
      console.error('Failed to get user documents:', error)
      return []
    }
  }

  /**
   * Get all documents from Realtime Database (for background archiving)
   */
  async getAllDocuments(): Promise<Document[]> {
    try {
      const documents = await this.firebaseService.getAllDocuments('documents')
      return documents.map((doc: any) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        userId: doc.userId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
      }))
    } catch (error) {
      console.error('Failed to get all documents:', error)
      return []
    }
  }
} 