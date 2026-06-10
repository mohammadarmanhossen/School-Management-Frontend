import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import { AuthProvider } from "@/providers/auth-provider";
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
  title: {
    default: "Nextzen - Next-Generation School ERP System",
    template: "%s | Nextzen School ERP",
  },
  description: "Nextzen is a premium, enterprise-grade School Management System that streamlines operations, enhances learning, and connects educators, students, and parents.",
  keywords: ["School ERP", "Education Management", "School Software", "Student Information System", "Nextzen"],
  authors: [{ name: "Nextzen Team" }],
  creator: "Nextzen",
  publisher: "Nextzen Technologies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nextzen.net/",
    title: "Nextzen - Modern School ERP System",
    description: "Transform your institution with our comprehensive school management platform.",
    siteName: "Nextzen School ERP",
    images: [
      {
        url: "/og-image.jpg", // Add a real image in public folder later
        width: 1200,
        height: 630,
        alt: "Nextzen School ERP Dashboard Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextzen - Next-Generation School ERP",
    description: "Enterprise-grade School Management System for modern educational institutions.",
    creator: "@nextzen",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Nextzen ERP",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <Providers>
          <AuthProvider>{children}</AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
