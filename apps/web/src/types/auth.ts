import { User as FirebaseUser } from 'firebase/auth'

/**
 * Extended user interface that includes our application-specific fields
 */
export interface User {
  id: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  createdAt: Date
  lastLoginAt: Date
}

/**
 * Authentication context interface
 */
export interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
}

/**
 * Authentication form data interfaces
 */
export interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  displayName: string
}

export interface SignInFormData {
  email: string
  password: string
}

export interface ResetPasswordFormData {
  email: string
}

/**
 * Authentication error types
 */
export type AuthError = {
  code: string
  message: string
}

/**
 * Convert Firebase User to our User interface
 */
export function firebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
    emailVerified: firebaseUser.emailVerified,
    createdAt: new Date(firebaseUser.metadata.creationTime!),
    lastLoginAt: new Date(firebaseUser.metadata.lastSignInTime!),
  }
} 