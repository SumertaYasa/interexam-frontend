import React from "react";

function CircularProgress({
  size = 80,
  strokeWidth = 8,
  value = 0,
  maxValue = 10,
  colorClass = "text-primary",
}) {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const percentage = Math.min(1, Math.max(0, value / maxValue));
  const offset = circumference - percentage * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />

        <circle
          className={`${colorClass} transition-all duration-1000 ease-out`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={center}
          cy={center}
        />
      </svg>

      <div
        className="absolute flex flex-col items-center justify-center font-bold text-gray-300"
        style={{ fontSize: size * 0.25 }}
      >
        <span>{maxValue}</span>
      </div>
    </div>
  );
}

export default CircularProgress;
