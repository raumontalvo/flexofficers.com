"use client";

import { SignOutButton } from "@clerk/nextjs";

export default function DashboardSignOutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <button className="rounded-xl border border-white/20 px-5 py-3 font-semibold hover:bg-white/10">
        Sign Out
      </button>
    </SignOutButton>
  );
}