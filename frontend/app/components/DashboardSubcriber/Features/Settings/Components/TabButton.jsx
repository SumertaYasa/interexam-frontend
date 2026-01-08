function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${active ? "bg-blue-50 text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600 bg-transparent hover:bg-slate-100"}`}
    >
      {icon} <span>{label}</span>
    </button>
  );
}

export default TabButton;
