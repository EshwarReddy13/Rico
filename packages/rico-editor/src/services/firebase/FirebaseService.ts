import { initializeApp, FirebaseApp, getApps } from 'firebase/app'
import { getDatabase, Database, ref, set, get, push, remove } from 'firebase/database'

export class FirebaseService {
  private app: FirebaseApp | null = null
  private database: Database | null = null
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) {
      console.warn('FirebaseService already initialized')
      return
    }

    try {
      // Check if Firebase is already initialized
      const existingApps = getApps()
      if (existingApps.length > 0) {
        // Use existing Firebase app
        this.app = existingApps[0]
        this.database = getDatabase(this.app)
        this.isInitialized = true
        console.log('FirebaseService using existing app')
        return
      }

      // Use environment variables directly
      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      }

      // Check if all required config is available
      if (!firebaseConfig.apiKey || !firebaseConfig.databaseURL) {
        console.warn('Firebase config not available, running in offline mode')
        return
      }

      this.app = initializeApp(firebaseConfig)
      this.database = getDatabase(this.app)
      this.isInitialized = true
      console.log('FirebaseService initialized successfully')
    } catch (error) {
      console.error('Failed to initialize FirebaseService:', error)
      // Don't throw error, just run in offline mode
    }
  }

  getDatabase(): Database | null {
    return this.database
  }

  isReady(): boolean {
    return this.isInitialized && this.database !== null
  }

  // Helper methods for database operations
  async setDocument(path: string, data: any): Promise<void> {
    if (!this.database) {
      console.warn('Firebase not available, skipping save')
      return
    }
    
    try {
      await set(ref(this.database, path), {
        ...data,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error('Error setting document:', error)
      throw error
    }
  }

  async getDocument(path: string): Promise<any> {
    if (!this.database) {
      console.warn('Firebase not available, returning null')
      return null
    }
    
    try {
      const snapshot = await get(ref(this.database, path))
      return snapshot.exists() ? snapshot.val() : null
    } catch (error) {
      console.error('Error getting document:', error)
      return null
    }
  }

  async removeDocument(path: string): Promise<void> {
    if (!this.database) {
      console.warn('Firebase not available, skipping delete')
      return
    }
    
    try {
      await remove(ref(this.database, path))
    } catch (error) {
      console.error('Error removing document:', error)
      throw error
    }
  }
} 