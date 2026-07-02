"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { US_STATES } from "@/lib/license-options";
import { buttonClassName, Card } from "@/components/ui";

const SECURITY_LEAD_PRICE_CENTS = 500;

const fieldClassName =
  "min-h-11 w-full rounded-lg border border-fo-border bg-fo-bg/80 px-3 py-2.5 text-sm text-fo-text placeholder:text-fo-text-subtle focus:border-fo-primary-bright/50 focus:outline-none focus:ring-2 focus:ring-fo-primary-bright/20";

export function CreateSecurityLeadForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/client/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create lead.");
        setIsSubmitting(false);
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      router.push("/client/leads");
      router.refresh();
    } catch {
      setError("Failed to create lead.");
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="fo-glass-card border border-white/10 p-4 sm:p-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-1.5 sm:col-span-1">
            <span className="text-sm font-medium text-fo-text">Contact Name</span>
            <input name="contactName" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5 sm:col-span-1">
            <span className="text-sm font-medium text-fo-text">Company Name (optional)</span>
            <input name="companyName" className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Email</span>
            <input name="email" type="email" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Phone</span>
            <input name="phone" type="tel" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-fo-text">Service Needed</span>
            <input name="serviceNeeded" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-fo-text">Address</span>
            <input name="address" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">City</span>
            <input name="city" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">State</span>
            <select name="state" required className={fieldClassName}>
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Date Needed</span>
            <input name="dateNeeded" type="date" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Start Time</span>
            <input name="startTime" type="datetime-local" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">End Time</span>
            <input name="endTime" type="datetime-local" required className={fieldClassName} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Officers Needed</span>
            <input
              name="officersNeeded"
              type="number"
              min={1}
              defaultValue={1}
              required
              className={fieldClassName}
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Budget Offer</span>
            <input name="budgetOffer" required className={fieldClassName} placeholder="$500" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-fo-text">Urgency</span>
            <select name="urgency" defaultValue="STANDARD" className={fieldClassName}>
              <option value="STANDARD">Standard</option>
              <option value="URGENT">Urgent</option>
            </select>
          </label>
          <label className="block space-y-1.5 sm:col-span-2">
            <span className="text-sm font-medium text-fo-text">Description</span>
            <textarea
              name="description"
              required
              rows={4}
              className={`${fieldClassName} min-h-28 resize-y`}
            />
          </label>
        </div>

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
          <p className="text-sm font-semibold text-fo-primary-hover">
            Posting fee: ${(SECURITY_LEAD_PRICE_CENTS / 100).toFixed(2)}
          </p>
          <p className="mt-1 text-sm text-fo-text-muted">
            Your lead will be published after successful Stripe payment. Public leads are visible to
            verified security companies only.
          </p>
        </div>

        {error ? <p className="text-sm text-red-300">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className={buttonClassName({ size: "lg", className: "w-full sm:w-auto" })}
        >
          {isSubmitting ? "Processing..." : "Continue to Payment"}
        </button>
      </form>
    </Card>
  );
}
