"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, CheckCircle } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Enhanced animated background with gradient mesh */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Main gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl opacity-40 animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl opacity-30 animate-pulse" style={{animationDelay: '1.5s'}} />
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-blue-500/5 to-transparent opacity-40" />
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-5 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cfilter id="noiseFilter"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="100%" height="100%" filter="url(%23noiseFilter)"%3E%3C/rect%3E%3C/svg%3E")'}} />
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 slide-up">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 scale-fade-in group hover:border-blue-400/50">
              <Zap className="w-4 h-4 text-blue-400 group-hover:animate-pulse" />
              <span className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Training
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight">
                AI Fitness &
                <br />
                <span className="gradient-text animate-pulse">Nutrition Coach</span>
              </h1>
              <p className="text-lg sm:text-xl text-neutral-300 max-w-md leading-relaxed font-medium">
                Transform your fitness journey with an intelligent AI coach that understands your goals, adapts to your progress, and motivates you every step of the way.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-neutral-300">Personalized workouts in real-time</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-neutral-300">AI nutrition planning & coaching</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-neutral-300">Track progress with detailed analytics</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-7 rounded-xl shadow-lg shadow-purple-500/40 transition-all duration-300 hover:shadow-purple-500/60 hover:scale-105 transform"
              >
                <Link href="/chat" className="flex items-center justify-center space-x-2">
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-blue-500/30 hover:border-blue-400 hover:bg-blue-500/10 text-white font-semibold text-lg px-8 py-7 rounded-xl transition-all duration-300 hover:scale-105 transform"
              >
                Schedule a Demo
              </Button>
            </div>

            {/* Social Proof - Real Capabilities */}
            <div className="pt-8 border-t border-neutral-800/50 flex items-center space-x-6 text-sm text-neutral-400">
              <div className="hover:scale-110 transition-transform">
                <p className="text-white font-bold text-lg">100% Free</p>
                <p>Start Using Now</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div className="hover:scale-110 transition-transform">
                <p className="text-white font-bold text-lg">3-in-1</p>
                <p>Complete Platform</p>
              </div>
              <div className="w-px h-8 bg-neutral-700" />
              <div className="hover:scale-110 transition-transform">
                <p className="text-white font-bold text-lg">Premium</p>
                <p>Optional Upgrade</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative h-96 sm:h-[500px] lg:h-[550px] hidden lg:block">
            {/* Animated card stack effect */}
            <div className="absolute inset-0 flex items-center justify-center gap-8">
              {/* Card 1 - Weight Loss Progress */}
              <div className="w-72 h-96 bg-gradient-to-br from-blue-900/40 to-blue-800/40 border border-blue-500/30 rounded-2xl backdrop-blur-xl p-6 hover:border-blue-400/50 transition-all duration-500 shadow-2xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-2">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-sm text-neutral-300 font-semibold">Weight Loss</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-300 font-semibold">On Track</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    {/* Chart */}
                    <div className="space-y-1">
                      <p className="text-xs text-neutral-400 font-semibold mb-3">Weight Trend & Goal Projection</p>
                      <div className="flex items-end justify-between h-32 gap-1.5 px-1">
                        {/* Historical data - realistic with ups and downs */}
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-32 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-t hover:from-blue-500/80 hover:to-blue-400/60 transition-all" />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-blue-300 transition-colors">W1</p>
                          <p className="text-xs text-neutral-600 mt-0.5">200</p>
                        </div>
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-28 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-t hover:from-blue-500/80 hover:to-blue-400/60 transition-all" />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-blue-300 transition-colors">W2</p>
                          <p className="text-xs text-neutral-600 mt-0.5">196</p>
                        </div>
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-30 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-t hover:from-blue-500/80 hover:to-blue-400/60 transition-all" />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-blue-300 transition-colors">W3</p>
                          <p className="text-xs text-neutral-600 mt-0.5">198</p>
                        </div>
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-24 bg-gradient-to-t from-blue-500/60 to-blue-400/40 rounded-t hover:from-blue-500/80 hover:to-blue-400/60 transition-all" />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-blue-300 transition-colors">W4</p>
                          <p className="text-xs text-neutral-600 mt-0.5">192</p>
                        </div>
                        
                        {/* Predictions - realistic with slight variations */}
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-20 bg-gradient-to-t from-green-500/40 to-green-400/20 rounded-t border-t border-green-400/50 hover:from-green-500/60 hover:to-green-400/40 transition-all" style={{borderStyle: 'dashed dashed solid solid'}} />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-green-300 transition-colors">W5</p>
                          <p className="text-xs text-neutral-600 mt-0.5">188</p>
                        </div>
                        <div className="flex flex-col items-center flex-1 group">
                          <div className="w-full h-16 bg-gradient-to-t from-green-500/40 to-green-400/20 rounded-t border-t border-green-400/50 hover:from-green-500/60 hover:to-green-400/40 transition-all" style={{borderStyle: 'dashed dashed solid solid'}} />
                          <p className="text-xs text-neutral-500 mt-1 group-hover:text-green-300 transition-colors">W6</p>
                          <p className="text-xs text-neutral-600 mt-0.5">185</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center gap-3 text-xs pt-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-neutral-400">Actual</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-neutral-400">Projected</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Stats Footer */}
                  <div className="flex justify-between text-sm border-t border-neutral-700/50 pt-3">
                    <div>
                      <p className="text-neutral-400 text-xs">Current</p>
                      <p className="text-lg font-bold gradient-text">192 lbs</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-semibold">↓ 8 lbs</p>
                      <p className="text-green-400 font-bold text-sm">Lost</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-xs font-semibold">Goal</p>
                      <p className="text-green-400 font-bold text-sm">160 lbs</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - AI Meal Suggestions */}
              <div className="w-72 h-96 bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl backdrop-blur-xl p-6 hover:border-purple-400/50 transition-all duration-500 shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-2">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                    <p className="text-sm text-neutral-300 font-semibold">AI Meal Plans</p>
                  </div>
                  <div className="flex-1 space-y-2 overflow-y-auto">
                    <p className="text-xs text-neutral-400 font-semibold">Today's Suggestions</p>
                    
                    {/* Breakfast */}
                    <div className="p-2.5 rounded bg-gradient-to-r from-blue-900/30 to-blue-800/20 border border-blue-500/30 hover:border-blue-400/50 transition-colors">
                      <p className="text-xs text-blue-300 font-semibold uppercase">Breakfast</p>
                      <p className="text-sm font-semibold text-white">Oatmeal with Berries</p>
                      <p className="text-xs text-neutral-300">380 cal • 12g protein • 65g carbs</p>
                    </div>
                    
                    {/* Lunch */}
                    <div className="p-2.5 rounded bg-gradient-to-r from-green-900/30 to-green-800/20 border border-green-500/30 hover:border-green-400/50 transition-colors">
                      <p className="text-xs text-green-300 font-semibold uppercase">Lunch</p>
                      <p className="text-sm font-semibold text-white">Grilled Chicken & Broccoli</p>
                      <p className="text-xs text-neutral-300">520 cal • 45g protein • 32g carbs</p>
                    </div>
                    
                    {/* Dinner */}
                    <div className="p-2.5 rounded bg-gradient-to-r from-purple-900/30 to-pink-800/20 border border-purple-500/30 hover:border-purple-400/50 transition-colors">
                      <p className="text-xs text-purple-300 font-semibold uppercase">Dinner</p>
                      <p className="text-sm font-semibold text-white">Salmon & Sweet Potato</p>
                      <p className="text-xs text-neutral-300">580 cal • 38g protein • 52g carbs</p>
                    </div>
                  </div>
                  <div className="text-xs text-purple-300 font-semibold border-t border-neutral-700/50 pt-2">✓ AI Personalized for Your Goals</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
