"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from '@/components/ui/card'

export default function Page() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle dark mode by adding/removing 'dark' class on <html>
  function toggleDarkMode() {
    if (typeof window !== "undefined") {
      const newDarkMode = !isDarkMode;
      setIsDarkMode(newDarkMode);
      
      if (newDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }

  // Set initial mode based on system preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const hasExistingDark = document.documentElement.classList.contains("dark");
      
      const initialDarkMode = hasExistingDark || prefersDark;
      setIsDarkMode(initialDarkMode);
      
      if (initialDarkMode) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Dark mode toggle button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-10 rounded-full bg-yellow-400 dark:bg-neutral-800 text-gray-900 dark:text-yellow-300 shadow-lg p-2 transition hover:scale-105 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none"
        aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        type="button"
      >
        {isDarkMode ? (
          // Sun icon for switching to light mode
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
          </svg>
        ) : (
          // Moon icon for switching to dark mode
          <svg
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      <Card className="max-w-md w-full flex flex-col items-center gap-6 p-8">
        <h1 className="text-4xl font-extrabold text-neutral-800 dark:text-yellow-300 text-center drop-shadow-sm">
          Welcome to <span className="text-yellow-500 dark:text-yellow-400">Rico</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-center text-lg">
          A world-class, real-time collaborative editor.<br />
          Get started and experience seamless collaboration!
        </p>
        <Link
          href="/login"
          className="mt-2 w-full rounded-lg bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition text-gray-900 dark:text-white-900 font-semibold text-lg py-3 shadow-md text-center"
          aria-label="Get started with Rico"
        >
          Get Started
        </Link>
      </Card>
    </main>
  );
} 