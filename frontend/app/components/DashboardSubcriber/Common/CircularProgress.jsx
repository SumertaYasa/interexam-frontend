import React from "react";

function CircularProgress({
  size = 80,
  strokeWidth = 8,
  value = 0,
  maxValue = 10,
}) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min(1, Math.max(0, value / maxValue));
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient
            id="progressGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#22c55e" /> {/* green-500 */}
            <stop offset="100%" stopColor="#4ade80" /> {/* green-400 */}
          </linearGradient>
        </defs>

        {/* Lingkaran Background */}
        <circle
          className="text-slate-100"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />

        <circle
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
          className="transition-all duration-1000 ease-out"
        />
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center font-black text-slate-300"
        style={{ fontSize: size * 0.22 }}
      >
        <span>{maxValue}</span>
      </div>
    </div>
  );
}

export default CircularProgress;
