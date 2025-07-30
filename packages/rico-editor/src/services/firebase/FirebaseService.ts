import { initializeApp, FirebaseApp, getApps } from 'firebase/app'
import { getDatabase, Database, ref, set, get, remove, query, orderByChild, equalTo, onValue, off } from 'firebase/database'

export class FirebaseService {
  private app: FirebaseApp | null = null
  private database: Database | null = null
  private isInitialized = false

  initialize(): void {
    if (this.isInitialized) {
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
        console.log('✅ Firebase Realtime Database using existing app')
        return
      }

      const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
      }

      this.app = initializeApp(firebaseConfig)
      this.database = getDatabase(this.app)
      this.isInitialized = true

      console.log('✅ Firebase Realtime Database initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize Firebase:', error)
      throw error
    }
  }

  isReady(): boolean {
    return this.isInitialized && this.database !== null
  }

  async setDocument(path: string, data: any): Promise<void> {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    await set(docRef, data)
  }

  async getDocument(path: string): Promise<any> {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    const snapshot = await get(docRef)
    
    if (snapshot.exists()) {
      return snapshot.val()
    }
    
    return null
  }

  async removeDocument(path: string): Promise<void> {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    await remove(docRef)
  }

  async getAllDocuments(path: string): Promise<any[]> {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }
    const docRef = ref(this.database, path)
    const snapshot = await get(docRef)
    
    const documents: any[] = []
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        documents.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
    }
    
    return documents
  }

  async queryDocuments(path: string, field: string, value: string): Promise<any[]> {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    const queryRef = query(docRef, orderByChild(field), equalTo(value))
    const snapshot = await get(queryRef)
    
    const documents: any[] = []
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        documents.push({
          id: childSnapshot.key,
          ...childSnapshot.val()
        })
      })
    }
    
    return documents
  }

  onDocumentChange(path: string, callback: (data: any) => void): () => void {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    onValue(docRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val())
      } else {
        callback(null)
      }
    })

    // Return unsubscribe function
    return () => {
      off(docRef)
    }
  }

  onQueryChange(path: string, field: string, value: string, callback: (data: any[]) => void): () => void {
    if (!this.database) {
      throw new Error('Firebase not initialized')
    }

    const docRef = ref(this.database, path)
    const queryRef = query(docRef, orderByChild(field), equalTo(value))
    
    onValue(queryRef, (snapshot) => {
      const documents: any[] = []
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          documents.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
      }
      callback(documents)
    })

    // Return unsubscribe function
    return () => {
      off(queryRef)
    }
  }
} 