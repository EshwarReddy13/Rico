import { FirebaseService } from './FirebaseService'
import { FirestoreService } from './FirestoreService'
import { Document, CreateDocumentData } from './DocumentService'

export interface DocumentActivity {
  docId: string
  lastAccessed: Date
  isActive: boolean
  inactivityTimer?: NodeJS.Timeout
}

export class HybridDocumentService {
  private firebaseService: FirebaseService
  private firestoreService: FirestoreService
  private documentActivity: Map<string, DocumentActivity> = new Map()
  private inactivityThreshold: number = 1 * 60 * 1000 // 30 minutes in milliseconds

  constructor(firebaseService: FirebaseService) {
    this.firebaseService = firebaseService
    this.firestoreService = firebaseService.getFirestoreService()
  }

  private getDocumentPath(docId: string): string {
    return `documents/${docId}`
  }

  /**
   * Create a new document in Realtime Database
   */
  async createDocument(data: CreateDocumentData): Promise<Document> {
    const docId = data.docId || this.generateDocumentId()
    const now = new Date().toISOString()
    
    const document: Document = {
      id: docId,
      title: data.title,
      content: data.content || { type: 'doc', content: [] },
      userId: data.userId,
      createdAt: now,
      updatedAt: now,
      collaborators: [data.userId]
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), document)
    
    // Track activity for this document
    this.trackDocumentActivity(docId)
    
    console.log('Document created in Realtime Database:', docId)
    return document
  }

  /**
   * Load a document - check Realtime Database first, then Firestore
   */
  async loadDocument(docId: string): Promise<Document | null> {
    try {
      // First, try to load from Realtime Database
      const document = await this.firebaseService.getDocument(this.getDocumentPath(docId))
      
      if (document) {
        // Document is active in Realtime Database
        this.trackDocumentActivity(docId)
        return document
      }

      // Document not in Realtime Database, check Firestore
      const archivedDocument = await this.firestoreService.getArchivedDocument(docId)
      
      if (archivedDocument) {
        // Restore document from Firestore to Realtime Database
        await this.firebaseService.setDocument(this.getDocumentPath(docId), archivedDocument)
        this.trackDocumentActivity(docId)
        console.log('Document restored from Firestore to Realtime Database:', docId)
        return archivedDocument
      }

      return null
    } catch (error) {
      console.error('Error loading document:', error)
      return null
    }
  }

  /**
   * Save document to Realtime Database and update activity
   */
  async saveDocument(docId: string, content: any, title?: string): Promise<void> {
    const document = await this.loadDocument(docId)
    
    if (!document) {
      throw new Error(`Document ${docId} not found`)
    }

    const updateData: Partial<Document> = {
      content,
      updatedAt: new Date().toISOString()
    }

    if (title) {
      updateData.title = title
    }

    await this.firebaseService.setDocument(this.getDocumentPath(docId), updateData)
    
    // Update activity tracking
    this.trackDocumentActivity(docId)
    
    console.log('Document saved to Realtime Database:', docId)
  }

  /**
   * Auto-save document (keeps it in Realtime Database)
   */
  async autoSaveDocument(docId: string, content: any): Promise<void> {
    try {
      await this.saveDocument(docId, content)
    } catch (error) {
      console.error('Auto-save failed:', error)
    }
  }

  /**
   * Delete document from both Realtime Database and Firestore
   */
  async deleteDocument(docId: string): Promise<void> {
    // Remove from Realtime Database
    await this.firebaseService.removeDocument(this.getDocumentPath(docId))
    
    // Remove from Firestore if archived
    await this.firestoreService.deleteArchivedDocument(docId)
    
    // Stop tracking activity
    this.stopTrackingDocument(docId)
    
    console.log('Document deleted from both databases:', docId)
  }

  /**
   * Track document activity and set up inactivity timer
   */
  private trackDocumentActivity(docId: string): void {
    const now = new Date()
    
    // Clear existing timer if any
    this.stopTrackingDocument(docId)
    
    // Set up new inactivity timer
    const inactivityTimer = setTimeout(() => {
      this.archiveInactiveDocument(docId)
    }, this.inactivityThreshold)
    
    this.documentActivity.set(docId, {
      docId,
      lastAccessed: now,
      isActive: true,
      inactivityTimer
    })
  }

  /**
   * Stop tracking document activity
   */
  private stopTrackingDocument(docId: string): void {
    const activity = this.documentActivity.get(docId)
    if (activity?.inactivityTimer) {
      clearTimeout(activity.inactivityTimer)
    }
    this.documentActivity.delete(docId)
  }

  /**
   * Check if document should be archived based on last accessed time
   */
  async checkAndArchiveDocument(docId: string): Promise<void> {
    try {
      const document = await this.firebaseService.getDocument(this.getDocumentPath(docId))
      
      if (!document) {
        return // Document doesn't exist or already archived
      }

      const lastAccessed = new Date(document.updatedAt || document.createdAt)
      const now = new Date()
      const timeSinceLastAccess = now.getTime() - lastAccessed.getTime()

      if (timeSinceLastAccess >= this.inactivityThreshold) {
        console.log(`Document ${docId} inactive for ${Math.round(timeSinceLastAccess / 60000)} minutes, archiving...`)
        await this.archiveInactiveDocument(docId)
      }
    } catch (error) {
      console.error('Error checking document for archiving:', error)
    }
  }

  /**
   * Archive document to Firestore when inactive
   */
  private async archiveInactiveDocument(docId: string): Promise<void> {
    try {
      // Get document from Realtime Database
      const document = await this.firebaseService.getDocument(this.getDocumentPath(docId))
      
      if (document) {
        // Archive to Firestore
        await this.firestoreService.archiveDocument(document)
        
        // Remove from Realtime Database
        await this.firebaseService.removeDocument(this.getDocumentPath(docId))
        
        // Update activity tracking
        const activity = this.documentActivity.get(docId)
        if (activity) {
          activity.isActive = false
          activity.inactivityTimer = undefined
        }
        
        console.log('Document archived to Firestore due to inactivity:', docId)
      }
    } catch (error) {
      console.error('Error archiving inactive document:', error)
    }
  }

  /**
   * Get all active documents for a user
   */
  async getUserActiveDocuments(userId: string): Promise<Document[]> {
    // This would require a different approach since we can't easily query by userId in Realtime Database
    // For now, return empty array - this could be enhanced with a user documents index
    return []
  }

  /**
   * Get all archived documents for a user
   */
  async getUserArchivedDocuments(userId: string): Promise<Document[]> {
    return await this.firestoreService.getUserArchivedDocuments(userId)
  }

  /**
   * Set inactivity threshold (in minutes)
   */
  setInactivityThreshold(minutes: number): void {
    this.inactivityThreshold = minutes * 60 * 1000
  }

  /**
   * Manually archive a document
   */
  async manuallyArchiveDocument(docId: string): Promise<void> {
    await this.archiveInactiveDocument(docId)
  }

  /**
   * Get document activity status
   */
  getDocumentActivity(docId: string): DocumentActivity | undefined {
    return this.documentActivity.get(docId)
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