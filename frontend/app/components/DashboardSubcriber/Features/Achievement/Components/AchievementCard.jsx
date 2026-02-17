export default function AchievementCard({ children, className }) {
  return (
    <div
      className={`rounded-[10px] p-10 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 duration-300 ${className}`}
    >
      {children}
    </div>
  );
}
