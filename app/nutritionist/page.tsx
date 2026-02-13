"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Send, Sparkles, Mic, Apple } from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

export default function NutritionistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content:
        "Hey! 🥗 I'm your personal AI Nutritionist. I can help you with meal plans, calorie tracking, macro breakdowns, dietary advice, and recipe suggestions tailored to your fitness goals. What would you like help with today?",
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
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400">Loading nutritionist...</p>
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

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: `Great question about "${input}"! Here's my nutrition advice:\n\n🍽️ **Meal Suggestion**\n- **Breakfast:** Overnight oats with berries & protein powder (350 cal)\n- **Lunch:** Grilled chicken salad with avocado & quinoa (520 cal)\n- **Dinner:** Salmon with sweet potato & steamed broccoli (480 cal)\n- **Snacks:** Greek yoghurt, almonds, banana (300 cal)\n\n📊 **Daily Totals:** ~1,650 cal | 140g protein | 160g carbs | 55g fat\n\nWould you like me to adjust this for your specific goals or dietary preferences? 🥑`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1200);
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
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-br-none shadow-lg shadow-green-500/20"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-100 rounded-bl-none shadow-lg shadow-neutral-900/50"
                }`}
              >
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p
                  className={`text-xs mt-2 ${
                    message.type === "user"
                      ? "text-green-100"
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
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  />
                  <div
                    className="w-2 h-2 bg-green-500 rounded-full animate-bounce"
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
                placeholder="Ask about meals, macros, diets..."
                className="flex-1 bg-neutral-900 border border-neutral-800 rounded-full px-4 sm:px-6 py-3 sm:py-4 text-white placeholder-neutral-500 focus:outline-none focus:border-green-500/50 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
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
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full px-6 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-green-500/20"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* AI Badge */}
            <div className="flex items-center justify-center space-x-2 text-xs text-neutral-500">
              <Apple className="w-3 h-3" />
              <span>Powered by AI Nutritionist</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
