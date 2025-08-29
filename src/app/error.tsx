"use client";
 
import { useEffect } from "react";
import Link from "next/link";
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);
 
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[color:var(--primary)] mb-4">Something went wrong!</h2>
        <p className="mb-6">An error occurred while loading this page.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={() => reset()}
            className="btn-secondary"
          >
            Try again
          </button>
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
