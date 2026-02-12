"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, Award, Flame, Target } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

// Sample data
const progressData = [
  { date: "Mon", workouts: 1, calories: 450 },
  { date: "Tue", workouts: 1, calories: 520 },
  { date: "Wed", workouts: 2, calories: 890 },
  { date: "Thu", workouts: 1, calories: 480 },
  { date: "Fri", workouts: 2, calories: 920 },
  { date: "Sat", workouts: 1, calories: 510 },
  { date: "Sun", workouts: 0, calories: 0 },
];

const bodyMetrics = [
  { name: "Weight", value: 75, unit: "kg", change: "-2.5%" },
  { name: "Body Fat", value: 18, unit: "%", change: "-1.2%" },
  { name: "Muscle Mass", value: 68, unit: "kg", change: "+1.8%" },
  { name: "Strength", value: 340, unit: "lbs", change: "+15%" },
];

const workoutStats = [
  { name: "Strength", value: 35 },
  { name: "Cardio", value: 25 },
  { name: "Flexibility", value: 20 },
  { name: "Recovery", value: 20 },
];

const colors = ["#3B82F6", "#EC4899", "#10B981", "#F59E0B"];

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-950 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header with personalization */}
        <div className="space-y-4 mb-12 fade-in">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold text-blue-400">
              {session.user?.fitnessLevel} • {session.user?.goal}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black">
            Progress Dashboard
          </h1>
          <p className="text-neutral-400 text-lg">
            Your personal data showing progress towards <span className="font-semibold text-blue-400">{session.user?.goal}</span>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {bodyMetrics.map((metric, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50 hover:bg-neutral-900 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm text-neutral-400 font-semibold">{metric.name}</h3>
                <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-3xl font-bold">
                  {metric.value}
                  <span className="text-lg text-neutral-400 ml-1">{metric.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Activity */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <h2 className="text-xl font-bold mb-6">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="date" stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="calories" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Workout Distribution */}
          <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
            <h2 className="text-xl font-bold mb-6">Workout Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workoutStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {workoutStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2 text-sm">
              {workoutStats.map((stat, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }} />
                  <span className="text-neutral-400">{stat.name}</span>
                  <span className="ml-auto text-white font-semibold">{stat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="p-6 rounded-2xl border border-neutral-800 bg-neutral-900/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center space-x-2">
              <Award className="w-5 h-5 text-yellow-400" />
              <span>Recent Achievements</span>
            </h2>
            <Button variant="outline" className="border-neutral-700 text-neutral-400">
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Flame, title: "7-Day Streak", description: "Completed 7 consecutive workouts" },
              { icon: Target, title: "Goal Crusher", description: "Completed 50 workouts this month" },
              { icon: TrendingUp, title: "PR Achieved", description: "New personal record on bench press" },
            ].map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{achievement.title}</h3>
                      <p className="text-sm text-neutral-400">{achievement.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
