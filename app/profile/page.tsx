"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Edit2, Trophy, Target, Zap, Flame } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

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

  const stats = [
    {
      icon: Trophy,
      label: "Completed Workouts",
      value: session?.user?.completedWorkouts || 0,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
    },
    {
      icon: Flame,
      label: "Current Streak",
      value: `${session?.user?.streakDays || 0} days`,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
    },
    {
      icon: Target,
      label: "Fitness Goal",
      value: session?.user?.goal || "Not set",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Zap,
      label: "Experience Level",
      value: session?.user?.fitnessLevel || "Beginner",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-neutral-700 rounded-3xl p-8 mb-8 fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl shadow-lg shadow-purple-500/30">
                {session?.user?.image || "👤"}
              </div>
              <div>
                <h1 className="text-3xl font-black text-white mb-2">
                  {session?.user?.name}
                </h1>
                <p className="text-neutral-400">{session?.user?.email}</p>
                <p className="text-sm text-neutral-500 mt-2">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link href="/settings">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white flex items-center space-x-2">
                <Edit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 fade-in"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className={`${stat.bgColor} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-neutral-400 text-sm mb-2">{stat.label}</p>
                <p className="text-2xl font-black text-white">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Detailed Stats */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 fade-in" style={{ animationDelay: "0.4s" }}>
          <h2 className="text-2xl font-bold text-white mb-6">Fitness Profile</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-neutral-400 text-sm mb-2">Experience Level</p>
              <p className="text-xl font-semibold text-white bg-neutral-800/50 rounded-lg px-4 py-3">
                {session?.user?.fitnessLevel || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-neutral-400 text-sm mb-2">Primary Goal</p>
              <p className="text-xl font-semibold text-white bg-neutral-800/50 rounded-lg px-4 py-3">
                {session?.user?.goal || "Not specified"}
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-neutral-700">
            <h3 className="text-lg font-bold text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link href="/chat">
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold">
                  Talk to AI Coach
                </Button>
              </Link>
              <Link href="/workouts">
                <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold">
                  Browse Workouts
                </Button>
              </Link>
              <Link href="/progress">
                <Button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold">
                  View Progress
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
