import { describe, expect, it } from "vitest";
import {
  normalizePhotoUrl,
  resolveSyncedPhotoUrl,
  shouldSyncClerkPhoto,
} from "@/lib/clerk-photo-sync";

describe("clerk photo sync helpers", () => {
  it("normalizes empty photo urls to null", () => {
    expect(normalizePhotoUrl("")).toBeNull();
    expect(normalizePhotoUrl("  https://example.com/a.jpg  ")).toBe(
      "https://example.com/a.jpg"
    );
  });

  it("syncs when stored photo is missing or different from Clerk", () => {
    expect(
      shouldSyncClerkPhoto(null, "https://clerk.example/photo.jpg")
    ).toBe(true);
    expect(
      shouldSyncClerkPhoto(
        "https://old.example/photo.jpg",
        "https://clerk.example/photo.jpg"
      )
    ).toBe(true);
    expect(
      shouldSyncClerkPhoto(
        "https://clerk.example/photo.jpg",
        "https://clerk.example/photo.jpg"
      )
    ).toBe(false);
    expect(shouldSyncClerkPhoto("https://stored.example/photo.jpg", null)).toBe(
      false
    );
  });

  it("resolves synced photo url from Clerk when needed", () => {
    expect(
      resolveSyncedPhotoUrl(null, "https://clerk.example/photo.jpg")
    ).toBe("https://clerk.example/photo.jpg");

    expect(
      resolveSyncedPhotoUrl(
        "https://stored.example/photo.jpg",
        "https://clerk.example/photo.jpg"
      )
    ).toBe("https://clerk.example/photo.jpg");

    expect(
      resolveSyncedPhotoUrl(
        "https://stored.example/photo.jpg",
        "https://stored.example/photo.jpg"
      )
    ).toBe("https://stored.example/photo.jpg");
  });
});
