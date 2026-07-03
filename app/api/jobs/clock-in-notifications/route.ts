import { NextResponse } from "next/server";
import {
  isClockInNotificationJobAuthorized,
  processClockInNotifications,
} from "@/lib/reminders/process-clock-in-notifications";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isClockInNotificationJobAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processClockInNotifications(prisma);

    console.log("[clock-in-notifications]", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "[clock-in-notifications] Failed to process clock-in notifications",
      error
    );
    return NextResponse.json(
      { error: "Failed to process clock-in notifications" },
      { status: 500 }
    );
  }
}
