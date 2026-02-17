import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — AARTE",
  description: "Get started with AARTE and create your personal AI agent. Choose from our flexible pricing plans and start building intelligent automation for your workflows today.",
  keywords: ["AARTE signup", "AI agent pricing", "personal AI assistant", "get started", "AI automation plans"],
  openGraph: {
    title: "Sign Up — AARTE", 
    description: "Get started with AARTE and create your personal AI agent. Choose from flexible pricing plans.",
    url: "https://aarte.co/signup",
  },
  twitter: {
    title: "Sign Up — AARTE",
    description: "Get started with AARTE and create your personal AI agent. Choose from flexible pricing plans.",
  },
  alternates: {
    canonical: "https://aarte.co/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
