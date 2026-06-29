import { NextResponse } from "next/server";
import {
  isShiftReminderJobAuthorized,
  processShiftReminders,
} from "@/lib/reminders/process-shift-reminders";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  if (!isShiftReminderJobAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processShiftReminders(prisma);

    console.log("[shift-reminders]", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("[shift-reminders] Failed to process shift reminders", error);
    return NextResponse.json(
      { error: "Failed to process shift reminders" },
      { status: 500 }
    );
  }
}
