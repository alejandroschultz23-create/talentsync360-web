import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/react";
import OrganizationSchema from "@/components/OrganizationSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.talentsync360.com"),
  title: {
    default: "TalentSync360 | Decision-Ready LATAM Technical Shortlists",
    template: "%s | TalentSync360"
  },
  description: "Get decision-ready LATAM technical shortlists in 72 hours. Our sourcing sprints combine human vetting, English communication screening, and a structured 360° Fit Matrix.",
  keywords: ["LATAM developers", "Nearshore sourcing", "Technical vetting", "Sourcing sprints", "360 Fit Matrix", "English communication screening", "Candidate scorecards"],
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: "TalentSync360 | Decision-Ready LATAM Technical Shortlists",
    description: "Get decision-ready LATAM technical shortlists in 72 hours. Our sourcing sprints combine human vetting, English communication screening, and a structured 360° Fit Matrix.",
    url: "https://www.talentsync360.com",
    siteName: "TalentSync360",
    images: [
      {
        url: "https://www.talentsync360.com/logo_oficial.png",
        width: 1200,
        height: 630,
        alt: "TalentSync360",
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalentSync360 | Decision-Ready LATAM Technical Shortlists",
    description: "Get decision-ready LATAM technical shortlists in 72 hours. Our sourcing sprints combine human vetting, English communication screening, and a structured 360° Fit Matrix.",
    images: ["https://www.talentsync360.com/logo_oficial.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased selection:bg-blue-500/30 selection:text-blue-200`}
    >
      <body className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-400">
        <LanguageProvider>
          <OrganizationSchema />
          <Navbar />
          <main className="flex-grow pt-16">
            {children}
          </main>
          <Footer />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
