"use client";

import { Brain, Zap, TrendingUp, Users, Smartphone, Award } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Coach",
    description: "Get personalized workout plans tailored to your fitness level and goals",
  },
  {
    icon: Zap,
    title: "Real-time Feedback",
    description: "Instant form corrections and performance insights with every rep",
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor your improvements with detailed analytics and smart insights",
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other fitness enthusiasts and share your journey",
  },
  {
    icon: Smartphone,
    title: "Mobile Ready",
    description: "Access your training anywhere, anytime with our responsive design",
  },
  {
    icon: Award,
    title: "Certified Programs",
    description: "Workouts designed by certified fitness professionals",
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
