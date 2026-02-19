import React from "react";
import { Calendar, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router";

function CardEvent({ id, title, date, location, image, totalPaket, path }) {
  return (
    <Link
      to={path}
      className="group relative w-full md:w-[320px] h-[200px] rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all border border-slate-200 block"
    >
      {/* Background Image */}
      <img src={image} alt={title} className="w-full h-full object-cover " />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
        {/* Top Badges */}
        <div className="flex justify-between items-start">
          <span className="bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded shadow-sm tracking-wider uppercase">
            Official Event
          </span>
          <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/20">
            {totalPaket} Paket Soal
          </span>
        </div>

        {/* Bottom Info */}
        <div>
          <h3 className="font-bold text-lg leading-tight mb-2 group-hover:text-orange-300 transition-colors line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} />
              <span>{date}</span>
            </div>
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin size={14} />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hover Effect Icon */}
      <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-orange-500 rounded-full p-1 text-white shadow-lg transform translate-x-2 group-hover:translate-x-0">
        <ChevronRight size={16} />
      </div>
    </Link>
  );
}

export default CardEvent;
