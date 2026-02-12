"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CTA() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/3 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Headline */}
        <div className="space-y-4">
          <h2 className="text-4xl sm:text-5xl font-black">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Join thousands of users who have already started their AI-powered fitness journey. Start for free today.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold text-lg px-8 py-6 rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 hover:shadow-purple-500/50"
          >
            <Link href="/chat" className="flex items-center space-x-2">
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            className="border-neutral-700 hover:bg-neutral-900/50 text-white font-semibold text-lg px-8 py-6 rounded-lg transition-all duration-300"
          >
            Schedule a Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="pt-8 text-sm text-neutral-500 space-y-2">
          <p>🔒 No credit card required • 7-day free access • Cancel anytime</p>
          <p className="text-xs">Join our community of fitness enthusiasts</p>
        </div>
      </div>
    </section>
  );
}
