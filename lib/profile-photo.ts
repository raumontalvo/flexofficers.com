export const PROFILE_PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export const PROFILE_PHOTO_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const PROFILE_PHOTO_ALLOWED_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "webp",
] as const;

export type ProfilePhotoFileInput = {
  size: number;
  type: string;
  name: string;
};

export function resolveProfilePhotoUrl(
  storedPhotoUrl: string | null | undefined,
  clerkImageUrl: string | null | undefined
) {
  const stored = storedPhotoUrl?.trim();
  if (stored) {
    return stored;
  }

  return clerkImageUrl?.trim() ?? "";
}

export function getProfilePhotoExtension(
  fileName: string,
  mimeType: string
): string | null {
  const extension = fileName.split(".").pop()?.toLowerCase();

  if (
    extension &&
    PROFILE_PHOTO_ALLOWED_EXTENSIONS.includes(
      extension as (typeof PROFILE_PHOTO_ALLOWED_EXTENSIONS)[number]
    )
  ) {
    return extension === "jpeg" ? "jpg" : extension;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export function validateProfilePhotoFile(file: ProfilePhotoFileInput) {
  if (file.size <= 0) {
    return {
      valid: false as const,
      message: "Choose an image file to upload.",
    };
  }

  if (file.size > PROFILE_PHOTO_MAX_BYTES) {
    return {
      valid: false as const,
      message: "Image must be 5MB or smaller.",
    };
  }

  if (
    !PROFILE_PHOTO_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof PROFILE_PHOTO_ALLOWED_MIME_TYPES)[number]
    )
  ) {
    return {
      valid: false as const,
      message: "Only JPG, PNG, and WEBP images are allowed.",
    };
  }

  const extension = getProfilePhotoExtension(file.name, file.type);

  if (!extension) {
    return {
      valid: false as const,
      message: "Only JPG, PNG, and WEBP images are allowed.",
    };
  }

  return { valid: true as const, extension };
}
