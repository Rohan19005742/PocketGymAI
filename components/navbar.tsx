"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Dumbbell, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-blue-500/20">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/60 group-hover:scale-110 transition-all duration-300 transform">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-300">
              StrivnAI
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {session ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-purple-900/20 border border-blue-500/20 backdrop-blur-md hover:border-blue-400/40 transition-all duration-300">
                  <span className="text-2xl">{session.user?.image || "👤"}</span>
                  <div className="hidden sm:block">
                    <p className="text-sm font-bold text-white">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-blue-300">
                      {session.user?.email}
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 hover:border-red-400/60 font-bold flex items-center space-x-2 rounded-lg transition-all duration-300 backdrop-blur-md"
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
                  className="text-neutral-200 hover:text-white hover:bg-blue-500/10 font-semibold transition-all duration-300"
                >
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold shadow-lg shadow-purple-500/40 hover:shadow-purple-500/60 transition-all duration-300 hover:scale-110 transform rounded-lg"
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
