import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../../Common/BreadCrumbs"; // Sesuaikan path
import CardEventResult from "./CardEventResult";
import { ArrowLeft, Loader2 } from "lucide-react";
import { courseService } from "../../../../../services/subscriber"; // Sesuaikan path
import { slugify } from "../../../../../utils/slugify";
import { getAssetUrl } from "../../../../../utils/assetHelpper";

export default function EventResultWrapper() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA EVENT ---
  useEffect(() => {
    const fetchFinishedEvents = async () => {
      try {
        setLoading(true);
        // Ambil semua event dari API
        const response = await courseService.getAllEvents();

        if (response && Array.isArray(response)) {
          const now = new Date();

          // FILTER: Hanya ambil event yang tanggal selesainya sudah lewat (Event Selesai)
          const finishedEvents = response.filter((evt) => {
            const endDate = new Date(evt.date_end);
            return endDate < now;
          });

          setEvents(finishedEvents);
        }
      } catch (error) {
        console.error("Gagal memuat history event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinishedEvents();
  }, []);

  // --- HELPER FORMAT TANGGAL ---
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="w-full font-sans antialiased px-4 py-8 max-w-screen-xl mx-auto min-h-screen">
      {/* Header Info */}
      <div className="mt-4 mb-8">
        <Link
          to="/dashboard-subscriber/latihan/events"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary font-medium mb-4 transition-colors"
        >
          <ArrowLeft size={18} /> Kembali ke Event Tersedia
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Rapor & Hasil Event
        </h1>
        <p className="text-slate-500 mt-2">
          Lihat kembali statistik pengerjaan dan peringkat akhirmu pada event
          yang telah selesai.
        </p>
      </div>

      {/* Konten Utama */}
      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="animate-spin" size={40} />
          <p className="font-medium">Memuat history event...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="w-full py-20 text-center bg-white border border-dashed border-slate-300 rounded-2xl">
          <p className="text-slate-500 font-medium">
            Belum ada event yang telah selesai saat ini.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {events.map((evt) => (
            <CardEventResult
              key={evt.id}
              id={evt.id}
              title={evt.title}
              date={`${formatDate(evt.date_start)} - ${formatDate(evt.date_end)}`}
              image={getAssetUrl(evt.image)}
              // Kirim slug ke URL detailnya (contoh: /results/tryout-utbk)
              path={`/dashboard-subscriber/latihan/events/results/${slugify(evt.title)}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
