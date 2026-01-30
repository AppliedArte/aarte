import type { Metadata } from "next";
import localFont from "next/font/local";
import { IBM_Plex_Mono, Silkscreen, VT323, Press_Start_2P, Pixelify_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { auth } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";

const ppNeueMontreal = localFont({
  src: [
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-thin.otf", weight: "100", style: "normal" },
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-book.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-italic.otf", weight: "400", style: "italic" },
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-medium.otf", weight: "500", style: "normal" },
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-semibolditalic.otf", weight: "600", style: "italic" },
    { path: "../../public/fonts/pp-neue-montreal/ppneuemontreal-bold.otf", weight: "700", style: "normal" },
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

const fontVariables = [
  ppNeueMontreal.variable,
  ibmPlexMono.variable,
  silkscreen.variable,
  vt323.variable,
  pressStart2P.variable,
  pixelifySans.variable,
].join(" ");

const title = "AARTE: Create Your Personal @openclawd AI Agent";
const description = "Build your personal @openclawd AI assistant with AARTE. Integrates with WhatsApp, Telegram, Slack, and more. 100% private, self-hosted, your data never leaves your infrastructure.";
const shortDescription = "Build your personal @openclawd AI assistant. 100% private, self-hosted.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["@openclawd", "AI assistant", "AI agent", "artificial intelligence", "WhatsApp bot", "Telegram bot", "Slack integration", "private AI", "self-hosted AI", "personal AI assistant", "AARTE"],
  authors: [{ name: "AARTE" }],
  openGraph: {
    title,
    description: shortDescription,
    url: "https://aarte.co",
    siteName: "AARTE",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: shortDescription,
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AARTE - @openclawd AI Agent Creator",
  applicationCategory: "BusinessApplication",
  description,
  operatingSystem: "Web",
  alternateName: ["@openclawd", "AARTE Agent"],
  offers: {
    "@type": "Offer",
    price: "29.99",
    priceCurrency: "USD",
  },
};

const GA_ID = "G-90GEC7MMJS";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className={`${fontVariables} antialiased`}>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
