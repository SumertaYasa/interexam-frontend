import React from "react";
import { Link } from "react-router";
import CardProgress from "../../Common/CardProgress";
import { slugify } from "../../../../utils/slugify.ts";
function CourseGrid() {
  const dataCardProgress = [
    {
      id: 1,
      label: "Paket Soal 1",
      image: "/person.jpg",
      progress: { answered: 2, totalSoal: 10 }, 
    },
    {
      id: 2,
      label: "Paket Soal 2",
      image: "/person.jpg",
      progress: { answered: 2, totalSoal: 20 }, 
    },
    {
      id: 3,
      label: "Paket Soal 3",
      image: "/person.jpg",
      progress: { answered: 1, totalSoal: 11 }, 
    },
    {
      id: 4,
      label: "Paket Soal 3",
      image: "/person.jpg",
      progress: { answered: 1, totalSoal: 11 }, 
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <h1 className="text-heading-5 font-semibold">Status Ujian Terakhir</h1>
        <Link
          to={"/dashboard-subscriber/status-ujian-terakhir"}
          className="underline font-semibold"
        >
          Lihat Semua
        </Link>
      </div>
      <div className="flex justify-center items-center gap-5">
        {dataCardProgress.map((card) => (
          <CardProgress
            key={card.id}
            label={card.label}
            path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(card.label)}`}
            linkState={{
              from: "status",
              badge: {
                label: "Status Ujian Terakhir",
                classes: "border-yellow-300 bg-yellow-50 text-yellow-800",
              },
            }}
            image={card.image}
            progress={card.progress}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseGrid;
