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
    const docId = data.docId || this.generateDocumentId()
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

    const updatedDocument = {
      ...document,
      content,
      title: title || document.title,
      updatedAt: new Date().toISOString()
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), updatedDocument)
  }

  async autoSaveDocument(docId: string, content: any): Promise<void> {
    const document = await this.loadDocument(docId)
    if (!document) {
      return // Document doesn't exist, skip auto-save
    }

    const updatedDocument = {
      ...document,
      content,
      updatedAt: new Date().toISOString()
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), updatedDocument)
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

    return `doc_${dateStr}_${Math.random().toString(36).substr(2, 9)}`
  }
} 