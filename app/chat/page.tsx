"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Mic } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hey! 👋 I'm your personal AI gym coach. Let's build an epic workout plan together! Tell me about your fitness goals, current fitness level, or any specific areas you want to focus on.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Call the RAG-powered AI Coach API
      const response = await fetch("/api/chat/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            "Failed to get response from AI Coach"
        );
      }

      const data = await response.json();
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: data.message,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Show error message to user
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content:
          error instanceof Error
            ? error.message
            : "I encountered an issue processing your request. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 pt-20">
      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              } fade-in`}
            >
              <div
                className={`max-w-xs sm:max-w-md lg:max-w-xl px-4 py-3 rounded-2xl ${
                  message.type === "user"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg shadow-purple-500/20"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-bl-none shadow-lg shadow-neutral-900/50"
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user"
                      ? "text-blue-100"
                      : "text-neutral-500"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start fade-in">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl rounded-bl-none p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="border-t border-neutral-800 bg-neutral-950/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="relative flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask your AI coach anything..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
              <Button
                onClick={() => {}}
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-white hover:bg-neutral-800/50 rounded-full"
              >
                <Mic className="w-5 h-5" />
              </Button>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-purple-500/20"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* AI Badge */}
            <div className="flex items-center justify-center space-x-2 text-xs text-neutral-500">
              <Sparkles className="w-3 h-3" />
              <span>Powered by Advanced AI</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
