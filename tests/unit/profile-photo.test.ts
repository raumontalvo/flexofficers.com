import { describe, expect, it } from "vitest";
import {
  PROFILE_PHOTO_MAX_BYTES,
  getProfilePhotoExtension,
  resolveProfilePhotoUrl,
  validateProfilePhotoFile,
} from "@/lib/profile-photo";

describe("profile photo helpers", () => {
  it("prefers stored profile photo over Clerk image", () => {
    expect(
      resolveProfilePhotoUrl("https://example.com/stored.jpg", "https://clerk/img.jpg")
    ).toBe("https://example.com/stored.jpg");
  });

  it("falls back to Clerk image when stored photo is empty", () => {
    expect(resolveProfilePhotoUrl("", "https://clerk/img.jpg")).toBe(
      "https://clerk/img.jpg"
    );
  });

  it("accepts supported image types within size limit", () => {
    const result = validateProfilePhotoFile({
      size: 1024,
      type: "image/png",
      name: "avatar.png",
    });

    expect(result).toEqual({ valid: true, extension: "png" });
  });

  it("rejects files larger than 5MB", () => {
    const result = validateProfilePhotoFile({
      size: PROFILE_PHOTO_MAX_BYTES + 1,
      type: "image/jpeg",
      name: "large.jpg",
    });

    expect(result).toEqual({
      valid: false,
      message: "Image must be 5MB or smaller.",
    });
  });

  it("normalizes jpeg extensions", () => {
    expect(getProfilePhotoExtension("photo.jpeg", "image/jpeg")).toBe("jpg");
  });
});
