import { afterEach, describe, expect, it, vi } from "vitest";
import {
  deleteAccount,
  deleteAppUserDataByClerkId,
  deleteClerkUser,
} from "@/lib/delete-account";

const {
  transactionMock,
  clerkClientMock,
  deleteUserMock,
  txMocks,
} = vi.hoisted(() => {
  const txMocks = {
    user: {
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
    notification: {
      deleteMany: vi.fn(),
    },
    application: {
      deleteMany: vi.fn(),
    },
    shiftInvite: {
      deleteMany: vi.fn(),
    },
    companyStaff: {
      deleteMany: vi.fn(),
    },
    license: {
      deleteMany: vi.fn(),
    },
    officer: {
      delete: vi.fn(),
    },
    shift: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    company: {
      delete: vi.fn(),
    },
  };

  const transactionMock = vi.fn(async (callback: (tx: typeof txMocks) => unknown) =>
    callback(txMocks)
  );

  const deleteUserMock = vi.fn();

  const clerkClientMock = vi.fn(async () => ({
    users: {
      deleteUser: deleteUserMock,
    },
  }));

  return {
    transactionMock,
    clerkClientMock,
    deleteUserMock,
    txMocks,
  };
});

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
  },
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: clerkClientMock,
}));

describe("deleteAppUserDataByClerkId", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns not_found when no Prisma user exists", async () => {
    txMocks.user.findUnique.mockResolvedValue(null);

    await expect(deleteAppUserDataByClerkId("clerk-missing")).resolves.toEqual({
      deleted: false,
      reason: "not_found",
    });
  });

  it("deletes officer-related records before the user", async () => {
    const callOrder: string[] = [];

    txMocks.user.findUnique.mockResolvedValue({
      id: "user-1",
      officer: { id: "officer-1" },
      company: null,
    });
    txMocks.notification.deleteMany.mockImplementation(async () => {
      callOrder.push("notifications");
    });
    txMocks.application.deleteMany.mockImplementation(async () => {
      callOrder.push("applications");
    });
    txMocks.shiftInvite.deleteMany.mockImplementation(async () => {
      callOrder.push("shiftInvites");
    });
    txMocks.companyStaff.deleteMany.mockImplementation(async () => {
      callOrder.push("companyStaff");
    });
    txMocks.license.deleteMany.mockImplementation(async () => {
      callOrder.push("licenses");
    });
    txMocks.officer.delete.mockImplementation(async () => {
      callOrder.push("officer");
    });
    txMocks.user.delete.mockImplementation(async () => {
      callOrder.push("user");
    });

    const result = await deleteAppUserDataByClerkId("clerk-officer");

    expect(result).toEqual({ deleted: true, userId: "user-1" });
    expect(callOrder).toEqual([
      "notifications",
      "applications",
      "shiftInvites",
      "companyStaff",
      "licenses",
      "officer",
      "user",
    ]);
  });

  it("deletes company shifts and related records before the user", async () => {
    txMocks.user.findUnique.mockResolvedValue({
      id: "user-2",
      officer: null,
      company: { id: "company-1" },
    });
    txMocks.shift.findMany.mockResolvedValue([{ id: "shift-1" }, { id: "shift-2" }]);

    const result = await deleteAppUserDataByClerkId("clerk-company");

    expect(result).toEqual({ deleted: true, userId: "user-2" });
    expect(txMocks.application.deleteMany).toHaveBeenCalledWith({
      where: { shiftId: { in: ["shift-1", "shift-2"] } },
    });
    expect(txMocks.shiftInvite.deleteMany).toHaveBeenCalledWith({
      where: { shiftId: { in: ["shift-1", "shift-2"] } },
    });
    expect(txMocks.shift.deleteMany).toHaveBeenCalledWith({
      where: { companyId: "company-1" },
    });
    expect(txMocks.companyStaff.deleteMany).toHaveBeenCalledWith({
      where: { companyId: "company-1" },
    });
    expect(txMocks.company.delete).toHaveBeenCalledWith({
      where: { id: "company-1" },
    });
    expect(txMocks.user.delete).toHaveBeenCalledWith({
      where: { id: "user-2" },
    });
  });
});

describe("deleteAccount", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not delete the Clerk user when Prisma cleanup fails", async () => {
    transactionMock.mockRejectedValueOnce(new Error("db failure"));

    await expect(deleteAccount("clerk-1")).rejects.toThrow("db failure");
    expect(deleteUserMock).not.toHaveBeenCalled();
  });

  it("deletes the Clerk user only after Prisma cleanup succeeds", async () => {
    txMocks.user.findUnique.mockResolvedValue({
      id: "user-3",
      officer: { id: "officer-3" },
      company: null,
    });

    const result = await deleteAccount("clerk-3");

    expect(result).toEqual({ deleted: true, userId: "user-3" });
    expect(deleteUserMock).toHaveBeenCalledWith("clerk-3");
  });
});

describe("deleteClerkUser", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("calls Clerk backend deleteUser", async () => {
    await deleteClerkUser("clerk-9");
    expect(deleteUserMock).toHaveBeenCalledWith("clerk-9");
  });
});
