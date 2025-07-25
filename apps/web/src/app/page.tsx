import Link from 'next/link'
import { PenTool, Users, Zap } from 'lucide-react'

/**
 * Home page component for the Rico application
 * Displays the main landing page with features and call-to-action
 */
export default function Home() {
  return (
    <main className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-1xl font-bold text-blue-600 mb-4">
          Test Tailwind CSS
        </h1>
        <p className="text-gray-700">
          If you see this styled, Tailwind is working!
        </p>
      </div>
    </main>
  )
} 