"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, TrendingUp, Plus, Calendar } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ComposedChart, Legend } from "recharts";
import { Button } from "@/components/ui/button";

interface WeightEntry {
  date: string;
  weight: number;
  bodyFatPercentage?: number;
}

export default function ProgressPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [weightHistory, setWeightHistory] = useState<WeightEntry[]>([
    { date: "Mon", weight: 75, bodyFatPercentage: 18 },
    { date: "Tue", weight: 74.8, bodyFatPercentage: 17.9 },
    { date: "Wed", weight: 74.5, bodyFatPercentage: 17.8 },
    { date: "Thu", weight: 74.3, bodyFatPercentage: 17.7 },
    { date: "Fri", weight: 74.1, bodyFatPercentage: 17.6 },
    { date: "Sat", weight: 73.9, bodyFatPercentage: 17.5 },
    { date: "Sun", weight: 73.5, bodyFatPercentage: 17.4 },
  ]);

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

  const handleAddWeight = (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight) return;

    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const newEntry: WeightEntry = {
      date: today,
      weight: parseFloat(weight),
      bodyFatPercentage: bodyFat ? parseFloat(bodyFat) : undefined,
    };

    setWeightHistory((prev) => [...prev, newEntry]);
    setWeight("");
    setBodyFat("");
  };

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 0;
  const previousWeight = weightHistory[0]?.weight || 0;
  const weightChangeValue = currentWeight - previousWeight;
  const currentBodyFat = weightHistory[weightHistory.length - 1]?.bodyFatPercentage || 0;
  const currentFatMass = (currentWeight * currentBodyFat) / 100;
  const currentMuscleMass = currentWeight - currentFatMass;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-neutral-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-full mb-4">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs sm:text-sm font-semibold text-blue-400">
              {session?.user?.goal}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-2">
            Track Your Progress
          </h1>
          <p className="text-neutral-400">
            Monitor your weight and body composition to stay motivated.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Current Weight */}
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all">
            <h3 className="text-sm font-semibold text-neutral-400 mb-2">Current Weight</h3>
            <p className="text-4xl font-black text-blue-400 mb-1">
              {currentWeight} <span className="text-lg text-neutral-400">kg</span>
            </p>
            <p className={`text-sm font-semibold ${weightChangeValue < 0 ? "text-green-400" : "text-red-400"}`}>
              {weightChangeValue < 0 ? "📉" : "📈"} {Math.abs(weightChangeValue).toFixed(1)} kg
            </p>
          </div>

          {/* Weekly Change */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all">
            <h3 className="text-sm font-semibold text-neutral-400 mb-2">Weekly Change</h3>
            <p className="text-4xl font-black text-purple-400 mb-1">
              <span className={weightChangeValue < 0 ? "text-green-400" : "text-red-400"}>
                {weightChangeValue < 0 ? "-" : "+"}{Math.abs(weightChangeValue).toFixed(1)}
              </span>
              <span className="text-lg text-neutral-400"> kg</span>
            </p>
            <p className="text-sm text-neutral-400">
              From {previousWeight} kg
            </p>
          </div>

          {/* Body Fat */}
          <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 rounded-2xl p-6 hover:border-orange-500/50 transition-all">
            <h3 className="text-sm font-semibold text-neutral-400 mb-2">Body Fat %</h3>
            <p className="text-4xl font-black text-orange-400 mb-1">
              {currentBodyFat > 0 ? currentBodyFat.toFixed(1) : "--"}
            </p>
            <p className="text-sm text-neutral-400">
              {currentBodyFat > 0 ? (currentBodyFat < 15 ? "💪 Athletic" : currentBodyFat < 20 ? "👍 Fit" : currentBodyFat < 25 ? "⚖️ Average" : "📈 Higher") : "Not logged"}
            </p>
          </div>
        </div>

        {/* Body Composition */}
        {currentBodyFat > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all">
              <h3 className="text-sm font-semibold text-neutral-400 mb-2">Fat Mass</h3>
              <p className="text-4xl font-black text-red-400 mb-1">
                {currentFatMass.toFixed(1)} <span className="text-lg text-neutral-400">kg</span>
              </p>
              <p className="text-sm text-neutral-400">
                {currentBodyFat.toFixed(1)}% of body weight
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all">
              <h3 className="text-sm font-semibold text-neutral-400 mb-2">Muscle Mass</h3>
              <p className="text-4xl font-black text-green-400 mb-1">
                {currentMuscleMass.toFixed(1)} <span className="text-lg text-neutral-400">kg</span>
              </p>
              <p className="text-sm text-neutral-400">
                {(100 - currentBodyFat).toFixed(1)}% of body weight
              </p>
            </div>
          </div>
        )}

        {/* Add Weight Form */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            Log Your Progress
          </h2>
          <form onSubmit={handleAddWeight} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="number"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight (kg)"
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <input
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="Body Fat % (optional)"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <Plus className="w-5 h-5" />
              Log Entry
            </Button>
          </form>
        </div>

        {/* Weight History Chart */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white mb-6">Progress Chart</h2>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={weightHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
              <XAxis dataKey="date" stroke="#666" style={{ fontSize: "12px" }} />
              <YAxis yAxisId="left" stroke="#666" style={{ fontSize: "12px" }} />
              <YAxis yAxisId="right" orientation="right" stroke="#666" style={{ fontSize: "12px" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #444",
                  borderRadius: "8px",
                  padding: "12px",
                }}
                cursor={{ strokeDasharray: "3 3" }}
                formatter={(value: any) => {
                  if (typeof value === "number") {
                    return value.toFixed(1);
                  }
                  return value;
                }}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line
                yAxisId="left"
                type="natural"
                dataKey="weight"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
                name="Weight (kg)"
              />
              <Line
                yAxisId="right"
                type="natural"
                dataKey="bodyFatPercentage"
                stroke="#EF4444"
                strokeWidth={3}
                dot={{ fill: "#EF4444", r: 4 }}
                activeDot={{ r: 6 }}
                name="Body Fat %"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Entries */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Recent Entries</h2>
          <div className="space-y-3">
            {weightHistory
              .slice()
              .reverse()
              .map((entry, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  <span className="text-neutral-300 font-medium">{entry.date}</span>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-white font-semibold">{entry.weight} kg</p>
                      {entry.bodyFatPercentage && (
                        <p className="text-sm text-neutral-400">{entry.bodyFatPercentage.toFixed(1)}% BF</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
