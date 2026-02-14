"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-gradient-to-br from-black via-neutral-900 to-black">
      {/* Gradient mesh background - inspired by Mozart.ai */}
      <div className="absolute inset-0">
        {/* Color blobs with smooth animations */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />
        <div 
          className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/25 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div 
          className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2.5s" }}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-50" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg
          className="w-full h-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Horizontal lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={i * 10}
              x2="100"
              y2={i * 10}
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
            />
          ))}
          {/* Vertical lines */}
          {Array.from({ length: 11 }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={i * 10}
              y1="0"
              x2={i * 10}
              y2="100"
              stroke="url(#lineGradient)"
              strokeWidth="0.5"
            />
          ))}
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#9333EA" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#16A34A" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Animated floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
            style={{
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float 15s ease-in-out ${i * 1.5}s infinite`,
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>
    </div>
  );
}
