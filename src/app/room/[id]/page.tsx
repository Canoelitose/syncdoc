import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, name: true } } },
      },
    },
  });

  if (!room) redirect("/dashboard");

  const isMember = room.members.some((m) => m.userId === session.user!.id);
  if (!isMember) redirect("/dashboard");

  return (
    <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{room.name}</h1>
        <p className="mt-2 text-gray-500">
          Code: <span className="font-mono font-bold">{room.code}</span>
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {room.members.length} member{room.members.length !== 1 ? "s" : ""}
        </p>
        <p className="mt-6 text-gray-400">Canvas coming in Plan 2...</p>
      </div>
    </div>
  );
}
