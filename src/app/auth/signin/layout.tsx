import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — AARTE",
  description: "Sign in to your AARTE account and access your personal AI agent. Secure authentication to manage your AI automation and integrations.",
  keywords: ["AARTE sign in", "login", "authentication", "AI agent access"],
  openGraph: {
    title: "Sign In — AARTE",
    description: "Sign in to your AARTE account and access your personal AI agent.",
    url: "https://aarte.co/auth/signin",
  },
  twitter: {
    title: "Sign In — AARTE", 
    description: "Sign in to your AARTE account and access your personal AI agent.",
  },
  alternates: {
    canonical: "https://aarte.co/auth/signin",
  },
  robots: {
    index: false, // Don't index login pages
    follow: true,
  },
};

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}