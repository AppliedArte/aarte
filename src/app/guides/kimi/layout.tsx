import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kimi Guide — AARTE",
  description: "Complete guide to integrating Kimi AI with AARTE. Learn how to set up and configure Kimi for your personal AI agent workflows.",
  keywords: ["Kimi guide", "Kimi AI integration", "AARTE guide", "AI setup tutorial", "Kimi configuration"],
  openGraph: {
    title: "Kimi Guide — AARTE",
    description: "Complete guide to integrating Kimi AI with AARTE for enhanced AI agent capabilities.",
    url: "https://aarte.co/guides/kimi",
  },
  twitter: {
    title: "Kimi Guide — AARTE",
    description: "Complete guide to integrating Kimi AI with AARTE for enhanced AI agent capabilities.",
  },
  alternates: {
    canonical: "https://aarte.co/guides/kimi",
  },
};

export default function KimiGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}