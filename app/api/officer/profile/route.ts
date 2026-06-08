import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

type LicenseInput = {
  licenseType?: string;
  licenseNumber?: string;
  issuingState?: string;
};

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

  if (existingUser?.role === UserRole.COMPANY) {
    return NextResponse.json(
      { error: "Company accounts cannot create or update officer profiles." },
      { status: 403 }
    );
  }

  if (existingUser?.role && existingUser.role !== UserRole.OFFICER) {
    return NextResponse.json(
      { error: "Only officer accounts can create or update officer profiles." },
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

  await prisma.license.deleteMany({
    where: {
      officerId: officer.id,
    },
  });

  const licenses: LicenseInput[] = Array.isArray(data.licenses)
    ? data.licenses
    : [];

  const validLicenses = licenses.filter(
    (license: LicenseInput) =>
      license.licenseType?.trim() ||
      license.licenseNumber?.trim() ||
      license.issuingState?.trim()
  );

  if (validLicenses.length > 0) {
    await prisma.license.createMany({
      data: validLicenses.map((license: LicenseInput) => ({
        officerId: officer.id,
        licenseType: license.licenseType || "Not provided",
        licenseNumber: license.licenseNumber || "Not provided",
        issuingState: license.issuingState || "Not provided",
      })),
    });
  }

  return NextResponse.json(officer);
}