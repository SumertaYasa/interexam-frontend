import { useState, useEffect, useMemo } from "react";
import { LayoutList, LayoutGrid, Sliders } from "lucide-react";
import CardProgress from "../../Common/CardProgress";
import CardProgressList from "../../Common/CardProgressList";
import BreadCrumbs from "../../Common/BreadCrumbs";
import SearchBar from "../../Common/SearchBar";
import FilterPanel from "../../Common/FilterPanel";
import { slugify } from "../../../../utils/slugify.ts";

const Courses = [
  {
    id: 1,
    label: "Paket Soal 1 - Logika Dasar",
    image: "/person.jpg",
    progress: { answered: 15, totalSoal: 50 },
    category: "Logika",
  },
  {
    id: 2,
    label: "Paket Soal 2 - TPA Kuantitatif",
    image: "/person.jpg",
    progress: { answered: 30, totalSoal: 40 },
    category: "Matematika",
  },
  {
    id: 3,
    label: "Paket Soal 3 - Bahasa Inggris",
    image: "/person.jpg",
    progress: { answered: 6, totalSoal: 60 },
    category: "Bahasa Inggris",
  },
  {
    id: 4,
    label: "Paket Soal 4 - Penalaran Umum",
    image: "/person.jpg",
    progress: { answered: 45, totalSoal: 50 },
    category: "Logika",
  },
  {
    id: 5,
    label: "Paket Soal 5 - Pemahaman Bacaan",
    image: "/person.jpg",
    progress: { answered: 9, totalSoal: 20 },
    category: "Bahasa Inggris",
  },
  {
    id: 11,
    label: "Paket Soal 11 - Sejarah Indonesia",
    image: "/person.jpg",
    progress: { answered: 40, totalSoal: 40 },
    category: "Sejarah",
  },
  {
    id: 16,
    label: "Paket Soal 16 - Tryout Akbar",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 20 },
    category: "Umum",
  },
  {
    id: 16,
    label: "Paket Soal 16 - Tryout Akbar",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 20 },
    category: "Umum",
  },
  {
    id: 16,
    label: "Paket Soal 16 - Tryout Akbar",
    image: "/person.jpg",
    progress: { answered: 0, totalSoal: 20 },
    category: "Umum",
  },
];

function LoadingCards() {
  return (
    <div className="w-full py-20 flex justify-center items-center">
      <p className="text-gray-500 font-semibold text-lg animate-pulse">
        Sedang mencari...
      </p>
    </div>
  );
}

function StatusAllCourse() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  // State Filter (Kategori & Progres)
  const defaultFilters = { category: "all", minRating: 0, sortBy: "relevance" };
  const [filters, setFilters] = useState(defaultFilters);

  const [isHandleLayout, setIsHandleLayout] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isHandleLayout");
      return saved !== null ? saved === "true" : false;
    }
    return false;
  });

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(searchValue), 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  // Ambil kategori unik dari data
  const categories = useMemo(() => {
    const set = new Set();
    Courses.forEach((c) => set.add(c.category || "Umum"));
    return ["all", ...Array.from(set)];
  }, []);

  // Logika Filtering & Sorting
  const filteredCourses = useMemo(() => {
    let list = Courses.filter((course) => {
      const matchesSearch = course.label
        .toLowerCase()
        .includes(debouncedValue.toLowerCase());
      const matchesCategory =
        filters.category === "all" || course.category === filters.category;

      // Hitung persentase progres untuk filter (minRating di sini dianggap progres 0-5)
      const progressPercent =
        (course.progress.answered / course.progress.totalSoal) * 5;
      const matchesProgress = progressPercent >= filters.minRating;

      return matchesSearch && matchesCategory && matchesProgress;
    });

    if (filters.sortBy === "newest") list.reverse();
    if (filters.sortBy === "rating") {
      list.sort(
        (a, b) =>
          b.progress.answered / b.progress.totalSoal -
          a.progress.answered / a.progress.totalSoal
      );
    }

    return list;
  }, [debouncedValue, filters]);

  useEffect(() => {
    localStorage.setItem("isHandleLayout", String(isHandleLayout));
  }, [isHandleLayout]);

  return (
    <div className="w-full ">
      <nav className="w-full px-7-5 py-3.5  bg-white">
        <div className="w-12">
          <img src="/interexam-logo.svg" className="w-full" alt="Logo" />
        </div>
      </nav>

      <div className="px-7-5 py-5 flex flex-col gap-5">
        <BreadCrumbs />
        <div className="flex items-center w-full gap-5">
          <SearchBar
            placeholder="Cari ujian yang telah dipelajari..."
            onChange={(e) => setSearchValue(e.target.value)}
            value={searchValue}
          />
          <div className="flex items-center gap-3">
            <button
              className="flex justify-center items-center gap-2.5 border px-5 py-2.5 rounded-full cursor-pointer hover:bg-slate-50 transition-all"
              onClick={() => setIsHandleLayout(!isHandleLayout)}
            >
              {isHandleLayout ? (
                <LayoutGrid size={20} />
              ) : (
                <LayoutList size={20} />
              )}
              <span className="font-semibold text-sm">View</span>
            </button>
          </div>
        </div>
        <div>
          <button
            className={`flex justify-center items-center gap-2.5 border px-5 py-2.5 rounded-full cursor-pointer transition-all ${filterOpen ? "bg-slate-900 text-white" : "bg-white text-black"}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Sliders size={20} />
            <span className="font-semibold">Filter</span>
          </button>
        </div>

        {filterOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            onClose={() => setFilterOpen(false)}
            onClear={() => setFilters(defaultFilters)}
          />
        )}
      </div>

      <div className="w-full ">
        {searchValue !== debouncedValue ? (
          <LoadingCards />
        ) : filteredCourses.length === 0 ? (
          <div className="py-20 text-center text-gray-500 font-medium">
            Tidak ada paket soal ditemukan.
          </div>
        ) : (
          <div
            className={
              isHandleLayout
                ? "flex flex-col gap-5 px-7-5 py-5 items-center animate-in fade-in duration-500"
                : "flex flex-wrap gap-5 py-5 px-7-5 animate-in fade-in duration-500 slide-in-from-bottom-5"
            }
          >
            {filteredCourses.map((course) =>
              isHandleLayout ? (
                <CardProgressList
                  key={course.id}
                  label={course.label}
                  image={course.image}
                  progress={course.progress}
                  path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                />
              ) : (
                <CardProgress
                  key={course.id}
                  label={course.label}
                  image={course.image}
                  progress={course.progress}
                  path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatusAllCourse;
