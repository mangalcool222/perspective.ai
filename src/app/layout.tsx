import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Perspective.ai — Don't get answers. Find your blindspots.",
  description: "Assemble an automated room of 4 executive AI advisors (Strategist, Skeptic, Customer, Operator) to challenge your business & career decisions.",
  openGraph: {
    title: "Perspective.ai — Dialectic Decision Environment",
    description: "Don't get answers. Find your blindspots.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fafafa] text-neutral-900">{children}</body>
    </html>
  );
}
