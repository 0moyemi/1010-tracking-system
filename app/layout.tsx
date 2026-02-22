import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import NotificationManager from "./components/NotificationManager";
import { getVapidPublicKey } from "./lib/getVapidPublicKey";
import NotificationPermissionPrompt from "./components/NotificationPermissionPrompt";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sales Assistant - Never Miss a Beat",
  description:
    "Your smart sales assistant for busy business owners. Get reminders, stay on top of sales, and keep your business running—even when you're busy or tired. Never forget a follow-up, order, or daily task again.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sales Assistant",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#081F44",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="icon" type="image/png" href="/Secondary Logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Sales Assistant" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Sales Assistant" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#081F44" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NotificationPermissionPrompt />
        {children}
        <NotificationManager />

        {/* Service Worker Registration removed: now using Firebase messaging SW only */}
      </body>
    </html >
  );
}
