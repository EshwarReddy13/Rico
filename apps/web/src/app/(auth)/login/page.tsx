"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from '@/contexts/auth-context'
import { Card } from '@/components/ui/card'
import { useNavigation } from '@/hooks/useNavigation'

export default function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { navigate } = useNavigation();

  useEffect(() => {
    if (user) {
      // Use proper navigation for browser history handling
      navigate('/dashboard');
    }
  }, [user, navigate]);

  function toggleDarkMode() {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  }
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center  p-4 relative">
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
      <Card className="max-w-md w-full flex flex-col items-center gap-6 p-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-yellow-300 text-center mb-2">
          Sign in to <span className="text-yellow-500 dark:text-yellow-400">Rico</span>
        </h1>
        <form className="w-full flex flex-col gap-4" autoComplete="off">
          <label className="flex flex-col gap-1 text-neutral-700 dark:text-neutral-200 text-sm font-medium">
            Email
            <input
              type="email"
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-neutral-900 dark:text-neutral-100"
              required
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1 text-neutral-700 dark:text-neutral-200 text-sm font-medium">
            Password
            <input
              type="password"
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-neutral-900 dark:text-neutral-100"
              required
              autoComplete="current-password"
            />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition text-gray-900 dark:text-gray-900 font-semibold text-lg py-3 shadow-md"
          >
            Sign In
          </button>
        </form>
        {/* Google Auth Button */}
        <button
          type="button"
          onClick={async () => {
            setGoogleError(null);
            try {
              await signInWithGoogle();
            } catch (err: any) {
              setGoogleError(err.message || 'Google sign-in failed');
            }
          }}
          className="w-full flex items-center justify-center gap-3 rounded-lg bg-white/80 dark:bg-neutral-800/80 border border-neutral-300 dark:border-neutral-700 shadow hover:bg-white dark:hover:bg-neutral-900 transition text-neutral-800 dark:text-neutral-100 font-semibold text-lg py-3 mt-2 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
          aria-label="Sign in with Google"
        >
          <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_17_40)">
              <path d="M47.5 24.5C47.5 22.6 47.3 20.8 47 19H24V29.1H37.4C36.7 32.2 34.7 34.7 31.8 36.4V42H39.5C44 38.1 47.5 32 47.5 24.5Z" fill="#4285F4"/>
              <path d="M24 48C30.6 48 36.1 45.9 39.5 42L31.8 36.4C29.9 37.6 27.2 38.4 24 38.4C17.7 38.4 12.2 34.3 10.3 28.7H2.3V34.5C5.7 41.1 14.1 48 24 48Z" fill="#34A853"/>
              <path d="M10.3 28.7C9.7 26.9 9.4 24.9 9.4 23C9.4 21.1 9.7 19.1 10.3 17.3V11.5H2.3C0.8 14.3 0 17.5 0 21C0 24.5 0.8 27.7 2.3 30.5L10.3 28.7Z" fill="#FBBC05"/>
              <path d="M24 9.6C27.6 9.6 30.6 10.8 32.7 12.7L39.7 5.7C36.1 2.4 30.6 0 24 0C14.1 0 5.7 6.9 2.3 13.5L10.3 17.3C12.2 11.7 17.7 9.6 24 9.6Z" fill="#EA4335"/>
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white"/>
              </clipPath>
            </defs>
          </svg>
          Sign in with Google
        </button>
        {googleError && (
          <p className="text-red-600 dark:text-red-400 text-sm mt-2 text-center">{googleError}</p>
        )}
        <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center mt-2">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </Card>
    </main>
  );
} 