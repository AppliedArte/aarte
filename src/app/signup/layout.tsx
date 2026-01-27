import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started - AARTE",
  description: "Subscribe to AARTE Pro and get your personal AI assistant. Full API access, priority support, and custom integrations included.",
  openGraph: {
    title: "Get Started - AARTE",
    description: "Subscribe to AARTE Pro and get your personal AI assistant.",
    url: "https://aarte.co/signup",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
