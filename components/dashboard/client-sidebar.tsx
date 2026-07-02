"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { FlexOfficersBadge } from "@/components/brand";
import { getClientSidebarSections } from "@/lib/nav-items";
import { useLandingLanguage } from "@/components/landing/landing-language-context";
import { ProfileAvatar, buttonClassName } from "@/components/ui";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string, match?: (pathname: string) => boolean) {
  if (match) {
    return match(pathname);
  }

  const baseHref = href.split("#")[0];
  return pathname === baseHref || pathname.startsWith(`${baseHref}/`);
}

export function ClientSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { t } = useLandingLanguage();
  const nav = t.appNav;
  const sidebarLabels = t.client.sidebar;
  const sections = getClientSidebarSections(sidebarLabels, nav.clientSidebar);

  const displayName =
    user?.fullName?.trim() ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    nav.clientFallback;
  const email = user?.primaryEmailAddress?.emailAddress ?? "";
  const imageUrl = user?.imageUrl ?? null;

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden h-screen min-h-screen w-[250px] flex-col border-r border-slate-800/90 bg-[#040a14]/98 backdrop-blur-xl md:flex">
      <div className="border-b border-white/[0.06] px-3 py-3">
        <Link href="/client" className="flex items-center gap-2.5">
          <FlexOfficersBadge
            height={72}
            transparent
            priority
            className="!h-[72px] !max-h-[72px] !w-auto shrink-0"
          />
          <span className="text-[1.125rem] font-bold leading-none tracking-tight">
            <span className="text-fo-primary-bright">Flex</span>
            <span className="text-slate-100">Officers</span>
          </span>
        </Link>
      </div>

      <nav
        aria-label="Client dashboard"
        className="flex-1 space-y-4 overflow-y-auto px-2.5 py-3"
      >
        {sections.map((section) => (
          <div key={section.title ?? "default"}>
            {section.title ? (
              <p className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                {section.title}
              </p>
            ) : null}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(pathname, item.href, item.match);
                const Icon = item.icon;

                return (
                  <Link
                    key={`${section.title}-${item.href}-${item.label}`}
                    href={item.href}
                    className={cn(
                      "flex min-h-9 items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                      active
                        ? "fo-nav-pill-active text-white"
                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-2 border-t border-white/[0.06] px-2.5 py-3">
        <div className="fo-glass-card rounded-xl border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-[13px] font-semibold text-fo-text">{sidebarLabels.needHelpFast}</p>
          <p className="mt-1 text-[11px] leading-snug text-fo-text-muted">
            {sidebarLabels.needHelpDesc}
          </p>
          <Link
            href="/contact"
            className={buttonClassName({
              size: "md",
              className: "mt-3 w-full !min-h-9 !px-3 !py-2 !text-xs",
            })}
          >
            {sidebarLabels.contactSupport}
          </Link>
        </div>

        <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.03] px-2.5 py-2.5">
          <ProfileAvatar name={displayName} src={imageUrl} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-slate-200">
              {displayName}
            </p>
            {email ? (
              <p className="truncate text-[11px] text-slate-500">{email}</p>
            ) : null}
          </div>
        </div>

        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="flex min-h-9 w-full items-center gap-2.5 rounded-xl px-2.5 py-1.5 text-[13px] font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200"
          >
            {nav.signOut}
          </button>
        </SignOutButton>
      </div>
    </aside>
  );
}
