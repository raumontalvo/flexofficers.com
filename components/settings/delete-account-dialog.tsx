"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Button, buttonClassName } from "@/components/ui";

type DeleteAccountDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function DeleteAccountDialog({ open, onClose }: DeleteAccountDialogProps) {
  const { t } = useLandingLanguage();
  const copy = t.settings.deleteDialog;
  const { signOut } = useClerk();
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      setErrorMessage(null);
      setIsDeleting(false);
      return;
    }

    cancelRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  async function handleConfirmDelete() {
    setErrorMessage(null);
    setIsDeleting(true);

    try {
      const response = await fetch("/api/account/delete", {
        method: "POST",
      });

      const data = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;

      if (!response.ok) {
        setErrorMessage(data?.error || copy.error);
        return;
      }

      onClose();
      await signOut({ redirectUrl: "/" });
    } catch {
      setErrorMessage(copy.error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label={copy.closeAria}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-title"
        className="relative w-full max-w-md rounded-2xl border border-red-500/30 bg-[#0a1220]/95 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
      >
        <h2 id="delete-account-title" className="text-lg font-semibold text-fo-text">
          {copy.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-fo-text-muted">
          {copy.description}
        </p>

        {errorMessage ? (
          <p className="mt-3 text-sm text-red-300">{errorMessage}</p>
        ) : null}

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className={buttonClassName({
              variant: "secondary",
              size: "md",
            })}
          >
            {copy.cancel}
          </button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={isDeleting}
            onClick={handleConfirmDelete}
            className="bg-red-600 hover:bg-red-500"
          >
            {isDeleting ? copy.deleting : copy.confirm}
          </Button>
        </div>
      </div>
    </div>
  );
}
