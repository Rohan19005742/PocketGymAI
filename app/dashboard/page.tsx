"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, TrendingUp, Target, Scale, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Sample weight data
  const currentWeight = 73.5;
  const targetWeight = 70;
  const previousWeight = 75;
  const lastLoggedDate = "Today at 9:30 AM";

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

  const weightProgress = ((previousWeight - currentWeight) / previousWeight * 100).toFixed(1);
  const weightRemaining = (currentWeight - targetWeight).toFixed(1);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12 fade-in">
          <h1 className="text-4xl font-black mb-2">
            Welcome back, {session?.user?.name}! 👋
          </h1>
          <p className="text-neutral-400">Track your weight progress and achieve your fitness goals.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Current Weight Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 fade-in hover:border-blue-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Current Weight</h3>
              <Scale className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-3xl font-black text-white mb-2">{currentWeight} kg</p>
            <p className="text-sm text-neutral-400">{lastLoggedDate}</p>
          </div>

          {/* Weight Progress Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 fade-in hover:border-green-500/50 transition-all" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Progress</h3>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-3xl font-black text-white mb-2">{(previousWeight - currentWeight).toFixed(1)} kg</p>
            <p className="text-sm text-neutral-400">{weightProgress}% towards goal</p>
          </div>

          {/* Target Weight Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 fade-in hover:border-purple-500/50 transition-all" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Target Weight</h3>
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-3xl font-black text-white mb-2">{targetWeight} kg</p>
            <p className="text-sm text-neutral-400">{weightRemaining} kg remaining</p>
          </div>

          {/* Activity Streak Card */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 fade-in hover:border-orange-500/50 transition-all" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Tracking Streak</h3>
              <Activity className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-3xl font-black text-white mb-2">7</p>
            <p className="text-sm text-neutral-400">days logging weight</p>
          </div>
        </div>

        {/* Recent Weight Entry & AI Coaches */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Recent Weight Entry */}
          <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 fade-in" style={{ animationDelay: "0.4s" }}>
            <h2 className="text-xl font-bold text-white mb-6">Log Today's Weight</h2>
            <form className="space-y-4">
              <div>
                <input
                  type="number"
                  step="0.1"
                  placeholder="Weight in kg"
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg">
                Log Weight
              </Button>
            </form>
          </div>

          {/* AI Coaches Quick Access */}
          <div className="lg:col-span-2 space-y-4">
            {/* AI Coach */}
            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-6 fade-in hover:border-blue-500/50 transition-all" style={{ animationDelay: "0.4s" }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">AI Coach</h3>
                  <p className="text-sm text-neutral-400">Get personalized workout plans and fitness advice</p>
                </div>
                <Link href="/chat">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg">
                    Chat Now
                  </Button>
                </Link>
              </div>
            </div>

            {/* AI Nutritionist */}
            <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-2xl p-6 fade-in hover:border-green-500/50 transition-all" style={{ animationDelay: "0.45s" }}>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">AI Nutritionist</h3>
                  <p className="text-sm text-neutral-400">Get meal plans and nutrition guidance tailored to you</p>
                </div>
                <Link href="/nutritionist">
                  <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg">
                    Chat Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in" style={{ animationDelay: "0.5s" }}>
          <Link href="/progress">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg shadow-blue-500/20">
              View Progress
            </Button>
          </Link>
          <Link href="/chat">
            <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-4 rounded-lg transition-all shadow-lg shadow-purple-500/20">
              Talk to AI Coach
            </Button>
          </Link>
          <Link href="/settings">
            <Button className="w-full bg-gradient-to-r from-neutral-600 to-neutral-700 hover:from-neutral-700 hover:to-neutral-800 text-white font-semibold py-4 rounded-lg transition-all shadow-lg shadow-neutral-500/20">
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
