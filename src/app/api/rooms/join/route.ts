import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Room code is required" }, { status: 400 });
  }

  const room = await prisma.room.findUnique({
    where: { code: code.toUpperCase().trim() },
  });

  if (!room) {
    return NextResponse.json({ error: "Room not found" }, { status: 404 });
  }

  const existingMember = await prisma.roomMember.findUnique({
    where: { roomId_userId: { roomId: room.id, userId: session.user.id } },
  });

  if (existingMember) {
    return NextResponse.json(room);
  }

  await prisma.roomMember.create({
    data: { roomId: room.id, userId: session.user.id },
  });

  return NextResponse.json(room, { status: 201 });
}
