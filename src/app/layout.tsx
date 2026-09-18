import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Cursor } from "@/components/Cursor";
import { Overlays } from "@/components/Overlays";
import { Loader } from "@/components/Loader";
import { ScrollProgress } from "@/components/hud/ScrollProgress";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { SoundToggle } from "@/components/Sound";
import { Currently } from "@/components/hud/Currently";
import { Konami } from "@/components/Konami";
import { FlybyAnchors } from "@/components/FlybyAnchors";
import { TypedEggs } from "@/components/TypedEggs";
import { Terminal } from "@/components/Terminal";
import { ProgressCard } from "@/components/anime/ProgressCard";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nandakishore.dev"),
  title: {
    default: "Nandakishore Reddy — Full-Stack Developer",
    template: "%s · Nandakishore Reddy",
  },
  description:
    "Full-stack developer from Hyderabad. Building high-performance educational platforms and systems tooling with React, Next.js, Supabase, and Go. B.Tech CSE at VNR VJIET.",
  keywords: [
    "Nandakishore Reddy",
    "Full-Stack Developer",
    "React Developer",
    "Next.js",
    "Supabase",
    "Three.js",
    "WebGL",
    "Hyderabad Developer",
    "AlgoWizard",
    "Coefficient",
    "Portfolio",
  ],
  authors: [{ name: "Nandakishore Reddy" }],
  creator: "Nandakishore Reddy",
  publisher: "Nandakishore Reddy",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "Nandakishore Reddy",
    title: "Nandakishore Reddy — Full-Stack Developer",
    description:
      "Full-stack developer from Hyderabad. WebGL, React, Next.js, Supabase. Building things that feel alive.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Nandakishore Reddy — Full-Stack Developer · Hyderabad, IN",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nandakishore Reddy — Full-Stack Developer",
    description:
      "Full-stack developer from Hyderabad. WebGL, React, Next.js, Supabase.",
    images: ["/og.png"],
    creator: "@N9601",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  category: "technology",
};

export const viewport = {
  themeColor: "#080808",
  colorScheme: "dark" as const,
  width: "device-width",
  initialScale: 1,
  // Extend the dark bg under the iPhone notch / home indicator —
  // fixed HUD elements pad themselves with safe-area insets.
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-fg">
        <Loader />
        <SmoothScroll />
        <Cursor />
        <Overlays />
        <ScrollProgress />
        <ProgressCard />
        <KeyboardShortcuts />
        <SoundToggle />
        <Currently />
        <Konami />
        <FlybyAnchors />
        <TypedEggs />
        <Terminal />
        {children}
      </body>
    </html>
  );
}
