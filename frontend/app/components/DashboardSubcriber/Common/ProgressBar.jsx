/**
 * ProgressBar
 * Props:
 * - percent: number (0-100) — explicit percent
 * - answered, total: numbers — compute percent as answered/total
 * - value, max: legacy props (kept for backward compatibility)
 */
export function calculatePercentage({
  percent,
  answered,
  total,
  value = 0,
  max = 100,
} = {}) {
  let pct = 0;

  if (typeof percent === "number" && isFinite(percent)) {
    pct = percent;
  } else if (typeof answered === "number" && typeof total === "number") {
    if (total > 0) pct = (answered / total) * 100;
    else pct = 0;
  } else {
    pct = (value / max) * 100;
  }

  // clamp and round
  return Math.round(Math.min(100, Math.max(0, pct)));
}

function ProgressBar({
  value = 0,
  max = 100,
  percent: percentProp,
  answered,
  total,
  colorClass = "bg-[#6054D2]",
  heightClass = "h-2.5",
  className = "",
}) {
  const percentage = calculatePercentage({
    percent: percentProp,
    answered,
    total,
    value,
    max,
  });

  return (
    <div
      className={`w-full flex items-center justify-center gap-2.5 ${className}`}
    >
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        className={`w-full bg-[#E1DEFF] rounded-full ${heightClass}`}
      >
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-xs font-bold text-gray-700">{percentage}%</span>
    </div>
  );
}

export default ProgressBar;
