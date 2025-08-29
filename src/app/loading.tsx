export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-t-[color:var(--primary)] border-r-[color:var(--secondary)] border-b-[color:var(--primary)] border-l-[color:var(--secondary)] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-[color:var(--primary)]">Loading...</p>
      </div>
    </div>
  );
}
