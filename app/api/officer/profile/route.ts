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

  const user = await prisma.user.upsert({
    where: {
      clerkId: clerkUser.id,
    },
    update: {
      email,
      role: UserRole.OFFICER,
    },
    create: {
      clerkId: clerkUser.id,
      email,
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

  if (data.licenseType) {
    const existingLicense = await prisma.license.findFirst({
      where: {
        officerId: officer.id,
      },
    });

    if (existingLicense) {
      await prisma.license.update({
        where: {
          id: existingLicense.id,
        },
        data: {
          licenseType: data.licenseType,
          licenseNumber: "Not provided",
          issuingState: data.state || "Not provided",
        },
      });
    } else {
      await prisma.license.create({
        data: {
          officerId: officer.id,
          licenseType: data.licenseType,
          licenseNumber: "Not provided",
          issuingState: data.state || "Not provided",
        },
      });
    }
  }

  return NextResponse.json(officer);
}