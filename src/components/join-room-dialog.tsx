"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface JoinRoomDialogProps {
  open: boolean;
  onClose: () => void;
}

export function JoinRoomDialog({ open, onClose }: JoinRoomDialogProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function handleJoin() {
    if (!code.trim()) return;
    setError("");
    setLoading(true);

    const res = await fetch("/api/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim() }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to join room");
      setLoading(false);
      return;
    }

    const room = await res.json();
    onClose();
    router.push(`/room/${room.id}`);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Join Room</h2>
        {error && (
          <div className="mb-3 p-2 bg-red-50 text-red-700 rounded text-sm">{error}</div>
        )}
        <input
          type="text"
          placeholder="Enter room code (e.g. X7K2M9)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleJoin()}
          maxLength={6}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase tracking-widest text-center text-lg"
          autoFocus
        />
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">Cancel</button>
          <button onClick={handleJoin} disabled={code.length < 6 || loading} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Joining..." : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}
