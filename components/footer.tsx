"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Dumbbell, Github, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  const { data: session } = useSession();

  return (
    <footer className={`border-t border-neutral-800 bg-neutral-950/50 backdrop-blur-sm ${session ? "ml-56" : ""}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Dumbbell className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PocketGymAI
              </span>
            </Link>
            <p className="text-neutral-400 text-sm">
              Your personal AI gym coach, always in your pocket.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Product</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/features" className="text-neutral-400 hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="text-neutral-400 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/workouts" className="text-neutral-400 hover:text-white transition-colors">Workouts</Link></li>
              <li><Link href="/blog" className="text-neutral-400 hover:text-white transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-neutral-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="text-neutral-400 hover:text-white transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <p className="text-sm font-semibold text-white">Follow</p>
            <div className="flex items-center space-x-3">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-neutral-400">
            <p>&copy; 2026 PocketGymAI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/cookies" className="hover:text-white transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
