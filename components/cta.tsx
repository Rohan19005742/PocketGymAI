"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-b from-blue-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-full h-96 bg-gradient-to-t from-pink-600/15 via-purple-600/15 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Main CTA Card */}
        <div className="relative p-12 sm:p-16 lg:p-20 rounded-3xl border border-blue-400/40 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black/50 backdrop-blur-2xl overflow-hidden group">
          {/* Animated background shine effect */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/0 via-white/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          {/* Animated border glow */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-pink-600/30 opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500 -z-10" />

          <div className="relative z-10 text-center space-y-8">
            {/* Sparkles Badge */}
            <div className="inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/40 backdrop-blur-md w-fit mx-auto group-hover:bg-blue-500/30 transition-colors duration-300">
              <Sparkles className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-bold text-blue-200">AI-Powered Coaching</span>
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h2 className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight">
                Ready to Transform?
              </h2>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto leading-relaxed">
                Start your AI-powered fitness journey today. Get personalized coaching, meal guidance, and progress tracking—completely free to start.
              </p>
            </div>

            {/* Key Benefits Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 py-8 border-y border-blue-500/20">
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl mb-2">💰</div>
                <span className="text-xl font-bold text-white">100% Free</span>
                <span className="text-sm text-neutral-400">to start</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl mb-2">🎁</div>
                <span className="text-xl font-bold text-white">No Card</span>
                <span className="text-sm text-neutral-400">required</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl mb-2">⚡</div>
                <span className="text-xl font-bold text-white">Premium</span>
                <span className="text-sm text-neutral-400">optional</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold text-lg px-12 py-6 rounded-xl shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/80 hover:scale-110 transform"
              >
                <Link href="/chat" className="flex items-center justify-center space-x-2">
                  <span>Start Free Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-blue-400/50 hover:border-blue-300 hover:bg-blue-500/15 text-white font-bold text-lg px-12 py-6 rounded-xl transition-all duration-300 hover:scale-110 transform backdrop-blur-md"
              >
                <Link href="/pricing" className="flex items-center justify-center space-x-2">
                  <span>View Pricing Plans</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Trust Line */}
            <div className="text-sm text-neutral-400 space-y-2 pt-6 border-t border-neutral-700/50">
              <p className="font-bold text-neutral-300">✓ AI Fitness Coach • AI Nutritionist • Progress Tracking</p>
              <p className="text-xs">Questions? We're here to help. Start with confidence.</p>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof */}
        <div className="text-center mt-12 space-y-4">
          <p className="text-neutral-300 text-lg font-bold">
            Join thousands already transforming their fitness
          </p>
          <div className="flex items-center justify-center space-x-3 text-lg">
            <span className="text-blue-400">✓</span>
            <span className="text-neutral-300">Start free • Upgrade anytime • Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
