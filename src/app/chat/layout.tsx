import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat — AARTE",
  description: "Chat with your personal AARTE AI agent. Experience intelligent conversations and get assistance with your daily tasks through our advanced AI interface.",
  keywords: ["AI chat", "AARTE chat", "AI conversation", "personal AI assistant chat", "AI interface"],
  openGraph: {
    title: "Chat — AARTE",
    description: "Chat with your personal AARTE AI agent and experience intelligent conversations.",
    url: "https://aarte.co/chat",
  },
  twitter: {
    title: "Chat — AARTE",
    description: "Chat with your personal AARTE AI agent and experience intelligent conversations.",
  },
  alternates: {
    canonical: "https://aarte.co/chat",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}