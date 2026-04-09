"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { RoomCard } from "@/components/room-card";
import { CreateRoomDialog } from "@/components/create-room-dialog";
import { JoinRoomDialog } from "@/components/join-room-dialog";

interface Room {
  id: string;
  name: string;
  code: string;
  _count: { members: number };
  createdBy: { name: string };
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const fetchRooms = useCallback(async () => {
    const res = await fetch("/api/rooms");
    if (res.ok) {
      setRooms(await res.json());
    }
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetchRooms();
    }
  }, [status, router, fetchRooms]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Rooms</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowJoin(true)} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Join Room
          </button>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Create Room
          </button>
        </div>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No rooms yet</p>
          <p className="mt-1 text-sm">Create a new room or join one with a code</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              id={room.id}
              name={room.name}
              code={room.code}
              memberCount={room._count.members}
              creatorName={room.createdBy.name}
            />
          ))}
        </div>
      )}

      <CreateRoomDialog open={showCreate} onClose={() => setShowCreate(false)} onCreated={fetchRooms} />
      <JoinRoomDialog open={showJoin} onClose={() => setShowJoin(false)} />
    </div>
  );
}
