"use client";

import { Brain, Zap, TrendingUp, Users, Smartphone, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Gym Coach",
    description: "Get personalized workout recommendations and form advice from your personal AI trainer",
    color: "blue",
  },
  {
    icon: Users,
    title: "AI Nutritionist",
    description: "Receive meal plans, nutrition advice, and macro guidance tailored to your goals",
    color: "purple",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your weight, body composition, and fitness progress with beautiful charts",
    color: "green",
  },
  {
    icon: Zap,
    title: "Instant Personalization",
    description: "AI adapts to your feedback and adjusts recommendations based on your performance",
    color: "yellow",
  },
  {
    icon: Award,
    title: "Expert Knowledge",
    description: "Benefit from advanced AI trained on fitness science and nutrition best practices",
    color: "pink",
  },
  {
    icon: Smartphone,
    title: "Access Anywhere",
    description: "Train and get nutrition advice anytime with our fully responsive web platform",
    color: "cyan",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  blue: {
    bg: "from-blue-500/20 to-cyan-500/20",
    text: "text-blue-300",
    border: "hover:border-blue-400/50",
    glow: "shadow-lg shadow-blue-500/20",
  },
  purple: {
    bg: "from-purple-500/20 to-pink-500/20",
    text: "text-purple-300",
    border: "hover:border-purple-400/50",
    glow: "shadow-lg shadow-purple-500/20",
  },
  green: {
    bg: "from-green-500/20 to-emerald-500/20",
    text: "text-green-300",
    border: "hover:border-green-400/50",
    glow: "shadow-lg shadow-green-500/20",
  },
  yellow: {
    bg: "from-yellow-500/20 to-orange-500/20",
    text: "text-yellow-300",
    border: "hover:border-yellow-400/50",
    glow: "shadow-lg shadow-yellow-500/20",
  },
  pink: {
    bg: "from-pink-500/20 to-rose-500/20",
    text: "text-pink-300",
    border: "hover:border-pink-400/50",
    glow: "shadow-lg shadow-pink-500/20",
  },
  cyan: {
    bg: "from-cyan-500/20 to-blue-500/20",
    text: "text-cyan-300",
    border: "hover:border-cyan-400/50",
    glow: "shadow-lg shadow-cyan-500/20",
  },
};

export function Features() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-96 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-6">
          <div className="inline-block">
            <p className="text-sm font-bold text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text uppercase tracking-widest">Features</p>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight">
            Everything You Need for Fitness Success
          </h2>
          <p className="text-xl text-neutral-300 max-w-3xl mx-auto leading-relaxed">
            Powerful AI-driven features designed to transform your fitness journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorMap[feature.color];
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl border ${colors.border} bg-gradient-to-br ${colors.bg} backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-500 ${colors.glow} hover:-translate-y-2 transform cursor-pointer`}
              >
                {/* Animated background gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none blur-xl -z-10`} />

                {/* Icon Container */}
                <div className={`inline-flex p-4 bg-gradient-to-br ${colors.bg} rounded-xl mb-6 group-hover:scale-110 transition-all duration-300 border ${colors.border}`}>
                  <Icon className={`w-8 h-8 ${colors.text} transition-colors`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-neutral-300 leading-relaxed text-lg">
                  {feature.description}
                </p>

                {/* Accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${colors.bg} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
