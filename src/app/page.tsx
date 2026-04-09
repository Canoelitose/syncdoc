import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-5xl font-bold tracking-tight">SyncDoc</h1>
        <p className="mt-4 text-lg text-gray-600">
          Collaborative workspaces with real-time document editing.
          Create rooms, build document trees, and work together — instantly.
        </p>
        <div className="mt-8 flex gap-3 justify-center">
          <Link href="/register" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Get Started
          </Link>
          <Link href="/login" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
