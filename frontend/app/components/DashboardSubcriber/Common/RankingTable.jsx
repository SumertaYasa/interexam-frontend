import React, { useEffect, useState } from "react";

const TOP_TEN = [
  {
    id: 1,
    name: "Albert",
    avatar: "/person.jpg",
    correct: 47,
    total: 50,
    score: 2450,
  },
  {
    id: 2,
    name: "Roy",
    avatar: "/person.jpg",
    correct: 47,
    total: 50,
    score: 2450,
  },
  {
    id: 3,
    name: "Anna",
    avatar: "/person.jpg",
    correct: 47,
    total: 50,
    score: 2450,
  },
  {
    id: 4,
    name: "Bella",
    avatar: "/person.jpg",
    correct: 45,
    total: 50,
    score: 2400,
  },
  {
    id: 5,
    name: "Chris",
    avatar: "/person.jpg",
    correct: 44,
    total: 50,
    score: 2360,
  },
  {
    id: 6,
    name: "Dwi",
    avatar: "/person.jpg",
    correct: 42,
    total: 50,
    score: 2300,
  },
  {
    id: 7,
    name: "Eka",
    avatar: "/person.jpg",
    correct: 40,
    total: 50,
    score: 2200,
  },
  {
    id: 8,
    name: "Faisal",
    avatar: "/person.jpg",
    correct: 39,
    total: 50,
    score: 2150,
  },
  {
    id: 9,
    name: "Gita",
    avatar: "/person.jpg",
    correct: 38,
    total: 50,
    score: 2100,
  },
  {
    id: 10,
    name: "Hendra",
    avatar: "/person.jpg",
    correct: 36,
    total: 50,
    score: 2000,
  },
];

function Row({ index, user }) {
  const baseClasses = "flex items-center gap-4 px-4 py-3 rounded-md";
  let rowBg = "bg-white";

  if (index === 0) rowBg = "bg-gradient-to-r from-yellow-300 to-yellow-200";
  else if (index === 1) rowBg = "bg-gray-200";
  else if (index === 2)
    rowBg = "bg-gradient-to-r from-orange-300 to-orange-200";

  return (
    <div className={`${baseClasses} ${rowBg}`}>
      <div className="w-8 text-center font-bold tracking-tighter leading-none">
        {index + 1}
      </div>
      <div className="flex items-center gap-3">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="font-bold tracking-tight text-slate-800 leading-none">
          {user.name}
        </div>
      </div>
      <div className="ml-auto w-[120px] text-right text-[11px] font-medium tracking-tight text-slate-500 leading-none">
        {user.correct}/{user.total}
      </div>
      <div className="w-[100px] text-right font-black tracking-tighter text-slate-900 leading-none">
        {user.score}
      </div>
    </div>
  );
}

export default function RankingTable({ data = TOP_TEN }) {
  const top10 = data
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const logged = Boolean(
        localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          localStorage.getItem("user") ||
          sessionStorage.getItem("token")
      );
      setIsLoggedIn(logged);
    } catch (e) {}
  }, []);

  return (
    <div className="w-full rounded-md border border-neutral-200 overflow-hidden font-sans">
      <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <div style={{ width: 32 }}>No</div>
          <div>Nama</div>
          <div className="ml-auto w-[120px] text-right">Jawaban benar</div>
          <div className="w-[100px] text-right">Skor</div>
        </div>
      </div>

      <div className="flex flex-col divide-neutral-200 gap-2 px-2 py-1">
        {top10.map((user, idx) => (
          <Row key={user.id} index={idx} user={user} />
        ))}

        {!isLoggedIn && (
          <div className="flex items-center gap-4 px-4 py-4 rounded-md bg-white">
            <div className="w-8 text-center text-gray-500 font-bold tracking-tighter">
              -
            </div>
            <div className="text-gray-600 text-sm font-medium tracking-tight">
              Belum ada peringkat — silakan{" "}
              <a href="/login" className="text-primary underline font-bold">
                masuk
              </a>{" "}
              untuk melihat peringkatmu
            </div>
            <div className="ml-auto w-[120px] text-right text-[11px] font-bold tracking-tight text-gray-400">
              -
            </div>
            <div className="w-[100px] text-right text-gray-400 font-black tracking-tighter">
              -
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
