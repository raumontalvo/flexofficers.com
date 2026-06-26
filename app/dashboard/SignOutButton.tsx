"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui";

export default function DashboardSignOutButton() {
  return (
    <SignOutButton redirectUrl="/">
      <Button variant="secondary" size="md" className="shrink-0">
        Sign Out
      </Button>
    </SignOutButton>
  );
}