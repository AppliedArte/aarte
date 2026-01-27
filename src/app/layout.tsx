import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono, Silkscreen, VT323, Press_Start_2P, Pixelify_Sans } from "next/font/google";
import "./globals.css";

const ppNeueMontreal = localFont({
  src: [
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-book.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-italic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-semibolditalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const silkscreen = Silkscreen({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const vt323 = VT323({
  variable: "--font-vt323",
  subsets: ["latin"],
  weight: "400",
});

const pressStart2P = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
});

const pixelifySans = Pixelify_Sans({
  variable: "--font-pixelify",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AARTE: Applied Artificial Intelligence",
  description: "Your personal AI assistant that integrates with WhatsApp, Telegram, Slack, and more. 100% private, self-hosted, your data never leaves your infrastructure.",
  keywords: ["AI assistant", "artificial intelligence", "WhatsApp bot", "Telegram bot", "Slack integration", "private AI", "self-hosted AI"],
  authors: [{ name: "AARTE" }],
  openGraph: {
    title: "AARTE: Applied Artificial Intelligence",
    description: "Your personal AI assistant. 100% private, self-hosted.",
    url: "https://aarte.co",
    siteName: "AARTE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AARTE: Applied Artificial Intelligence",
    description: "Your personal AI assistant. 100% private, self-hosted.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "AARTE",
  "applicationCategory": "BusinessApplication",
  "description": "Your personal AI assistant that integrates with WhatsApp, Telegram, Slack, and more. 100% private, self-hosted.",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "49.99",
    "priceCurrency": "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${ppNeueMontreal.variable} ${ibmPlexMono.variable} ${silkscreen.variable} ${vt323.variable} ${pressStart2P.variable} ${pixelifySans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
