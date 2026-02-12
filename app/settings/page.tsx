"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    fitnessLevel: session?.user?.fitnessLevel || "Beginner",
    goal: session?.user?.goal || "Build Muscle",
    age: "25",
    weight: "75",
    height: "180",
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/auth/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          name: formData.name,
          fitnessLevel: formData.fitnessLevel,
          goal: formData.goal,
          age: formData.age,
          weight: formData.weight,
          height: formData.height,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to update profile");
        setLoading(false);
        return;
      }

      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/progress">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-black gradient-text">Settings</h1>
              <p className="text-neutral-400 text-sm">Manage your fitness profile</p>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-8 fade-in">
          <h2 className="text-xl font-bold text-white mb-6">Fitness Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {/* Fitness Level */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Fitness Level</label>
              <select
                name="fitnessLevel"
                value={formData.fitnessLevel}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Elite">Elite</option>
              </select>
            </div>

            {/* Goal */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white">Fitness Goal</label>
              <select
                name="goal"
                value={formData.goal}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              >
                <option value="Build Muscle">Build Muscle</option>
                <option value="Lose Weight">Lose Weight</option>
                <option value="Improve Endurance">Improve Endurance</option>
                <option value="Increase Strength">Increase Strength</option>
                <option value="General Fitness">General Fitness</option>
              </select>
            </div>

            {/* Body Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-purple-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>

        {/* Account Actions */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 fade-in" style={{ animationDelay: "0.1s" }}>
          <h2 className="text-xl font-bold text-white mb-6">Account</h2>

          <div className="space-y-4">
            <Button
              onClick={() => signOut({ redirect: true })}
              className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 font-semibold py-3 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Button>

            <div className="p-4 bg-neutral-800/50 border border-neutral-700/50 rounded-lg">
              <p className="text-xs text-neutral-400">
                Account created: {new Date().toLocaleDateString()}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Email: {session?.user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
