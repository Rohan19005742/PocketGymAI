"use client";

import { useEffect, useState } from "react";

const stats = [
  {
    number: 100,
    suffix: "%",
    label: "Free",
    icon: "🚀",
  },
  {
    number: 2,
    suffix: "+",
    label: "AI Coaches",
    icon: "🤖",
  },
  {
    number: 24,
    suffix: "/7",
    label: "Always On",
    icon: "⚡",
  },
];

function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export function Stats() {
  return (
    <section className="py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96 bg-gradient-to-r from-blue-600/15 via-purple-600/15 to-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-20 space-y-6">
          <h2 className="text-5xl sm:text-6xl font-black bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent leading-tight">
            Trusted by Fitness Enthusiasts
          </h2>
          <p className="text-xl text-neutral-300">Join a growing community transforming their health</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative text-center p-10 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-xl hover:backdrop-blur-2xl transition-all duration-500 hover:border-blue-400/80 hover:shadow-2xl hover:shadow-blue-500/30 hover:-translate-y-2 transform"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon */}
              <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>

              {/* Counter */}
              <div className="space-y-3">
                <div className="text-6xl sm:text-7xl font-black bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                  <CountUp end={stat.number} />
                  <span className="text-4xl">{stat.suffix}</span>
                </div>
                <p className="text-neutral-300 text-xl font-bold">
                  {stat.label}
                </p>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-xl" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
