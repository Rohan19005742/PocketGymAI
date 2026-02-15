"use client";

import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Flame, TrendingUp, Calendar, Trophy } from "lucide-react";

export function PersonalizedDashboard() {
  const { data: session } = useSession();

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: session?.user?.streakDays || 0,
      unit: "days",
      color: "bg-orange-500/10 border-orange-500/30",
    },
    {
      icon: Calendar,
      label: "This Week",
      value: 4,
      unit: "workouts",
      color: "bg-blue-500/10 border-blue-500/30",
    },
    {
      icon: TrendingUp,
      label: "Total",
      value: session?.user?.completedWorkouts || 0,
      unit: "completed",
      color: "bg-green-500/10 border-green-500/30",
    },
    {
      icon: Trophy,
      label: "Level",
      value: session?.user?.fitnessLevel || "Pro",
      color: "bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Welcome Section */}
        <div className="space-y-4 fade-in">
          <h1 className="text-4xl sm:text-5xl font-black">
            Welcome back, <span className="gradient-text">{session?.user?.name}</span>! 
            <span className="text-4xl ml-2">{session?.user?.image || "👤"}</span>
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl">
            You're on a <span className="text-orange-400 font-semibold">{session?.user?.streakDays || 0}-day streak!</span> Keep pushing towards your goal of <span className="text-blue-400 font-semibold">{session?.user?.goal}</span>.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl border ${stat.color} hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}
              >
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className="w-5 h-5 text-current" />
                </div>
                <p className="text-neutral-400 text-sm mb-2">{stat.label}</p>
                <div className="space-y-1">
                  <p className="text-3xl font-black">{stat.value}</p>
                  <p className="text-xs text-neutral-500">{stat.unit}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">What's next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Start AI Coach",
                description: "Get personalized workout recommendations",
                href: "/chat",
                color: "from-blue-500 to-purple-600",
              },
              {
                title: "AI Nutritionist",
                description: "Get meal plans and nutrition advice",
                href: "/nutritionist",
                color: "from-green-500 to-emerald-600",
              },
              {
                title: "View Progress",
                description: "Track your fitness journey",
                href: "/progress",
                color: "from-orange-500 to-pink-600",
              },
            ].map((action, index) => (
              <Link href={action.href} key={index}>
                <div className="group relative h-full p-6 rounded-2xl border border-border bg-card/50 hover:bg-card transition-all duration-300 hover:border-border cursor-pointer overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity transition-all duration-300" />
                  <div className="relative z-10 space-y-3">
                    <h3 className="text-lg font-bold">{action.title}</h3>
                    <p className="text-neutral-400 text-sm">{action.description}</p>
                    <div className="flex items-center space-x-2 text-blue-400 group-hover:space-x-3 transition-all">
                      <span>Get started</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Activity</h2>
          <div className="p-6 rounded-2xl border border-border bg-card/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-semibold">Completed Chest Day</p>
                  <p className="text-sm text-muted-foreground">Yesterday at 6:30 PM</p>
                </div>
                <div className="text-green-400 font-semibold">+500 XP</div>
              </div>
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div>
                  <p className="font-semibold">7-Day Streak Achieved</p>
                  <p className="text-sm text-muted-foreground">Last Sunday</p>
                </div>
                <div className="text-yellow-400 font-semibold">🔥 Streak!</div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Started AI Coaching</p>
                  <p className="text-sm text-neutral-400">Last Tuesday</p>
                </div>
                <div className="text-blue-400 font-semibold">+1000 XP</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
