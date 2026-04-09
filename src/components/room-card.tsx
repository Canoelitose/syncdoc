"use client";

import Link from "next/link";

interface RoomCardProps {
  id: string;
  name: string;
  code: string;
  memberCount: number;
  creatorName: string;
}

export function RoomCard({ id, name, code, memberCount, creatorName }: RoomCardProps) {
  return (
    <Link
      href={`/room/${id}`}
      className="block p-4 bg-white rounded-xl border hover:border-blue-300 hover:shadow-sm transition"
    >
      <h3 className="font-semibold text-lg">{name}</h3>
      <div className="mt-2 flex items-center gap-3 text-sm text-gray-500">
        <span>Code: {code}</span>
        <span>{memberCount} member{memberCount !== 1 ? "s" : ""}</span>
      </div>
      <p className="mt-1 text-xs text-gray-400">Created by {creatorName}</p>
    </Link>
  );
}
