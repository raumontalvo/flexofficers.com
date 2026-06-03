import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const data = await req.json();

  const user = await prisma.user.upsert({
    where: {
      clerkId: "test-officer-user",
    },
    update: {
      email: "test-officer@flexofficers.com",
      role: UserRole.OFFICER,
    },
    create: {
      clerkId: "test-officer-user",
      email: "test-officer@flexofficers.com",
      role: UserRole.OFFICER,
    },
  });

  const officer = await prisma.officer.upsert({
    where: {
      userId: user.id,
    },
    update: {
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      bio: data.bio,
    },
    create: {
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      city: data.city,
      state: data.state,
      bio: data.bio,
    },
  });

  return NextResponse.json(officer);
}