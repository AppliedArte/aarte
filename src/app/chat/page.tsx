"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE_OUT_EXPO = [0.19, 1, 0.22, 1] as const;

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

async function sendMessage(message: string, sessionId: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, sessionId }),
  });
  const data = await response.json();
  return data.reply;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("aarte-session-id");
      if (stored) return stored;
      const newId = `web-${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem("aarte-session-id", newId);
      return newId;
    }
    return `web-${Math.random().toString(36).substring(2, 15)}`;
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await sendMessage(userMessage.content, sessionId);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Connection issue — please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setIsLoading(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <a
          href="/"
          className="font-mono text-xs text-white hover:text-white/60 transition-colors uppercase min-h-[44px] flex items-center"
        >
          AARTE
        </a>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-white/60 uppercase">Online</span>
        </div>
      </header>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col pt-16 pb-24">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Welcome Message */}
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                className="text-center py-16"
              >
                <h1 className="text-4xl sm:text-5xl font-medium mb-4 tracking-[-0.02em]">
                  Chat with AARTE
                </h1>
                <p className="font-mono text-sm text-white/50 max-w-md mx-auto">
                  Your AI assistant. Ask me anything — I&apos;m here to help.
                </p>
              </motion.div>
            )}

            {/* Message List */}
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: EASE_OUT_EXPO }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[75%] ${
                      message.role === "user"
                        ? "bg-white text-black"
                        : "bg-white/10 border border-white/10"
                    }`}
                  >
                    <div className="px-4 py-3">
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    <div
                      className={`px-4 py-2 border-t ${
                        message.role === "user"
                          ? "border-black/10"
                          : "border-white/10"
                      }`}
                    >
                      <span
                        className={`font-mono text-[10px] uppercase ${
                          message.role === "user" ? "text-black/40" : "text-white/40"
                        }`}
                      >
                        {message.role === "user" ? "You" : "AARTE"} · {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/10 border border-white/10 px-4 py-3">
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>
      </main>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a0a0a] border-t border-white/10 px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                rows={1}
                className="w-full bg-white/5 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/40 transition-colors resize-none font-mono"
                style={{ minHeight: "48px", maxHeight: "120px" }}
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-white text-black font-mono text-sm uppercase hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed min-h-[48px]"
            >
              Send
            </button>
          </div>
          <p className="font-mono text-[10px] text-white/30 mt-2 text-center">
            Press Enter to send · Shift+Enter for new line
          </p>
        </form>
      </div>
    </div>
  );
}
