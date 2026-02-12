"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell } from "lucide-react";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PocketGymAI
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/chat"
              className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium"
            >
              AI Coach
            </Link>
            <Link
              href="/workouts"
              className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Workouts
            </Link>
            <Link
              href="/progress"
              className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium"
            >
              Progress
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-900/50"
            >
              Sign In
            </Button>
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
