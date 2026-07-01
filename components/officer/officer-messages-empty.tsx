"use client";

import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { Card } from "@/components/ui";

export function OfficerMessagesEmpty() {
  const { t } = useLandingLanguage();

  return (
    <Card variant="muted" className="fo-glass-card mt-8 text-center">
      <p className="text-lg font-medium text-fo-text">{t.commonExtras.noMessagesYet}</p>
      <p className="mt-2 text-sm text-fo-text-muted">
        {t.commonExtras.messagesEmptyDescription}
      </p>
    </Card>
  );
}
