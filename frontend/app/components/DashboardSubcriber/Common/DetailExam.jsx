import React from "react";
import { useLoaderData, Link } from "react-router";
import BreadCrumbs from "./BreadCrumbs";

const DATA_UJIAN = [
  {
    id: 1,
    label: "Paket Soal 1 - Logika Dasar",
    description:
      "Latihan logika dasar untuk melatih kemampuan berpikir kritis dan pemecahan masalah sederhana. lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem lorem",
    image: "/person.jpg",
    progress: 30,
    totalSoal: 50,
  },
  {
    id: 2,
    label: "Paket Soal 2 - TPA Kuantitatif",
    description:
      "Tes Potensi Akademik fokus pada hitungan matematika, deret angka, dan logika aritmatika.",
    image: "/person.jpg",
    progress: 75,
    totalSoal: 40,
  },
  {
    id: 3,
    label: "Paket Soal 3 - Bahasa Inggris",
    description:
      "Melatih kemampuan grammar, reading comprehension, dan vocabulary.",
    image: "/person.jpg",
    progress: 10,
    totalSoal: 60,
  },
];

export async function loader({ params }) {
  const idUrl = params.id;

  const idNumber = Number(idUrl);

  const exam = DATA_UJIAN.find((exam) => exam.id === idNumber);

  return exam;
}

function DetailExam({ path }) {
  const examData = useLoaderData();

  return (
    <div className="w-full">
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" />
        </div>
      </nav>
      <div className="px-7-5 py-5 flex flex-col gap-5">
        <BreadCrumbs />
        <div className="flex gap-5 w-full ">
          <div className="w-[600px] h-[400px] overflow-hidden rounded-[10px]">
            <img src="/person.jpg" className="w-full" />
          </div>
          <div className="flex flex-col justify-between items-start w-[60%]">
            <div className="flex flex-col gap-6">
              <h1 className="text-heading-3 font-semibold font-sora">
                {examData.label}
              </h1>
              <div className="flex items-center gap-5 *:border *:px-2.5 *:py-1 *:rounded ">
                <span className="text-body-xs-medium">
                  {examData.totalSoal} soal
                </span>
                <span className="text-body-xs-medium">
                  {examData.progress}%
                </span>
              </div>
              <p className="text-justify text-body-s-regular">
                {examData.description}
              </p>
            </div>
            <Link
              to={path}
              className="rounded px-4 py-2.5 bg-primary hover:bg-primary/80 text-white transition-colors duration-300"
            >
              Mulai kerjakan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailExam;
