"use client";

import { Star } from "lucide-react";

// Real capabilities your platform delivers
const testimonials = [
  {
    name: "Your Fitness Goals",
    role: "Personalized Training",
    avatar: "💪",
    content:
      "Get a personalized AI gym coach that understands your fitness goals and creates custom workouts tailored to your level, equipment, and time availability.",
    rating: 5,
  },
  {
    name: "Nutrition Planning",
    role: "AI-Powered Guidance",
    avatar: "🥗",
    content:
      "Receive meal plans and nutrition advice from your AI nutritionist that adapts to your goals, dietary preferences, and progress.",
    rating: 5,
  },
  {
    name: "Progress Tracking",
    role: "Real-Time Analytics",
    avatar: "📊",
    content:
      "Monitor your fitness journey with detailed progress tracking, charts, and insights. See your real results over time.",
    rating: 5,
  },
  {
    name: "Always Available",
    role: "24/7 AI Support",
    avatar: "🤖",
    content:
      "Get coaching, guidance, and support anytime, anywhere. Your AI coach is always ready when you are.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-24 space-y-6">
          <p className="text-lg font-bold text-blue-300 uppercase tracking-wider">
            ✨ Loved by Users
          </p>
          <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight">
            Platform Capabilities
          </h2>
          <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
            Explore what PocketGymAI delivers to transform your fitness journey
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-2xl border border-blue-400/30 hover:border-blue-300/80 bg-gradient-to-br from-blue-900/25 to-purple-900/15 backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 transform overflow-hidden"
            >
              {/* Stars */}
              <div className="flex space-x-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 fill-yellow-300 text-yellow-300"
                  />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-neutral-100 mb-8 leading-relaxed text-lg font-medium">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4 pt-6 border-t border-blue-500/20">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="text-white font-bold text-lg">{testimonial.name}</p>
                  <p className="text-blue-300 text-sm font-semibold">{testimonial.role}</p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
            </div>
          ))}
        </div>

        {/* Testimonials Footer */}
        <div className="text-center mt-20 space-y-4">
          <p className="text-xl text-neutral-300 font-bold">
            AI-powered fitness and nutrition in one platform
          </p>
          <div className="flex items-center justify-center space-x-3 text-lg text-blue-300 font-semibold">
            <span>✓</span>
            <span>Free to use • Premium features available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
