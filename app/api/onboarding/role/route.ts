import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { role } = await req.json();

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json(
      { error: "Email not found" },
      { status: 400 }
    );
  }

  await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      role,
      email,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      role,
    },
  });

  return NextResponse.json({ success: true });
}