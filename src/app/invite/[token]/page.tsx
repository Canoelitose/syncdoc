import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const session = await auth();
  const { token } = await params;

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/invite/${token}`);
  }

  const room = await prisma.room.findUnique({
    where: { inviteToken: token },
  });

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Invalid Invite Link</h1>
          <p className="text-gray-600">This invite link is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  const existingMember = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: { roomId: room.id, userId: session.user.id },
    },
  });

  if (!existingMember) {
    await prisma.roomMember.create({
      data: { roomId: room.id, userId: session.user.id },
    });
  }

  redirect(`/room/${room.id}`);
}
