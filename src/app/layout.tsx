import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { Analytics } from "@vercel/analytics/react"; // Vercel Analytics SDK

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TalentSync360 | Contratá Talento Validado. Sin Fricción.",
  description: "Shortlists curadas de talento nearshore (LATAM) con inglés C1+ verificado. Screening humano, pruebas prácticas y scorecards.",
  keywords: "Talento LATAM, Nearshore, Contratación, Validación 360, Inglés C1+, Shortlists",
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
