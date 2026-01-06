import React from "react";

export default function BarChart({ mode, data }) {
  // King Yasa, kita pastikan maxValue selalu aman agar tidak terjadi pembagian dengan nol
  const maxValue = 10;
  const yAxisTicks = [10, 8, 6, 4, 2, 0];

  return (
    <div className="bg-white border border-[#8A8A8A] rounded-[10px] p-8 shadow-sm flex-1 animate-in fade-in duration-500">
      <div className="mb-10">
        <h3 className="text-lg font-bold text-slate-900">Aktivitas {mode}</h3>
        <p className="text-xs text-slate-400 font-medium">
          Lihat perkembangan hasil belajarmu selama beberapa{" "}
          {mode === "Mingguan" ? "minggu" : "hari"} terakhir.
        </p>
      </div>

      {/* Kontainer Grafik Utama */}
      <div className="relative h-64 flex flex-col justify-between">
        {/* Y-Axis Lines (Garis Bantu) */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
          {yAxisTicks.map((tick) => (
            <div key={tick} className="flex items-center w-full gap-4">
              <span className="text-[10px] font-bold text-slate-400 w-4 text-right">
                {tick}
              </span>
              <div className="flex-1 border-t border-slate-100"></div>
            </div>
          ))}
        </div>

        {/* Bars Container */}
        <div className="flex items-end justify-between h-full pl-8 pr-4 relative z-10">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="group relative flex flex-col items-center flex-1 h-full justify-end"
            >
              {/* Tooltip on Hover */}
              <div className="absolute -top-10 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity font-bold z-20">
                {item.value} poin
              </div>

              {/* Bar (Batang Grafik) */}
              <div
                className="w-8 bg-blue-500 rounded-sm transition-all duration-700 hover:bg-blue-600 cursor-pointer shadow-sm shadow-blue-100"
                style={{ height: `${(item.value / maxValue) * 100}%` }}
              ></div>

              {/* X-Axis Label */}
              <span className="absolute -bottom-8 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="h-8"></div>
    </div>
  );
}
