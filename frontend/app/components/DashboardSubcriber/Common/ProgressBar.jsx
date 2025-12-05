function ProgressBar({
  value = 0,
  max = 100,
  colorClass = "bg-[#6054D2]",
  heightClass = "h-2.5",
  className = "",
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div
      className={`w-full flex items-center justify-center gap-2.5 ${className}`}
    >
      <div className={`w-full bg-[#E1DEFF] rounded-full ${heightClass}`}>
        <div
          className={`${colorClass} ${heightClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-xs font-bold text-gray-700">
        {Math.round(percentage)}%
      </span>
    </div>
  );
}

export default ProgressBar;
