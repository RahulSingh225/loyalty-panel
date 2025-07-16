'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-200 to-base-300 p-4">
      <div className="card w-full max-w-lg bg-base-100 shadow-2xl rounded-2xl overflow-hidden">
        <div className="card-body p-8 text-center">
          {/* Creative SVG Artwork */}
          <div className="mb-6">
            <svg
              className="w-32 h-32 mx-auto text-error animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20zm0 16a1 1 0 11-2 0 1 1 0 012 0z"
              />
            </svg>
          </div>

          <h2 className="card-title text-3xl font-bold text-error justify-center mb-4">
            Oops! Something Went Wrong
          </h2>
          <p className="text-base-content/70 mb-6">
            We encountered an unexpected issue. Let's try to fix it!
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => reset()}
              className="btn btn-primary rounded-lg hover:btn-primary/90 transition-all duration-300"
            >
              Try Again
            </button>
            <a
              href="/login"
              className="btn btn-ghost rounded-lg hover:bg-base-200 transition-all duration-300"
            >
              Go to Homepage
            </a>
          </div>

          {error.digest && (
            <p className="text-sm text-base-content/50 mt-6">
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}