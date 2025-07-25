"use client";
import { useEffect } from "react";
import Link from "next/link";
import { Card } from '@/components/ui/card'

export default function SignupPage() {
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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-yellow-50 dark:from-neutral-900 dark:to-neutral-950 p-4 relative">
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
          Create your <span className="text-yellow-500 dark:text-yellow-400">Rico</span> account
        </h1>
        <form className="w-full flex flex-col gap-4" autoComplete="off">
          <label className="flex flex-col gap-1 text-neutral-700 dark:text-neutral-200 text-sm font-medium">
            Name
            <input
              type="text"
              className="rounded-md border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition text-neutral-900 dark:text-neutral-100"
              required
              autoComplete="name"
            />
          </label>
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
              autoComplete="new-password"
            />
          </label>
          <button
            type="submit"
            className="mt-2 w-full rounded-lg bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition text-gray-900 dark:text-gray-900 font-semibold text-lg py-3 shadow-md"
          >
            Sign Up
          </button>
        </form>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 text-center mt-2">
          Already have an account?{' '}
          <Link href="/login" className="text-yellow-600 dark:text-yellow-400 hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </Card>
    </main>
  );
} 