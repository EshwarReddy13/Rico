'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { type User, type AuthContextType, firebaseUserToUser } from '@/types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Custom hook to use the authentication context
 * @returns Authentication context with user data and auth methods
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

/**
 * Authentication provider component that manages global auth state
 * Wraps the app to provide authentication context to all child components
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  /**
   * Sign up a new user with email and password
   */
  const signUp = async (email: string, password: string, displayName: string): Promise<void> => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update the user's display name
      await firebaseUpdateProfile(firebaseUser, { displayName })
      
      // The onAuthStateChanged listener will handle setting the user state
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * Sign in an existing user with email and password
   */
  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // The onAuthStateChanged listener will handle setting the user state
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * Sign out the current user
   */
  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(auth)
      // The onAuthStateChanged listener will handle clearing the user state
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * Send a password reset email
   */
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  /**
   * Update the current user's profile
   */
  const updateProfile = async (displayName: string, photoURL?: string): Promise<void> => {
    try {
      if (!auth.currentUser) {
        throw new Error('No user is currently signed in')
      }
      
      await firebaseUpdateProfile(auth.currentUser, {
        displayName,
        ...(photoURL && { photoURL }),
      })
      
      // Update local user state
      if (user) {
        setUser({
          ...user,
          displayName,
          ...(photoURL && { photoURL }),
        })
      }
    } catch (error: any) {
      throw new Error(error.message)
    }
  }

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser(firebaseUserToUser(firebaseUser))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value: AuthContextType = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
} 