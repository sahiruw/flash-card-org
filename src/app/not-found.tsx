import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-[color:var(--primary)] mb-4">Page Not Found</h2>
        <p className="mb-6">Sorry, the page you are looking for does not exist.</p>
        <Link href="/" className="btn-primary">
          Return Home
        </Link>
      </div>
    </div>
  );
}
