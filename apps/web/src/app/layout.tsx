import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rico - Real-time Collaborative Editor',
  description: 'A world-class, real-time collaborative document editor built with Next.js, TypeScript, and Firebase.',
  keywords: ['collaborative editor', 'real-time', 'documents', 'rico'],
  authors: [{ name: 'Rico Team' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

interface RootLayoutProps {
  children: React.ReactNode
}

/**
 * Root layout component for the Rico application
 * Provides global HTML structure, metadata, styling, and authentication context
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <div id="root" className="min-h-screen bg-background text-foreground">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 