import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const user = await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      email,
      role: UserRole.COMPANY,
    },
    create: {
      clerkId: clerkUser.id,
      email,
      role: UserRole.COMPANY,
    },
  });

  const company = await prisma.company.upsert({
    where: { userId: user.id },
    update: {
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      website: data.website,
      city: data.city,
      state: data.state,
      description: data.description,
    },
    create: {
      userId: user.id,
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      website: data.website,
      city: data.city,
      state: data.state,
      description: data.description,
    },
  });

  return NextResponse.json(company);
}