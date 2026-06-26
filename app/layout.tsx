import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { BRAND_BADGE_PNG } from "@/components/brand/brand-assets";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FlexOfficers",
  description:
    "A marketplace connecting security companies with licensed security officers.",
  icons: {
    icon: [
      { url: BRAND_BADGE_PNG, sizes: "32x32", type: "image/png" },
      { url: BRAND_BADGE_PNG, sizes: "192x192", type: "image/png" },
    ],
    shortcut: BRAND_BADGE_PNG,
    apple: BRAND_BADGE_PNG,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-fo-bg text-fo-text font-sans">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}