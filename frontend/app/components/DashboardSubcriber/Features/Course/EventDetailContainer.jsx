import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import CardCourse from "../../Common/CardCourse";
import { EVENTS_DATA } from "./dummyData";
import { slugify } from "../../../../utils/slugify";

function EventDetailContainer() {
  const { label } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (label) {
      // --- LOGIKA PENCARIAN BERDASARKAN SLUG/LABEL ---
      const found = EVENTS_DATA.find((e) => slugify(e.title) === label);

      setEvent(found);
    }
    setLoading(false);
  }, [label]);

  if (loading)
    return (
      <div className="w-full py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!event)
    return (
      <div className="w-full py-20 text-center flex flex-col items-center gap-4">
        <h2 className="text-xl font-bold text-slate-700">
          Event tidak ditemukan
        </h2>
        <p className="text-slate-500">Label: {label}</p>
        <Link
          to="/dashboard-subscriber/latihan/events"
          className="text-primary font-bold hover:underline"
        >
          Kembali ke Daftar Event
        </Link>
      </div>
    );

  return (
    <div className="w-full pb-20">
      {/* Header with Banner Background */}
      <div className="relative w-full h-[250px] rounded-2xl overflow-hidden mb-8 shadow-md">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />

        <div className="absolute bottom-0 left-0 p-6 md:p-8 text-white w-full">
          <Link
            to="/dashboard-subscriber/latihan/events"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold text-sm mb-4 bg-black/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-full"
          >
            <ArrowLeft size={14} /> Kembali ke List Event
          </Link>

          <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm font-medium text-slate-200">
            <span className="flex items-center gap-1.5">
              <Calendar size={16} /> {event.date}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin size={16} /> {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* List Paket Soal (Reuse CardCourse) */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-900">
          Paket Soal Event Ini
        </h2>
      </div>

      <div className="flex flex-wrap gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {event.courses && event.courses.length > 0 ? (
          event.courses.map((course) => (
            <CardCourse
              key={course.id}
              title={course.title}
              image={course.image}
              rating={course.rating}
              totalQuestion={course.totalSoal}
              totalSoal={course.totalSoal}
              category={course.category}
              participants={course.participants}
              jenisPaket={course.jenisPaket}
              path={course.path}
            />
          ))
        ) : (
          <div className="w-full py-10 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            Belum ada paket soal untuk event ini.
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailContainer;
