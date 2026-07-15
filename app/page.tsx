import type { Metadata } from "next";
import { LandingPageContent } from "@/components/landing/LandingPageContent";

export const metadata: Metadata = {
  title: "FlexOfficers | Hire Licensed Security Officers & Find Security Jobs",
  description:
    "Find licensed security officer jobs, hire verified security officers, manage shifts, and connect with trusted private security companies across the United States.",
  alternates: {
    canonical: "https://www.flexofficers.com/",
  },
};

export default function Home() {
  return <LandingPageContent />;
}
