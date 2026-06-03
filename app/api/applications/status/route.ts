import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ApplicationStatus } from "@/app/generated/prisma/enums";

export async function POST(req: Request) {
  try {
    const { applicationId, status } = await req.json();

    const application = await prisma.application.update({
      where: {
        id: applicationId,
      },
      data: {
        status: status as ApplicationStatus,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update application" },
      { status: 500 }
    );
  }
}