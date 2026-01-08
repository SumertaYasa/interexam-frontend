function SecurityCard({ label, value, icon, canDelete, onEdit }) {
  return (
    <div className="relative w-[400px] flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
      <div className="w-full flex items-center gap-5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {label}
          </p>
          <p className="text-slate-800 text-[12px] font-bold">{value}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {canDelete && (
          <button className="px-4 py-2 text-red-500 text-xs font-bold hover:bg-red-50 rounded-xl transition-colors">
            Hapus
          </button>
        )}
        <button
          onClick={onEdit}
          className="px-4 py-2 bg-white text-blue-600 text-xs font-bold rounded-xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default SecurityCard;
