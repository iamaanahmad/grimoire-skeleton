'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <h1 className="text-6xl font-bold mb-4">💀</h1>
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-lg mb-6">{error.message || 'An unexpected error occurred'}</p>
            <button
              onClick={() => reset()}
              className="px-6 py-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
