import { HeroBadge } from "@/components/landing/HeroBadge";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { FlexOfficersLogoLink } from "@/components/brand";
import Link from "next/link";
import {
  AcceptedPreview,
  ApplicantsPreview,
  BrowsePreview,
  DashboardPreview,
  HirePreview,
  ManageShiftsPreview,
  MyShiftsPreview,
  OfficerSearchPreview,
  ShiftDetailPreview,
} from "@/components/landing/AppPreviews";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { FlowArrow } from "@/components/landing/FlowArrow";
import {
  IconCalendar,
  IconCard,
  IconCheck,
  IconClock,
  IconGift,
  IconLayout,
  IconPhone,
  IconSearch,
  IconShield,
  IconSpark,
  IconUsers,
  IconZap,
} from "@/components/landing/icons";
import { LandingEyebrow, LandingHeading } from "@/components/landing/LandingHeading";
import { PhoneFrame } from "@/components/landing/PhoneFrame";
import { buttonClassName, Card, CardDescription, CardTitle } from "@/components/ui";
import { cn } from "@/lib/cn";

const companyFeatures = [
  {
    title: "Unlimited Shift Postings",
    description: "Publish open shifts whenever you need coverage.",
    icon: IconCalendar,
  },
  {
    title: "Review Officer Profiles",
    description: "See experience, availability, and qualifications before you hire.",
    icon: IconUsers,
  },
  {
    title: "Search Qualified Officers",
    description: "Filter by city, experience, certifications, and more.",
    icon: IconSearch,
  },
  {
    title: "Fill Open Shifts Faster",
    description: "Connect with officers ready to work on short notice.",
    icon: IconZap,
  },
  {
    title: "Unlimited Hiring",
    description: "Accept as many officers as your shifts require.",
    icon: IconShield,
  },
  {
    title: "Annual Subscription",
    description: "One simple plan for unlimited platform usage.",
    icon: IconCard,
  },
];

const officerFeatures = [
  {
    title: "Apply For Free",
    description: "Officers never pay to browse or apply for shifts.",
    icon: IconGift,
  },
  {
    title: "Browse Unlimited Shifts",
    description: "Find opportunities that match your schedule and experience.",
    icon: IconLayout,
  },
  {
    title: "Flexible Schedule",
    description: "Pick up shifts when and where you want to work.",
    icon: IconClock,
  },
  {
    title: "Accepted Shift Details",
    description: "See reporting instructions and shift details in one place.",
    icon: IconCheck,
  },
  {
    title: "Contact Companies After Acceptance",
    description: "Company contact info unlocks once you are accepted.",
    icon: IconPhone,
  },
  {
    title: "Free Forever",
    description: "FlexOfficers is free for security officers.",
    icon: IconSpark,
  },
];

const planFeatures = [
  "Unlimited Shift Postings",
  "Unlimited Officer Applications",
  "Unlimited Hiring",
  "Unlimited Officer Search",
  "Unlimited Platform Usage",
  "No Commission Fees",
];

const landingCardClass =
  "landing-card-lift border-white/[0.04] bg-fo-surface/35 p-8 shadow-[0_16px_48px_-28px_rgba(0,0,0,0.65)]";

function StepCard({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <Card
      variant="elevated"
      className={cn(landingCardClass, "text-center")}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fo-primary-hover">
        {step}
      </p>
      <CardTitle className="mt-4 text-2xl font-semibold tracking-tight">
        {title}
      </CardTitle>
      <CardDescription className="mt-4 text-base leading-relaxed text-fo-text-subtle">
        {description}
      </CardDescription>
    </Card>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-fo-bg text-fo-text">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="landing-hero-glow absolute inset-0" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 sm:py-32 lg:py-40">
          <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20 xl:gap-28">
            <div className="landing-fade-up max-w-xl pb-[max(2rem,env(safe-area-inset-bottom,0px))] lg:pb-0">
              <HeroBadge />
              <LandingEyebrow>Security staffing marketplace</LandingEyebrow>
              <h1 className="mt-6 text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl xl:text-[4.75rem]">
                The Modern Workforce Platform for Security Companies & Security
                Officers
              </h1>
              <p className="mt-8 max-w-lg text-xl leading-8 text-fo-text-muted/90 sm:text-2xl sm:leading-9">
                Post shifts, discover qualified security officers, and fill open
                positions faster—all from one platform.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  href="/onboarding?force=1"
                  className={buttonClassName({
                    size: "lg",
                    fullWidth: true,
                    className: "sm:w-auto sm:min-w-[200px] shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]",
                  })}
                >
                  Get Started
                </Link>
                <Link
                  href="/sign-in"
                  className={buttonClassName({
                    variant: "secondary",
                    size: "lg",
                    fullWidth: true,
                    className: "sm:w-auto border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]",
                  })}
                >
                  Sign In
                </Link>
              </div>
            </div>

            <div
              className="landing-fade-up grid grid-cols-2 gap-8 sm:gap-10 lg:gap-12 xl:gap-14"
              style={{ animationDelay: "120ms" }}
            >
              <PhoneFrame label="Officer Browse" style={{ animationDelay: "180ms" }}>
                <BrowsePreview />
              </PhoneFrame>
              <PhoneFrame
                label="Company Dashboard"
                className="mt-10 sm:mt-14 lg:mt-20"
                style={{ animationDelay: "260ms" }}
              >
                <DashboardPreview />
              </PhoneFrame>
              <PhoneFrame label="Applicants" style={{ animationDelay: "340ms" }}>
                <ApplicantsPreview />
              </PhoneFrame>
              <PhoneFrame
                label="Accepted Shift"
                className="mt-10 sm:mt-14 lg:mt-20"
                style={{ animationDelay: "420ms" }}
              >
                <AcceptedPreview />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-white/[0.06] bg-fo-bg-elevated/30 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <LandingHeading
            title="How FlexOfficers Works"
            subtitle="From signup to staffed shifts in three clear steps."
            align="center"
            className="landing-fade-up"
          />

          <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
            <StepCard
              step="Step 1"
              title="Choose Your Role"
              description="Security Company or Security Officer—pick the path that fits you."
            />
            <StepCard
              step="Step 2"
              title="Complete Your Profile"
              description="Build a professional company or officer profile."
            />
            <StepCard
              step="Step 3"
              title="Connect"
              description="Companies post shifts. Officers apply. Companies verify credentials through their own hiring process."
            />
          </div>
        </div>
      </section>

      {/* Companies */}
      <section
        id="companies"
        className="mx-auto max-w-7xl px-5 py-28 sm:px-8 sm:py-36"
      >
        <LandingHeading
          title="Built For Security Companies"
          subtitle="Everything you need to staff shifts without commission fees."
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {companyFeatures.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* Officers */}
      <section
        id="officers"
        className="border-t border-white/[0.06] bg-fo-bg-elevated/30 px-5 py-28 sm:px-8 sm:py-36"
      >
        <div className="mx-auto max-w-7xl">
          <LandingHeading
            title="Built For Security Officers"
            subtitle="Find work on your terms—always free."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {officerFeatures.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* In action */}
      <section className="relative overflow-hidden px-5 py-32 sm:px-8 sm:py-40">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl">
          <LandingHeading
            title="See FlexOfficers In Action"
            subtitle="The real product flow—from browse to hire."
            align="center"
            titleClassName="lg:text-7xl"
          />

          <div className="mt-20 grid gap-20 lg:grid-cols-2 lg:gap-16 xl:gap-24">
            <div>
              <h3 className="text-center text-2xl font-semibold tracking-tight text-fo-text">
                Officer Flow
              </h3>
              <div className="mt-10 flex flex-col items-center">
                <PhoneFrame size="showcase" label="Browse">
                  <BrowsePreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="View Shift">
                  <ShiftDetailPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Apply">
                  <ShiftDetailPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="My Shifts">
                  <MyShiftsPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Accepted Shift">
                  <AcceptedPreview />
                </PhoneFrame>
              </div>
            </div>

            <div>
              <h3 className="text-center text-2xl font-semibold tracking-tight text-fo-text">
                Company Flow
              </h3>
              <div className="mt-10 flex flex-col items-center">
                <PhoneFrame size="showcase" label="Dashboard">
                  <DashboardPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Manage Shifts">
                  <ManageShiftsPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Applicants">
                  <ApplicantsPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Officer Search">
                  <OfficerSearchPreview />
                </PhoneFrame>
                <FlowArrow />
                <PhoneFrame size="showcase" label="Hire Officer">
                  <HirePreview />
                </PhoneFrame>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="relative border-t border-white/[0.06] px-5 py-32 sm:px-8 sm:py-40"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(37,99,235,0.14),transparent_70%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-2xl">
          <LandingHeading
            title="Simple Pricing"
            subtitle="One plan for companies. Free for officers."
            align="center"
          />

          <Card
            variant="elevated"
            className={cn(
              landingCardClass,
              "mt-14 space-y-8 p-10 shadow-[0_32px_80px_-36px_rgba(37,99,235,0.3)] sm:p-12"
            )}
          >
            <div className="text-center">
              <LandingEyebrow>Annual plan</LandingEyebrow>
              <CardTitle className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                FlexOfficers Company Plan
              </CardTitle>
              <p className="mt-10 text-8xl font-bold tracking-tighter text-fo-primary-bright sm:text-9xl">
                $599
                <span className="ml-1 text-3xl font-semibold tracking-tight text-fo-text-muted sm:text-4xl">
                  /year
                </span>
              </p>
            </div>

            <ul className="space-y-4">
              {planFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-4 text-base text-fo-text-muted"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fo-primary/15 text-xs font-bold text-fo-primary-hover">
                    ✓
                  </span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/onboarding?force=1"
              className={buttonClassName({
                size: "lg",
                fullWidth: true,
                className:
                  "w-full shadow-[0_20px_40px_-16px_rgba(37,99,235,0.55)] transition hover:shadow-[0_24px_48px_-14px_rgba(37,99,235,0.65)]",
              })}
            >
              Get Started
            </Link>
          </Card>

          <p className="mt-12 text-center text-xl font-semibold tracking-tight text-fo-success sm:text-2xl">
            Security Officers Join Free
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-5 py-32 text-center sm:px-8 sm:py-44">
        <h2 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          Start Filling Shifts Today
        </h2>
        <Link
          href="/onboarding?force=1"
          className={buttonClassName({
            size: "lg",
            className: cn(
              "mt-12 inline-flex min-w-[240px] px-10",
              "shadow-[0_24px_48px_-16px_rgba(37,99,235,0.6)] transition hover:shadow-[0_28px_56px_-14px_rgba(37,99,235,0.7)]"
            ),
          })}
        >
          Get Started
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 text-sm text-fo-text-subtle sm:px-8 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <FlexOfficersLogoLink href="/" height={40} />
            <p>© {new Date().getFullYear()} FlexOfficers</p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="transition hover:text-fo-text-muted">
              Privacy
            </a>
            <a href="#" className="transition hover:text-fo-text-muted">
              Terms
            </a>
            <a
              href="mailto:hello@flexofficers.com"
              className="transition hover:text-fo-text-muted"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
