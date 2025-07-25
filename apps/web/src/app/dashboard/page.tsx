'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, FileText, Plus, Upload } from 'lucide-react'
import { useEffect, useState } from 'react'

/**
 * Dashboard page - placeholder for authenticated users
 */
export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)

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

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-yellow-50 dark:from-neutral-900 dark:to-neutral-950 p-4">
        <div className="text-center bg-white/80 dark:bg-neutral-900/80 rounded-2xl shadow-xl border border-white/30 dark:border-neutral-700 px-8 py-10 backdrop-blur">
          <h1 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-yellow-300">Please sign in</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-yellow-50 dark:from-neutral-900 dark:to-neutral-950 p-4">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 rounded-full bg-yellow-400 dark:bg-neutral-800 text-gray-900 dark:text-yellow-300 shadow-lg p-2 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
        aria-label="Toggle dark mode"
        type="button"
      >
        <span className="inline-block align-middle">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="5" className="fill-yellow-400 dark:fill-neutral-800" />
            <path
              className="stroke-yellow-500 dark:stroke-yellow-300"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 7.07l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
            />
          </svg>
        </span>
      </button>
      <div className="w-full max-w-4xl flex flex-col gap-8 items-center">
        {/* Header */}
        <Card className="w-full px-8 py-6 flex flex-row items-center justify-between mb-4">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-neutral-900 dark:text-yellow-300 hover:text-primary transition-colors">
              Rico 💎
            </Link>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
            <Avatar className="h-10 w-10 border-2 border-yellow-400 dark:border-yellow-300 bg-white dark:bg-neutral-800">
              <AvatarFallback className="text-lg font-semibold text-yellow-500 dark:text-yellow-300">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="default" size="default" onClick={handleSignOut} className="font-semibold px-4 py-2 bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 text-black border-none">
              <LogOut className="h-5 w-5 mr-2" />
              Sign out
            </Button>
          </div>
        </Card>

        {/* Main content */}
        <main className="w-full flex flex-col gap-8 items-center">
          <Card className="w-full px-8 py-8 mb-4">
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-yellow-300 mb-2 text-center">
              Welcome back, {user.displayName || 'there'}! 👋
            </h1>
            <p className="text-neutral-700 dark:text-neutral-200 text-center">
              Ready to start collaborating? Your documents await.
            </p>
          </Card>

          {/* Quick actions */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full mb-8">
            <Card className="cursor-pointer hover:shadow-2xl transition border border-white/30 dark:border-neutral-700 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mr-4">
                  <Plus className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <CardTitle className="text-lg text-neutral-900 dark:text-yellow-300">New Document</CardTitle>
                  <CardDescription className="text-neutral-700 dark:text-neutral-200">Start writing something amazing</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-2xl transition border border-white/30 dark:border-neutral-700 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg mr-4">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-neutral-900 dark:text-yellow-300">Recent Documents</CardTitle>
                  <CardDescription className="text-neutral-700 dark:text-neutral-200">Continue where you left off</CardDescription>
                </div>
              </CardHeader>
            </Card>

            <Card className="cursor-pointer hover:shadow-2xl transition border border-white/30 dark:border-neutral-700 shadow-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-500/10 rounded-lg mr-4">
                  <Upload className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-neutral-900 dark:text-yellow-300">Upload Documents</CardTitle>
                  <CardDescription className="text-neutral-700 dark:text-neutral-200">Import your existing files</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Coming soon placeholder */}
          <Card className="w-full border border-white/30 dark:border-neutral-700 shadow-xl rounded-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-yellow-300 mb-2">
                🚧 Coming Soon
              </CardTitle>
              <CardDescription className="text-lg text-neutral-700 dark:text-neutral-200">
                Rico is under active development. Here's what's coming next:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
                  <span className="text-2xl">✍️</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Rich Text Editor</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Real-time collaborative editing experience</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-900/20">
                  <span className="text-2xl">📁</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Document Management</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Organize files with folders and tags</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-900/20">
                  <span className="text-2xl">👥</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Live Collaboration</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">See cursors and presence indicators</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/50 dark:bg-yellow-900/20">
                  <span className="text-2xl">💬</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Comments & Reviews</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Add suggestions and feedback</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50/50 dark:bg-red-900/20">
                  <span className="text-2xl">📤</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Export Options</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">PDF, Word, and Markdown formats</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20">
                  <span className="text-2xl">🏢</span>
                  <div>
                    <h4 className="font-semibold text-neutral-900 dark:text-yellow-300 mb-1">Team Workspaces</h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300">Collaborate with your organization</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
} 