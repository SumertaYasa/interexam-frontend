import React, { useState, useEffect } from "react";
import BreadCrumbs from "../../../Common/BreadCrumbs";
import CardEvent from "./CardEvent";
import { slugify } from "../../../../../utils/slugify";
import { courseService } from "../../../../../services/subscriber";
import { getAssetUrl } from "../../../../../utils/assetHelpper";

function LoadingEvent() {
  return (
    <div className="w-full h-60 flex flex-col items-center justify-center gap-3">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-medium">Memuat daftar event...</p>
    </div>
  );
}

function EventListContainer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA EVENT DARI API ---
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await courseService.getAllEvents();
        if (response && Array.isArray(response)) {
          setEvents(response);
        }
      } catch (error) {
        console.error("Gagal load event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // --- FORMAT TANGGAL HELPER ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full font-sans antialiased px-4 py-8 max-w-screen-xl mx-auto">
      {/* Header Navigation */}
      <div className="mb-8">
        <BreadCrumbs />
        <h1 className="text-3xl font-bold text-slate-900 mt-4">
          Event Tersedia
        </h1>
        <p className="text-slate-500 mt-1">
          Pilih event, kerjakan soal-soal dan kalahkan seluruh peserta.
        </p>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingEvent />
      ) : events.length === 0 ? (
        <div className="w-full py-20 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-slate-500 font-bold">
            Belum ada event yang tersedia saat ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {events.map((evt) => (
            <CardEvent
              key={evt.id}
              id={evt.id}
              title={evt.title}
              date={`${formatDate(evt.date_start)} - ${formatDate(evt.date_end)}`}
              location="Online"
              image={getAssetUrl(evt.image)}
              totalPaket={evt.total_paket || 0}
              path={`/dashboard-subscriber/latihan/events/${slugify(evt.title)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default EventListContainer;
