import React from "react";
import { Link } from "react-router-dom";
import BreadCrumbs from "../../../Common/BreadCrumbs"; // Sesuaikan path
import CardEventResult from "./CardEventResult";
import { ArrowLeft } from "lucide-react";

export default function EventResultWrapper() {
  // DATA DUMMY SEMENTARA
  const dummyFinishedEvents = [
    {
      id: 1,
      title: "Tryout Akbar UTBK SNBT 2026 Batch 1",
      date: "19 Feb 2026",
      image: "/person.jpg",
      slug: "tryout-akbar-utbk-snbt-2026-batch-1",
    },
    {
      id: 2,
      title: "Simulasi Ujian CPNS Kementerian 2026",
      date: "10 Jan 2026",
      image: "/person.jpg",
      slug: "simulasi-ujian-cpns-2026",
    },
  ];

  return (
    <div className="w-full font-sans antialiased px-4 py-8 max-w-screen-xl mx-auto min-h-screen">
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

      <div className="flex flex-wrap gap-6">
        {dummyFinishedEvents.map((evt) => (
          <CardEventResult
            key={evt.id}
            id={evt.id}
            title={evt.title}
            date={evt.date}
            image={evt.image}
            path={`/dashboard-subscriber/latihan/events/results/${evt.slug}`}
          />
        ))}
      </div>
    </div>
  );
}
