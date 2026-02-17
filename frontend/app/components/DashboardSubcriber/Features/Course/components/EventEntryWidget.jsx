import React from "react";
import { Link } from "react-router";
import { Trophy, ChevronRight } from "lucide-react";

function EventEntryWidget() {
  const eventRoute = "/dashboard-subscriber/latihan/events";

  return (
    <Link
      to={eventRoute}
      className="w-full bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 mb-8 cursor-pointer group shadow-lg flex items-center justify-between hover:shadow-xl hover:scale-[1.01] transition-all duration-300 relative overflow-hidden"
    >
      {/* Decorative Background Circle */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

      <div className="flex items-center gap-5 relative z-10">
        <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center text-orange-400 group-hover:scale-110 group-hover:bg-white/20 transition-all shadow-inner">
          <Trophy size={28} />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl tracking-tight mb-1">
            Event & Kompetisi Nasional
          </h2>
          <p className="text-slate-400 text-sm font-medium">
            check untuk informasi event dan tryout lebih lanjut.
          </p>
        </div>
      </div>

      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white group-hover:bg-orange-500 group-hover:text-white transition-all shadow-lg z-10">
        <ChevronRight size={20} />
      </div>
    </Link>
  );
}

export default EventEntryWidget;
