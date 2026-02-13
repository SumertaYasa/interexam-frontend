import React from "react";
import BreadCrumbs from "../../../Common/BreadCrumbs";
import CardEvent from "./CardEvent";
import { EVENTS_DATA } from "../dummyData";
import { slugify } from "../../../../../utils/slugify";

function EventListContainer() {
  return (
    <div className="w-full font-sans antialiased px-4 py-8">
      {/* Header Navigation */}
      <div className="mb-8">
        <BreadCrumbs />
        <h1 className="text-3xl font-bold text-slate-900">Event Tersedia</h1>
        <p className="text-slate-500 mt-1">
          Pilih event, kerjakan soal-soal dan kalahkan seluruh peserta.
        </p>
      </div>

      {/* Grid Event */}
      <div className="flex flex-wrap gap-6">
        {EVENTS_DATA.map((evt) => (
          <CardEvent
            key={evt.id}
            id={evt.id}
            title={evt.title}
            date={evt.date}
            location={evt.location}
            image={evt.image}
            totalPaket={evt.courses.length}
            path={`/dashboard-subscriber/latihan/events/${slugify(evt.title)}`}
          />
        ))}
      </div>
    </div>
  );
}

export default EventListContainer;
