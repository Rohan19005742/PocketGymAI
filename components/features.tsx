"use client";

import { Brain, Zap, TrendingUp, Users, Smartphone, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Gym Coach",
    description: "Get personalized workout recommendations and form advice from your personal AI trainer",
  },
  {
    icon: Users,
    title: "AI Nutritionist",
    description: "Receive meal plans, nutrition advice, and macro guidance tailored to your goals",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your weight, body composition, and fitness progress with beautiful charts",
  },
  {
    icon: Zap,
    title: "Instant Personalization",
    description: "AI adapts to your feedback and adjusts recommendations based on your performance",
  },
  {
    icon: Award,
    title: "Expert Knowledge",
    description: "Benefit from advanced AI trained on fitness science and nutrition best practices",
  },
  {
    icon: Smartphone,
    title: "Access Anywhere",
    description: "Train and get nutrition advice anytime with our fully responsive web platform",
  },
];

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-semibold text-blue-400 uppercase tracking-widest">
            Why Choose PocketGymAI
          </p>
          <h2 className="text-4xl sm:text-5xl font-black">
            Powerful Features for Your Fitness
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Everything you need to achieve your fitness goals with cutting-edge AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group relative p-6 lg:p-8 rounded-xl border border-neutral-800 hover:border-blue-500/50 bg-neutral-900/50 hover:bg-neutral-900 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
              >
                {/* Icon */}
                <div className="inline-flex p-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                  <Icon className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-neutral-400 leading-relaxed">{feature.description}</p>

                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
