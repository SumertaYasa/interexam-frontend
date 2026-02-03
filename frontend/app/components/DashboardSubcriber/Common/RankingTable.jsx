import React from "react";
import { getAssetUrl } from "../../../utils/assetHelpper";

function Row({ index, user }) {
  const baseClasses = "flex items-center gap-4 px-4 py-3 rounded-md";
  let rowBg = "bg-white";

  // Highlight 3 besar
  if (index === 0)
    rowBg =
      "bg-gradient-to-r from-yellow-100 to-yellow-50 border border-yellow-200";
  else if (index === 1) rowBg = "bg-slate-100 border border-slate-200";
  else if (index === 2)
    rowBg =
      "bg-gradient-to-r from-orange-100 to-orange-50 border border-orange-200";

  return (
    <div className={`${baseClasses} ${rowBg}`}>
      <div className="w-8 text-center font-bold tracking-tighter leading-none text-slate-700">
        {index + 1}
      </div>
      <div className="flex items-center gap-3">
        <img
          src={user.avatar ? getAssetUrl(user.avatar) : "/person.jpg"}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover border border-slate-200 bg-white"
        />
        <div className="font-bold tracking-tight text-slate-800 leading-none">
          {user.name}
        </div>
      </div>
      <div className="ml-auto w-[120px] text-right text-[11px] font-medium tracking-tight text-slate-500 leading-none">
        {user.correct}/{user.total}
      </div>
      <div className="w-[100px] text-right font-black tracking-tighter text-slate-900 leading-none">
        {user.score}
      </div>
    </div>
  );
}

export default function RankingTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full rounded-md border border-dashed border-slate-300 p-8 text-center">
        <p className="text-slate-400 font-medium text-sm">
          Belum ada peringkat. Jadilah yang pertama mengerjakan!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-neutral-200 overflow-hidden font-sans shadow-sm">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div style={{ width: 32 }}>No</div>
          <div>Nama</div>
          <div className="ml-auto w-[120px] text-right">Statistik</div>
          <div className="w-[100px] text-right">Skor</div>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-2 py-2 bg-white">
        {data.map((user, idx) => (
          <Row key={idx} index={idx} user={user} />
        ))}
      </div>
    </div>
  );
}
