import React from "react";
import { useLoaderData, Link, useLocation } from "react-router";
import { useFolder } from "../../../../context/FolderContext.tsx";
import BreadCrumbs from "../../Common/BreadCrumbs";
import RankingTable from "../../Common/RankingTable";
import ProgressBar, { calculatePercentage } from "../../Common/ProgressBar";
import { slugify } from "../../../../utils/slugify.ts";

// latihan (unanswered / course) exams
const DATA_UJIAN_LATIHAN = [
  {
    id: "lat-1",
    label: "Tes Bahasa Inggris: Structure & Usage",
    description:
      "Latihan struktur dan penggunaan bahasa Inggris untuk meningkatkan grammar dan fluency.",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 50 },
    totalSoal: 50,
  },
  {
    id: "lat-2",
    label: "Tryout Matematika Saintek",
    description:
      "Tryout soal matematika saintek untuk melatih kecepatan dan ketepatan dalam menyelesaikan soal.",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 60 },
    totalSoal: 60,
  },
];

// status (already answered / progress) exams
const DATA_UJIAN_STATUS = [
  {
    id: "st-1",
    label: "Paket Soal 1 - Logika Dasar",
    description:
      "Latihan logika dasar untuk melatih kemampuan berpikir kritis dan pemecahan masalah sederhana.",
    image: "/person.jpg",
    progress: { answered: 15, totalSoal: 50 },
    totalSoal: 50,
  },
  {
    id: "st-2",
    label: "Paket Soal 2 - TPA Kuantitatif",
    description:
      "Tes Potensi Akademik fokus pada hitungan matematika, deret angka, dan logika aritmatika.",
    image: "/person.jpg",
    progress: { answered: 30, totalSoal: 40 },
    totalSoal: 40,
  },
  {
    id: "st-3",
    label: "Ujian Logika Dasar Sekolah Menengah Atas",
    description:
      "Ujian logika dasar yang biasa digunakan untuk persiapan seleksi akademik.",
    image: "/person.jpg",
    progress: { answered: 5, totalSoal: 40 },
    totalSoal: 40,
  },
];

export async function loader({ params, request }) {
  const labelParam = params.label;
  const url = request?.url ?? "";

  // Determine which dataset to search based on the route path
  let dataset = null;
  if (url.includes("/dashboard-subscriber/status-ujian-terakhir/")) {
    dataset = DATA_UJIAN_STATUS;
  } else if (url.includes("/dashboard-subscriber/latihan/")) {
    dataset = DATA_UJIAN_LATIHAN;
  } else {
    // fallback: search both
    const found =
      DATA_UJIAN_LATIHAN.find((e) => slugify(e.label) === labelParam) ||
      DATA_UJIAN_STATUS.find((e) => slugify(e.label) === labelParam);
    return found || null;
  }

  const exam = dataset.find((exam) => slugify(exam.label) === labelParam);
  return exam || null;
}

function DetailExam() {
  const examData = useLoaderData();
  const { examProgress } = useFolder();

  if (!examData) {
    return (
      <div className="w-full px-7-5 py-10 text-center">
        {/* Placeholder: font-bold tracking-tight */}
        <p className="text-slate-500 font-bold tracking-tight text-sm">
          Ujian tidak ditemukan.
        </p>
      </div>
    );
  }

  const answeredCount =
    examProgress[examData.id] !== undefined
      ? examProgress[examData.id]
      : examData.progress?.answered || 0;

  const location = useLocation();
  const origin = location?.state?.from ?? null;

  const slug = slugify(examData.label);
  const attemptPath =
    origin === "status"
      ? `/dashboard-subscriber/status-ujian-terakhir/${slug}/attempt`
      : `/dashboard-subscriber/latihan/${slug}/attempt`;

  function Badge() {
    const base =
      "text-[11px] font-bold py-1 px-3 rounded-full border flex items-center gap-2 tracking-tight leading-none";
    const passedBadge = location?.state?.badge;

    if (passedBadge && passedBadge.label) {
      return (
        <span className={`${base} ${passedBadge.classes}`}>
          {passedBadge.label}
        </span>
      );
    }

    return null;
  }

  return (
    <div className="w-full font-sans antialiased">
      <nav className="w-full px-7-5 py-3.5">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" />
        </div>
      </nav>

      <div className="px-7-5 py-5 flex flex-col gap-5">
        <BreadCrumbs />
        <div className="flex gap-5 w-full">
          <div className="w-[600px] h-[400px] overflow-hidden rounded-[10px]">
            <img src={examData.image} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-between items-start w-[60%]">
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-slate-900 leading-tight">
                  {examData.label}
                </h1>
              </div>
              <div className="flex items-center gap-5 w-[60%]">
                <span className="text-xs font-bold text-slate-700 flex gap-1 border border-slate-200 px-3 py-1.5 rounded tracking-tight leading-none">
                  {examData.totalSoal} <span>soal</span>
                </span>
                <ProgressBar
                  answered={answeredCount}
                  total={examData.progress?.totalSoal}
                />
              </div>
            </div>

            <Link
              to={attemptPath}
              className="rounded px-6 py-3 bg-primary hover:bg-primary/80 text-white font-bold text-sm tracking-tight transition-all duration-300 active:scale-95 shadow-lg shadow-primary/20"
            >
              Mulai kerjakan
            </Link>
          </div>
        </div>

        <div className="py-5">
          <p className="text-justify text-sm font-medium text-slate-500 w-full max-w-[1000px] leading-relaxed tracking-tight">
            {examData.description}
          </p>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">
            Peringkat
          </h2>
          <RankingTable />
        </div>
      </div>
    </div>
  );
}

export default DetailExam;
