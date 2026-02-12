"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 scale-fade-in">
              <Zap className="w-4 h-4 text-blue-400" />
              <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Training
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                Your Personal AI
                <br />
                <span className="gradient-text">Gym Coach</span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-400 max-w-md leading-relaxed">
                Transform your fitness journey with an intelligent AI coach that understands your goals, adapts to your progress, and motivates you every step of the way.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg px-8 py-6 rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50"
              >
                <Link href="/chat" className="flex items-center space-x-2">
                  <span>Start Training</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-neutral-700 hover:bg-neutral-900/50 text-white font-semibold text-lg px-8 py-6 rounded-lg transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>

            {/* Social Proof */}
            <div className="pt-8 border-t border-neutral-800 flex items-center space-x-6 text-sm text-neutral-400">
              <div>
                <p className="text-white font-semibold text-lg">10K+</p>
                <p>Active Trainers</p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <p className="text-white font-semibold text-lg">50K+</p>
                <p>Workouts Created</p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <p className="text-white font-semibold text-lg">4.9★</p>
                <p>Rating</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-[500px] lg:h-[550px] hidden lg:block">
            {/* Animated card stack effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Card 1 */}
              <div className="absolute w-72 h-96 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl backdrop-blur-xl p-6 transform -rotate-12 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-blue-500/20">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <p className="text-sm text-neutral-300">Chest Day</p>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="h-2 bg-neutral-700/50 rounded-full w-3/4" />
                    <div className="h-2 bg-neutral-700/50 rounded-full w-full" />
                    <div className="h-2 bg-neutral-700/50 rounded-full w-4/5" />
                  </div>
                  <div className="text-2xl font-bold gradient-text">85% Complete</div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="absolute w-72 h-96 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl backdrop-blur-xl p-6 transform rotate-12 hover:rotate-0 transition-transform duration-500 shadow-2xl shadow-purple-500/20 -bottom-8 right-0">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full" />
                    <p className="text-sm text-neutral-300">AI Coach</p>
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center space-y-2">
                      <p className="text-sm text-neutral-400">Next: Push-ups</p>
                      <p className="text-3xl font-bold">3x12</p>
                      <p className="text-xs text-neutral-500">Perfect form</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
