"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Page() {
  // Toggle dark mode by adding/removing 'dark' class on <html>
  function toggleDarkMode() {
    if (typeof window !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  }

  // Optional: Set initial mode based on system preference
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
          {/* Sun/Moon icon */}
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
      <section className="bg-white/90 dark:bg-neutral-900/90 rounded-2xl shadow-2xl max-w-md w-full flex flex-col items-center gap-6 p-8 border border-yellow-100 dark:border-yellow-700">
        <h1 className="text-4xl font-extrabold text-neutral-800 dark:text-yellow-300 text-center drop-shadow-sm">
          Welcome to <span className="text-yellow-500 dark:text-yellow-400">Rico</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-300 text-center text-lg">
          A world-class, real-time collaborative editor.<br />
          Get started and experience seamless collaboration!
        </p>
        <Link
          href="/login"
          className="mt-2 w-full rounded-lg bg-yellow-400 dark:bg-yellow-500 hover:bg-yellow-500 dark:hover:bg-yellow-400 focus-visible:ring-2 focus-visible:ring-yellow-400 focus:outline-none transition text-gray-900 dark:text-gray-900 font-semibold text-lg py-3 shadow-md text-center"
          aria-label="Get started with Rico"
        >
          Get Started
        </Link>
      </section>
    </main>
  );
} 