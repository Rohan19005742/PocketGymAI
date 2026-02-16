"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dumbbell, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const { data: session } = useSession();

  return (
    <footer className={`border-t border-blue-500/20 bg-gradient-to-b from-black/80 via-black/60 to-black/90 backdrop-blur-xl ${session ? "ml-56" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-lg group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-300">
                StrivnAI
              </span>
            </Link>
            <p className="text-blue-200/60 text-sm leading-relaxed font-medium">
              Your personal AI gym coach and nutrition guide, always in your pocket.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <p className="text-lg font-bold text-white">Product</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/features" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Features</Link></li>
              <li><Link href="/pricing" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Pricing</Link></li>
              <li><Link href="/workouts" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Workouts</Link></li>
              <li><Link href="/blog" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Blog</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <p className="text-lg font-bold text-white">Company</p>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">About</Link></li>
              <li><Link href="/contact" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Contact</Link></li>
              <li><Link href="/careers" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Careers</Link></li>
              <li><Link href="/press" className="text-blue-200/60 hover:text-blue-300 transition-colors font-medium">Press</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <p className="text-lg font-bold text-white">Follow</p>
            <div className="flex items-center space-x-4">
              <a href="#" className="p-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 hover:text-blue-200 transition-all duration-300 transform hover:scale-110">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/40 hover:text-purple-200 transition-all duration-300 transform hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-pink-500/20 text-pink-300 hover:bg-pink-500/40 hover:text-pink-200 transition-all duration-300 transform hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-500/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-blue-200/40 gap-4">
            <p className="font-medium">&copy; 2026 StrivnAI. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-blue-300 transition-colors font-medium">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-blue-300 transition-colors font-medium">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-blue-300 transition-colors font-medium">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
