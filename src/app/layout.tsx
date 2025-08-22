import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sawariya CSC – One Centre for All Government & Utility Services",
  description:
    "Transparent pricing, instant receipts, and proper guidance. Your trusted CSC service centre for all government & utility services.",
  keywords: [
    "CSC",
    "government services",
    "utility services",
    "sawariyacsc",
    "digital india",
  ],
  openGraph: {
    title: "Sawariya CSC – One Centre for All Government & Utility Services",
    description:
      "Transparent pricing, instant receipts, and proper guidance. Visit Sawariya CSC for hassle-free digital services.",
    url: "https://sawariyacsc.com",
    siteName: "Sawariya CSC",
    images: [
      {
        url: "https://sawariyacsc.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sawariya CSC",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
