import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { deleteAccount } from "@/lib/delete-account";
import { enforceRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimitResponse = enforceRateLimit({
      request: req,
      clerkUserId: clerkUser.id,
      bucket: "account-delete",
      profile: "strict",
    });

    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const result = await deleteAccount(clerkUser.id);

    if (!result.deleted) {
      return NextResponse.json(
        { error: "Account could not be found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[account/delete] Failed to delete account:", error);

    return NextResponse.json(
      { error: "Account deletion failed. Please try again or contact support." },
      { status: 500 }
    );
  }
}
