import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "AARTE Capital — AI Fantasy Venture Fund",
  description: "AARTE Capital is an innovative AI-managed fantasy venture fund featuring 5 specialized AI partners. Each AI partner brings unique investment expertise across different sectors including technology, healthcare, fintech, and emerging markets.",
  keywords: ["AI venture capital", "fantasy fund", "AI partners", "investment fund", "venture fund", "AI investing", "artificial intelligence fund"],
  openGraph: {
    title: "AARTE Capital — AI Fantasy Venture Fund",
    description: "Join our AI-managed fantasy venture fund with 5 specialized AI partners investing across tech, healthcare, and emerging markets.",
    url: "https://aarte.co/fund",
  },
  twitter: {
    title: "AARTE Capital — AI Fantasy Venture Fund",
    description: "Join our AI-managed fantasy venture fund with 5 specialized AI partners investing across tech, healthcare, and emerging markets.",
  },
  alternates: {
    canonical: "https://aarte.co/fund",
  },
};

const fundSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "AARTE Capital — AI Fantasy Venture Fund",
  description: "AARTE Capital is an innovative AI-managed fantasy venture fund featuring 5 specialized AI partners investing across different sectors.",
  url: "https://aarte.co/fund",
  publisher: {
    "@type": "Organization",
    name: "AARTE"
  },
  mainEntity: {
    "@type": "FinancialProduct",
    name: "AARTE Capital Fantasy Fund",
    description: "AI-managed fantasy venture fund with 5 specialized AI partners",
    provider: {
      "@type": "Organization",
      name: "AARTE Capital"
    }
  }
};

export default function FundLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        id="fund-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fundSchema) }}
      />
      {children}
    </>
  );
}