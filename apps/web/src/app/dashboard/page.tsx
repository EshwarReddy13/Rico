'use client'

import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, FileText, Plus } from 'lucide-react'

/**
 * Dashboard page - placeholder for authenticated users
 */
export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Please sign in</h1>
          <Link href="/login">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
            Rico 💎
          </Link>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.displayName || 'there'}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to start collaborating? Your documents await.
          </p>
        </div>

        {/* Quick actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg mr-4">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">New Document</CardTitle>
                <CardDescription>Start writing something amazing</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-500/10 rounded-lg mr-4">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Recent Documents</CardTitle>
                <CardDescription>Continue where you left off</CardDescription>
              </div>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500/10 rounded-lg mr-4">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Shared with Me</CardTitle>
                <CardDescription>Collaborate with your team</CardDescription>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Coming soon placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>🚧 Coming Soon</CardTitle>
            <CardDescription>
              Rico is under active development. Here's what's coming next:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 text-sm text-muted-foreground">
              <div>• Rich text editor with real-time collaboration</div>
              <div>• Document management and folders</div>
              <div>• Live cursors and presence indicators</div>
              <div>• Comments and suggestions</div>
              <div>• File exports (PDF, Word, Markdown)</div>
              <div>• Team workspaces</div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
} 