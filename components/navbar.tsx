"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

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
            {session && (
              <>
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
                <Link
                  href="/settings"
                  className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Settings
                </Link>
                <Link
                  href="/profile"
                  className="text-neutral-300 hover:text-white transition-colors duration-200 font-medium"
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 bg-neutral-900/50 rounded-lg">
                  <span className="text-2xl">{session.user?.image || "👤"}</span>
                  <div className="hidden sm:block">
                    <p className="text-sm font-semibold text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30 font-semibold flex items-center space-x-2"
                  variant="outline"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-neutral-300 hover:text-white hover:bg-neutral-900/50"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg shadow-purple-500/20 transition-all duration-300"
                >
                  <Link href="/auth/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
