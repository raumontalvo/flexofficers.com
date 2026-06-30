import { afterEach, describe, expect, it, vi } from "vitest";
import {
  normalizeEmail,
  resolveOfficerNotificationEmail,
  resolveOfficerProfileEmail,
  syncUserEmailFromClerk,
} from "@/lib/clerk-email-sync";

const { clerkClientMock, prismaUserUpdateMock } = vi.hoisted(() => ({
  clerkClientMock: vi.fn(),
  prismaUserUpdateMock: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: clerkClientMock,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: prismaUserUpdateMock,
    },
  },
}));

describe("clerk email sync", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("prefers the profile email stored on the user account", () => {
    expect(
      resolveOfficerProfileEmail("officer@profile.test", "other@clerk.test")
    ).toBe("officer@profile.test");
  });

  it("uses the stored profile email for invite notifications", async () => {
    const email = await resolveOfficerNotificationEmail({
      userId: "user-1",
      clerkId: "clerk-1",
      storedEmail: "officer@profile.test",
    });

    expect(email).toBe("officer@profile.test");
    expect(clerkClientMock).not.toHaveBeenCalled();
  });

  it("falls back to Clerk and stores it when profile email is missing", async () => {
    clerkClientMock.mockResolvedValue({
      users: {
        getUser: vi.fn().mockResolvedValue({
          primaryEmailAddressId: "email-1",
          emailAddresses: [
            {
              id: "email-1",
              emailAddress: "officer@clerk.test",
            },
          ],
        }),
      },
    });
    prismaUserUpdateMock.mockResolvedValue({
      id: "user-1",
      email: "officer@clerk.test",
    });

    const email = await resolveOfficerNotificationEmail({
      userId: "user-1",
      clerkId: "clerk-1",
      storedEmail: "",
    });

    expect(email).toBe("officer@clerk.test");
    expect(prismaUserUpdateMock).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { email: "officer@clerk.test" },
    });
  });

  it("syncs only when the stored profile email is empty", async () => {
    prismaUserUpdateMock.mockResolvedValue({
      id: "user-2",
      email: "officer@clerk.test",
    });

    await syncUserEmailFromClerk({
      userId: "user-2",
      storedEmail: "",
      clerkEmail: "officer@clerk.test",
    });

    expect(prismaUserUpdateMock).toHaveBeenCalledOnce();

    prismaUserUpdateMock.mockClear();

    await syncUserEmailFromClerk({
      userId: "user-2",
      storedEmail: "officer@profile.test",
      clerkEmail: "officer@clerk.test",
    });

    expect(prismaUserUpdateMock).not.toHaveBeenCalled();
    expect(normalizeEmail(" officer@profile.test ")).toBe("officer@profile.test");
  });
});
