import React from "react";
import { Link } from "react-router";
import CardProgress from "../../Common/CardProgress";

function CourseGrid() {
  const dataCardProgress = [
    {
      id: 1,
      label: "Paket Soal 1",
      path: "#",
      image: "/person.jpg",
      progress: 30,
    },
    {
      id: 2,
      label: "Paket Soal 2",
      path: "#",
      image: "/person.jpg",
      progress: 20,
    },
    {
      id: 3,
      label: "Paket Soal 3",
      path: "#",
      image: "/person.jpg",
      progress: 9,
    },
    {
      id: 4,
      label: "Paket Soal 3",
      path: "#",
      image: "/person.jpg",
      progress: 9,
    },
  ];

  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex justify-between items-center">
        <h1>Status Ujian Terakhir</h1>
        <Link to={"dashboard/semua-latihan"}>Lihat Semua</Link>
      </div>
      <div className="flex justify-center items-center gap-5">
        {dataCardProgress.map((card) => (
          <CardProgress
            key={card.id}
            label={card.label}
            path={card.path}
            image={card.image}
            progress={card.progress}
          />
        ))}
      </div>
    </div>
  );
}

export default CourseGrid;
