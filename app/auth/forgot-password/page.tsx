"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Mail, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Email is required");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to send reset email");
        setLoading(false);
        return;
      }

      setSuccess(
        "Password reset link sent to your email! Please check your inbox."
      );
      setEmail("");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-md w-full space-y-8 fade-in">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/auth/signin" className="inline-flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-semibold">Back to Sign In</span>
          </Link>
          <h1 className="text-4xl font-black gradient-text">Reset Password</h1>
          <p className="text-neutral-400">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <span>{loading ? "Sending..." : "Send Reset Link"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <p className="text-neutral-400">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
