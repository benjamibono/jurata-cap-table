import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CompanyProvider } from '../context/CompanyContext';
import { Header } from '../components/Header';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jurata Cap Table Management | Professional Portfolio Management",
  description: "Modern cap table management platform for venture capital firms. Built with Next.js 15, TypeScript, and Swiss precision.",
  keywords: "cap table, venture capital, portfolio management, equity tracking, shareholders, Next.js",
  authors: [{ name: "Jurata Development Team" }],
  creator: "Jurata Development Team",
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "Jurata Cap Table Management Platform",
    description: "Professional cap table management for venture capital firms",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        <CompanyProvider>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <main role="main" className="flex-1">
              {children}
            </main>
          </div>
        </CompanyProvider>
      </body>
    </html>
  );
}
