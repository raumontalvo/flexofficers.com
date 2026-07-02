"use client";

import { useState, type ReactNode } from "react";
import {
  IconCalendar,
  IconMail,
  IconPhone,
  IconShield,
  IconUsers,
} from "@/components/landing/icons";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { buttonClassName, Card } from "@/components/ui";
import { cn } from "@/lib/cn";

const contactCardClass = cn(
  "landing-card-lift h-full rounded-2xl border border-blue-500/20",
  "bg-gradient-to-b from-[#0c1424]/95 via-fo-bg-elevated/85 to-[#070d18]/95",
  "p-6 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition sm:rounded-3xl sm:p-8",
  "hover:border-blue-500/35 hover:shadow-[0_16px_48px_-12px_rgba(37,99,235,0.28)]"
);

const fieldClassName =
  "min-h-11 w-full rounded-xl border border-blue-500/20 bg-[#070d18]/80 px-4 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-blue-500/40 focus:outline-none focus:ring-2 focus:ring-blue-500/20";

function ContactIconBox({
  icon: Icon,
}: {
  icon: typeof IconMail;
}) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright shadow-[0_0_16px_-4px_rgba(37,99,235,0.35)]">
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </div>
  );
}

function ContactInfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof IconMail;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <ContactIconBox icon={Icon} />
      <div className="min-w-0">
        <p className="text-sm font-semibold text-fo-text">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-fo-text-muted">{children}</div>
      </div>
    </div>
  );
}

export function ContactPageContent() {
  const { t } = useLandingLanguage();
  const contact = t.legalPages.contact;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    const formElement = event.currentTarget;

    const form = new FormData(formElement);
    const payload = {
      fullName: String(form.get("fullName") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      subject: String(form.get("subject") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
    };

    if (!payload.fullName || !payload.email || !payload.subject || !payload.message) {
      setFeedback({ type: "error", message: contact.form.error });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setFeedback({
          type: "error",
          message: data.error ?? contact.form.error,
        });
        return;
      }

      setFeedback({ type: "success", message: contact.form.success });
      formElement.reset();
    } catch {
      setFeedback({ type: "error", message: contact.form.error });
    } finally {
      setIsSubmitting(false);
    }
  }

  const phoneHref = `tel:${contact.getInTouch.phone.replace(/\D/g, "")}`;

  return (
    <main className="relative min-h-screen overflow-x-clip bg-gradient-to-b from-[#050a14] via-fo-bg to-[#0a1220] text-fo-text">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(37,99,235,0.16),transparent_70%)]"
        aria-hidden="true"
      />

      <LandingNavbar useHomeAnchors />

      <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:pt-20">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-fo-text sm:text-4xl lg:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-fo-text-muted sm:text-lg sm:leading-8">
            {contact.subtitle}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          <Card padding="none" variant="elevated" className={contactCardClass}>
            <h2 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
              {contact.getInTouch.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fo-text-muted sm:text-base">
              {contact.getInTouch.intro}
            </p>

            <div className="mt-8 space-y-6">
              <ContactInfoRow icon={IconMail} label={contact.getInTouch.emailLabel}>
                <a
                  href={`mailto:${contact.getInTouch.email}`}
                  className="font-medium text-fo-primary-hover transition hover:text-fo-primary-bright"
                >
                  {contact.getInTouch.email}
                </a>
              </ContactInfoRow>

              <ContactInfoRow icon={IconPhone} label={contact.getInTouch.phoneLabel}>
                <a
                  href={phoneHref}
                  className="font-medium text-fo-primary-hover transition hover:text-fo-primary-bright"
                >
                  {contact.getInTouch.phone}
                </a>
              </ContactInfoRow>

              <ContactInfoRow icon={IconCalendar} label={contact.getInTouch.hoursLabel}>
                <div className="space-y-0.5">
                  {contact.getInTouch.hoursLines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </ContactInfoRow>

              <ContactInfoRow icon={IconUsers} label={contact.getInTouch.supportForLabel}>
                <p>{contact.getInTouch.supportFor}</p>
              </ContactInfoRow>
            </div>
          </Card>

          <Card padding="none" variant="elevated" className={contactCardClass}>
            <h2 className="text-xl font-bold tracking-tight text-fo-text sm:text-2xl">
              {contact.form.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-fo-text-muted sm:text-base">
              {contact.form.description}
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-fo-text">
                  {contact.form.fullNameLabel}
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={contact.form.fullNamePlaceholder}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-fo-text">
                  {contact.form.emailLabel}
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={contact.form.emailPlaceholder}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-fo-text">
                  {contact.form.subjectLabel}
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  placeholder={contact.form.subjectPlaceholder}
                  className={fieldClassName}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-fo-text">
                  {contact.form.messageLabel}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder={contact.form.messagePlaceholder}
                  className={cn(fieldClassName, "min-h-[140px] resize-y py-3")}
                />
              </div>

              {feedback ? (
                <p
                  className={cn(
                    "rounded-xl border px-4 py-3 text-sm",
                    feedback.type === "success"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-300"
                      : "border-red-500/25 bg-red-500/10 text-red-300"
                  )}
                  role="status"
                >
                  {feedback.message}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={isSubmitting}
                className={buttonClassName({
                  size: "lg",
                  fullWidth: true,
                  className:
                    "w-full shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)] disabled:opacity-60",
                })}
              >
                {isSubmitting ? contact.form.submitting : contact.form.submit}
              </button>
            </form>
          </Card>
        </div>

        <Card
          padding="none"
          variant="muted"
          className="mt-8 flex items-start gap-4 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] sm:mt-10 sm:rounded-3xl sm:p-6"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-fo-primary-bright">
            <IconShield className="h-5 w-5" strokeWidth={1.75} />
          </div>
          <p className="text-sm leading-relaxed text-fo-text-muted sm:text-base sm:leading-7">
            {contact.commitment}
          </p>
        </Card>
      </div>

      <LandingFooter />
    </main>
  );
}
