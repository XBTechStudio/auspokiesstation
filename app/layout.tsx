import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import ConditionalLayout from "./components/ConditionalLayout";
import "./globals.css";

export const dynamic = 'force-dynamic';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://auspokiesstation.vip'),
  title: {
    default: "88 GROUP × WILD GROUP PARTNERSHIP - Best Online Casinos Australia",
    template: "%s | 88 GROUP × WILD GROUP PARTNERSHIP"
  },
  description: "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players to trusted gaming platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access.",
  keywords: [
    "online casinos Australia",
    "Australian online pokies",
    "real money casino Australia",
    "online casino bonuses",
    "casino welcome bonus",
    "live casino Australia",
  ],
  icons: {
    icon: '/partnership_logo.png',
    apple: '/partnership_logo.png',
    shortcut: '/partnership_logo.png',
  },
  openGraph: {
    type: 'website',
    title: "88 GROUP × WILD GROUP PARTNERSHIP - Best Online Casinos Australia",
    description: "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players to trusted gaming platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access.",
    images: [
      {
        url: '/partnership_logo.png',
        width: 1200,
        height: 630,
        alt: '88 GROUP × WILD GROUP PARTNERSHIP',
      },
    ],
    siteName: '88 GROUP × WILD GROUP PARTNERSHIP',
  },
  twitter: {
    card: 'summary_large_image',
    title: "88 GROUP × WILD GROUP PARTNERSHIP - Best Online Casinos Australia",
    description: "88 GROUP × WILD GROUP PARTNERSHIP connects Australian players to trusted gaming platforms offering competitive welcome bonuses, thousands of online pokies, live casino games, and secure access.",
    images: ['/partnership_logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <head>
        <link rel="icon" href="/partnership_logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/partnership_logo.png" />
        <link rel="shortcut icon" href="/partnership_logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta property="og:image" content="/partnership_logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:image" content="/partnership_logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ConditionalLayout>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
