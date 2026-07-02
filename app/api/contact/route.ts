import { NextResponse } from "next/server";
import {
  isContactEmailConfigured,
  sendContactMessage,
} from "@/lib/send-contact-message";

type ContactBody = {
  fullName?: string;
  email?: string;
  subject?: string;
  message?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const fullName = body.fullName?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const subject = body.subject?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!fullName) {
    return NextResponse.json({ error: "Full name is required." }, { status: 400 });
  }

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
  }

  if (!subject) {
    return NextResponse.json({ error: "Subject is required." }, { status: 400 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  if (!isContactEmailConfigured()) {
    return NextResponse.json(
      { error: "Contact email is not configured." },
      { status: 503 }
    );
  }

  let result;

  try {
    result = await sendContactMessage({ fullName, email, subject, message });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later or email us directly." },
      { status: 500 }
    );
  }

  if (!result.ok) {
    return NextResponse.json(
      { error: "Something went wrong. Please try again later or email us directly." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, delivered: result.delivered });
}
