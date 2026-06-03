import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  const data = await req.json();

  const user = await prisma.user.upsert({
    where: {
      clerkId: "test-company-user",
    },
    update: {
      email: "test-company@flexofficers.com",
      role: UserRole.COMPANY,
    },
    create: {
      clerkId: "test-company-user",
      email: "test-company@flexofficers.com",
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