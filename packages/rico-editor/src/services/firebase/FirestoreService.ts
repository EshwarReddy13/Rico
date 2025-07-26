import { getFirestore, Firestore, doc, setDoc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { FirebaseApp } from 'firebase/app'
import { Document } from './DocumentService'

export interface FirestoreDocument extends Document {
  lastAccessed: string
  isArchived: boolean
}

export class FirestoreService {
  private firestore: Firestore | null = null
  private app: FirebaseApp | null = null

  initialize(app: FirebaseApp): void {
    this.app = app
    this.firestore = getFirestore(app)
  }

  isReady(): boolean {
    return this.firestore !== null
  }

  /**
   * Archive a document to Firestore (move from Realtime Database)
   */
  async archiveDocument(document: Document): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore not initialized')
    }

    const firestoreDoc: FirestoreDocument = {
      ...document,
      lastAccessed: new Date().toISOString(),
      isArchived: true
    }

    await setDoc(doc(this.firestore, 'archived_documents', document.id), firestoreDoc)
    console.log('Document archived to Firestore:', document.id)
  }

  /**
   * Retrieve an archived document from Firestore
   */
  async getArchivedDocument(docId: string): Promise<Document | null> {
    if (!this.firestore) {
      throw new Error('Firestore not initialized')
    }

    try {
      const docRef = doc(this.firestore, 'archived_documents', docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreDocument
        // Remove Firestore-specific fields
        const { lastAccessed, isArchived, ...document } = data
        return document as Document
      }

      return null
    } catch (error) {
      console.error('Error retrieving archived document:', error)
      return null
    }
  }

  /**
   * Restore a document from Firestore (move back to Realtime Database)
   */
  async restoreDocument(docId: string): Promise<Document | null> {
    const document = await this.getArchivedDocument(docId)
    
    if (document) {
      // Delete from Firestore after successful retrieval
      await this.deleteArchivedDocument(docId)
      console.log('Document restored from Firestore:', docId)
    }

    return document
  }

  /**
   * Delete an archived document from Firestore
   */
  async deleteArchivedDocument(docId: string): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore not initialized')
    }

    await deleteDoc(doc(this.firestore, 'archived_documents', docId))
    console.log('Archived document deleted from Firestore:', docId)
  }

  /**
   * Get all archived documents for a user
   */
  async getUserArchivedDocuments(userId: string): Promise<Document[]> {
    if (!this.firestore) {
      throw new Error('Firestore not initialized')
    }

    try {
      const q = query(
        collection(this.firestore, 'archived_documents'),
        where('userId', '==', userId),
        where('isArchived', '==', true)
      )

      const querySnapshot = await getDocs(q)
      const documents: Document[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreDocument
        const { lastAccessed, isArchived, ...document } = data
        documents.push(document as Document)
      })

      return documents
    } catch (error) {
      console.error('Error getting user archived documents:', error)
      return []
    }
  }

  /**
   * Clean up old archived documents (optional - for maintenance)
   */
  async cleanupOldArchivedDocuments(daysOld: number = 30): Promise<void> {
    if (!this.firestore) {
      throw new Error('Firestore not initialized')
    }

    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)

    try {
      const q = query(
        collection(this.firestore, 'archived_documents'),
        where('lastAccessed', '<', cutoffDate.toISOString())
      )

      const querySnapshot = await getDocs(q)
      
      for (const docSnap of querySnapshot.docs) {
        await deleteDoc(docSnap.ref)
        console.log('Cleaned up old archived document:', docSnap.id)
      }
    } catch (error) {
      console.error('Error cleaning up old archived documents:', error)
    }
  }
} 