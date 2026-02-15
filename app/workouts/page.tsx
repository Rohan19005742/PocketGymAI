"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, Zap, TrendingUp, Users, Clock } from "lucide-react";

const workoutPrograms = [
  {
    id: "1",
    title: "Strength & Muscle",
    description: "Build lean muscle mass with progressive overload training",
    duration: "12 weeks",
    difficulty: "Intermediate",
    participants: "2.3K+",
    rating: 4.8,
    color: "from-red-500/10 to-orange-500/10",
    icon: Zap,
  },
  {
    id: "2",
    title: "Fat Loss Accelerator",
    description: "High-intensity workouts designed for maximum calorie burn",
    duration: "8 weeks",
    difficulty: "Advanced",
    participants: "5.1K+",
    rating: 4.9,
    color: "from-pink-500/10 to-rose-500/10",
    icon: TrendingUp,
  },
  {
    id: "3",
    title: "Beginner's Foundation",
    description: "Start your fitness journey with fundamentals and proper form",
    duration: "6 weeks",
    difficulty: "Beginner",
    participants: "8.7K+",
    rating: 4.7,
    color: "from-blue-500/10 to-cyan-500/10",
    icon: Users,
  },
  {
    id: "4",
    title: "Endurance & Cardio",
    description: "Improve cardiovascular health and stamina with smart training",
    duration: "10 weeks",
    difficulty: "Intermediate",
    participants: "3.2K+",
    rating: 4.8,
    color: "from-green-500/10 to-emerald-500/10",
    icon: Clock,
  },
  {
    id: "5",
    title: "Core & Flexibility",
    description: "Strengthen your core and improve flexibility with yoga-inspired workouts",
    duration: "8 weeks",
    difficulty: "Beginner",
    participants: "4.5K+",
    rating: 4.6,
    color: "from-purple-500/10 to-pink-500/10",
    icon: Zap,
  },
  {
    id: "6",
    title: "HIIT Blitz",
    description: "Short, intense workouts perfect for busy schedules",
    duration: "6 weeks",
    difficulty: "Advanced",
    participants: "6.9K+",
    rating: 4.9,
    color: "from-yellow-500/10 to-orange-500/10",
    icon: TrendingUp,
  },
];

export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 pt-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold text-blue-400">
              Professional Programs
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black">
            Workout Programs
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            Choose from our collection of AI-optimized workout programs designed by certified trainers
          </p>
        </div>

        {/* Filter/Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button
            variant="outline"
            className="border-border hover:bg-card/50"
          >
            All Programs
          </Button>
          <Button variant="ghost" className="text-neutral-400">
            Beginner
          </Button>
          <Button variant="ghost" className="text-neutral-400">
            Intermediate
          </Button>
          <Button variant="ghost" className="text-neutral-400">
            Advanced
          </Button>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {workoutPrograms.map((program) => {
            const IconComponent = program.icon;
            return (
              <Link href={`/chat?program=${program.id}`} key={program.id}>
                <div
                  className={`group relative h-full p-6 rounded-2xl border border-neutral-800 bg-gradient-to-br ${program.color} hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 cursor-pointer overflow-hidden`}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Content */}
                  <div className="relative z-10 space-y-4">
                    {/* Icon and Badge */}
                    <div className="flex items-start justify-between">
                      <div className="p-3 bg-card/60 rounded-lg group-hover:bg-card transition-all">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {program.difficulty}
                      </span>
                    </div>

                    {/* Title and Description */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-300 transition-colors">
                        {program.title}
                      </h3>
                      <p className="text-sm text-neutral-400 leading-relaxed">
                        {program.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-800/50">
                      <div className="flex items-center space-x-4 text-sm text-neutral-400">
                        <span>{program.duration}</span>
                        <span>⭐ {program.rating}</span>
                      </div>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center space-x-2 text-sm text-neutral-500">
                      <Users className="w-4 h-4" />
                      <span>{program.participants} participants</span>
                    </div>

                    {/* CTA */}
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold mt-4 group-hover:shadow-lg group-hover:shadow-purple-500/20 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <span>Get Started</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
