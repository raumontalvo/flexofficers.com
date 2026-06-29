"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { ProfileAvatar, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";
import {
  resolveProfilePhotoUrl,
  validateProfilePhotoFile,
} from "@/lib/profile-photo";

const ACCEPTED_IMAGE_TYPES =
  "image/jpeg,image/jpg,image/png,image/webp,.jpg,.jpeg,.png,.webp";

type ProfilePhotoUploadProps = {
  value: string;
  onChange: (url: string) => void;
  previewName: string;
  disabled?: boolean;
  onUploadingChange?: (isUploading: boolean) => void;
  helperText?: string;
  previewShape?: "circle" | "rounded";
};

function getCompanyInitials(name: string) {
  if (!name.trim()) {
    return "CO";
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("") || "CO";
}

function UploadPreview({
  name,
  imageUrl,
  previewShape,
}: {
  name: string;
  imageUrl: string;
  previewShape: "circle" | "rounded";
}) {
  const [hasError, setHasError] = useState(false);
  const showImage = imageUrl.trim().length > 0 && !hasError;
  const shapeClassName =
    previewShape === "circle" ? "rounded-full" : "rounded-2xl";

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  if (!showImage) {
    if (previewShape === "circle") {
      return (
        <ProfileAvatar
          name={name}
          size="xl"
          className="!h-24 !w-24 !text-2xl sm:!h-28 sm:!w-28"
        />
      );
    }

    return (
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-fo-border-strong bg-fo-bg-elevated text-2xl font-bold text-fo-text sm:h-28 sm:w-28">
        {getCompanyInitials(name)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative h-24 w-24 shrink-0 overflow-hidden border-2 border-fo-primary-bright/30 bg-fo-bg-elevated shadow-[0_0_24px_rgba(59,130,246,0.15)] sm:h-28 sm:w-28",
        shapeClassName
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={name ? `${name} photo` : "Profile photo preview"}
        className="h-full w-full object-cover"
        onError={() => setHasError(true)}
      />
    </div>
  );
}

export function ProfilePhotoUpload({
  value,
  onChange,
  previewName,
  disabled = false,
  onUploadingChange,
  helperText = "JPG, PNG, or WEBP. Max 5MB.",
  previewShape = "circle",
}: ProfilePhotoUploadProps) {
  const { isLoaded, user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const clerkImageUrl = user?.imageUrl ?? "";
  const resolvedValue = resolveProfilePhotoUrl(value, clerkImageUrl);
  const displayUrl = localPreviewUrl || resolvedValue;
  const uploadDisabled = disabled || isUploading || !isLoaded || !user;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  useEffect(() => {
    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  async function handleFileSelected(file: File | null) {
    if (!file || uploadDisabled) {
      return;
    }

    if (!user) {
      setUploadError("Sign in to upload a profile photo.");
      return;
    }

    setUploadError(null);

    const validation = validateProfilePhotoFile({
      size: file.size,
      type: file.type,
      name: file.name,
    });

    if (!validation.valid) {
      setUploadError(validation.message);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setLocalPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return objectUrl;
    });

    setIsUploading(true);

    try {
      const imageResource = await user.setProfileImage({ file });
      await user.reload();
      const uploadedUrl =
        imageResource.publicUrl?.trim() ||
        user.imageUrl?.trim() ||
        resolveProfilePhotoUrl(value, user.imageUrl);

      if (!uploadedUrl) {
        setUploadError("Failed to upload photo.");
        setLocalPreviewUrl((current) => {
          if (current) {
            URL.revokeObjectURL(current);
          }

          return null;
        });
        return;
      }

      onChange(uploadedUrl);
      setLocalPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }

        return null;
      });
    } catch {
      setUploadError("Failed to upload photo. Please try again.");
      setLocalPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }

        return null;
      });
    } finally {
      setIsUploading(false);
    }
  }

  function resetInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <UploadPreview
        name={previewName}
        imageUrl={displayUrl}
        previewShape={previewShape}
      />

      <div className="min-w-0 flex-1 space-y-2 sm:pt-1">
        <button
          type="button"
          disabled={uploadDisabled}
          onClick={() => fileInputRef.current?.click()}
          className={buttonClassName({
            variant: "secondary",
            size: "md",
            className: "w-full sm:w-auto",
          })}
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>

        <p className="text-xs text-fo-text-muted">{helperText}</p>

        {uploadError ? (
          <p className="text-xs text-red-400" role="alert">
            {uploadError}
          </p>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          className="hidden"
          onChange={(event) => {
            void handleFileSelected(event.target.files?.[0] ?? null);
            resetInput();
          }}
        />
      </div>
    </div>
  );
}
