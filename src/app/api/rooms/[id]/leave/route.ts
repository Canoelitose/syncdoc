import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const room = await prisma.room.findUnique({ where: { id } });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  if (room.createdById === session.user.id) {
    return NextResponse.json(
      { error: "Room creator cannot leave. Delete the room instead." },
      { status: 400 }
    );
  }

  await prisma.roomMember.delete({
    where: { roomId_userId: { roomId: id, userId: session.user.id } },
  });

  return NextResponse.json({ success: true });
}
