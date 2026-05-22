import type { Metadata } from "next";
import { Newsreader, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import { SiteNav } from "@/components/SiteNav";
import "./globals.css";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Dynamic Wealth Management | Applied Financial Math",
  description:
    "Senior Investment Advisor dashboard — annuity valuation, fund returns, capital budgeting, fixed income, and macro context.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${sourceSans.variable} ${plexMono.variable} min-h-screen antialiased`}
      >
        <SiteNav />
        <main>{children}</main>
        <footer className="border-t border-line px-6 py-10 text-center text-sm text-muted">
          Dynamic Wealth Management · Applied Financial Math Case Study · Data from
          course workbook &amp; FRED public CSV
        </footer>
      </body>
    </html>
  );
}
