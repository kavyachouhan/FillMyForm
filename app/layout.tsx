import type { Metadata } from "next";
import { Analytics } from '@vercel/analytics/next';
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
  title: "FillMyForm - Generate Test Responses for Google Forms",
  description:
    "Generate realistic test responses for Google Forms. Perfect for academic research, form validation, and dashboard testing.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "FillMyForm - Generate Test Responses for Google Forms",
    description:
      "Generate realistic test responses for Google Forms. Perfect for academic research, form validation, and dashboard testing.",
    url: "https://fillmyform.com",
    siteName: "FillMyForm",
    images: [
      {
        url: "https://fillmyform.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FillMyForm Open Graph Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FillMyForm - Generate Test Responses for Google Forms",
    description:
      "Generate realistic test responses for Google Forms. Perfect for academic research, form validation, and dashboard testing.",
    images: ["https://fillmyform.com/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}