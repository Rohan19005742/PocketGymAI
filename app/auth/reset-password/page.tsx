"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-red-400">Invalid Reset Link</h1>
          <p className="text-neutral-400">The reset link is missing required parameters.</p>
          <Link href="/auth/forgot-password">
            <Button className="bg-blue-500 hover:bg-blue-600">
              Request a new link
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.password || !formData.confirmPassword) {
      setError("Both password fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to reset password");
        setLoading(false);
        return;
      }

      setSuccess("Password reset successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
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
          <h1 className="text-4xl font-black gradient-text">New Password</h1>
          <p className="text-neutral-400">
            Enter your new password below
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-12 pr-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-white">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
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
            <span>{loading ? "Resetting..." : "Reset Password"}</span>
            {!loading && <ArrowRight className="w-5 h-5" />}
          </Button>
        </form>

        {/* Back to Sign In */}
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
