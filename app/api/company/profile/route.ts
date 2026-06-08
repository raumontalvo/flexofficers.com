import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    return NextResponse.json({ error: "Email not found" }, { status: 400 });
  }

  const data = await req.json();

  const existingUser = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
    select: {
      id: true,
      role: true,
    },
  });

  if (existingUser?.role === UserRole.OFFICER) {
    return NextResponse.json(
      { error: "Officer accounts cannot create or update company profiles." },
      { status: 403 }
    );
  }

  if (existingUser?.role && existingUser.role !== UserRole.COMPANY) {
    return NextResponse.json(
      { error: "Only company accounts can create or update company profiles." },
      { status: 403 }
    );
  }

  const user = existingUser
    ? await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          email,
        },
      })
    : await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email,
          role: UserRole.COMPANY,
        },
      });

  const company = await prisma.company.upsert({
    where: {
      userId: user.id,
    },
    update: {
      companyName: data.companyName,
      contactName: data.contactName,
      phone: data.phone,
      website: data.website,
      city: data.city,
      state: data.state,
      description: data.description,
      licenseType: data.licenseType,
      licenseNumber: data.licenseNumber,
      licenseState: data.licenseState,
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
      licenseType: data.licenseType,
      licenseNumber: data.licenseNumber,
      licenseState: data.licenseState,
    },
  });

  return NextResponse.json(company);
}