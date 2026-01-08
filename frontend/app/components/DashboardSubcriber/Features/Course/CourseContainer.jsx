import { useState, useMemo, useEffect, useRef } from "react";
import { useLoaderData } from "react-router";
import { LayoutGrid, LayoutList, Sliders } from "lucide-react";
import SearchBar from "../../Common/SearchBar";
import CardCourseList from "../../Common/CardCourseList";
import CardCourse from "../../Common/CardCourse";
import FilterPanel from "../../Common/FilterPanel";
import { slugify } from "../../../../utils/slugify.ts";

const DUMMY_COURSES = [
  {
    id: 1,
    title: "Tes Bahasa Inggris: Structure & Usage",
    image: "/person.jpg",
    rating: 4.8,
    totalSoal: 50,
    participants: 5453,
    category: "Bahasa Inggris",
    createdAt: "2025-12-01T10:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Tes Bahasa Inggris: Structure & Usage")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
  },
  {
    id: 2,
    title: "Ujian Logika Dasar Sekolah Menengah Atas",
    image: "/person.jpg",
    rating: 4.6,
    totalSoal: 40,
    participants: 3120,
    category: "Logika",
    createdAt: "2025-12-10T09:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Ujian Logika Dasar Sekolah Menengah Atas")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
  },
  {
    id: 3,
    title: "Tryout Matematika Saintek",
    image: "/person.jpg",
    rating: 4.3,
    totalSoal: 60,
    participants: 2210,
    category: "Matematika",
    createdAt: "2025-11-01T09:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Tryout Matematika Saintek")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
  },
  {
    id: 4,
    title: "Tryout Bahasa Inggris",
    image: "/person.jpg",
    rating: 1.9,
    totalSoal: 60,
    participants: 2210,
    category: "Bahasa Inggris",
    createdAt: "2025-11-01T09:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Tryout Bahasa Inggris")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
  },
  {
    id: 5,
    title: "Tryout Bahasa Jepang",
    image: "/person.jpg",
    rating: 4.9,
    totalSoal: 60,
    participants: 2210,
    category: "Bahasa Jepang",
    createdAt: "2025-11-01T09:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Tryout Bahasa Jepang")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
  },
  {
    id: 6,
    title: "Tryout Bahasa Spanyol",
    image: "/person.jpg",
    rating: 4.9,
    totalSoal: 60,
    participants: 2210,
    category: "Bahasa Spanyol",
    createdAt: "2025-11-01T09:00:00Z",
    path: `/dashboard-subscriber/latihan/${slugify("Tryout Bahasa Spanyol")}`,
    linkState: {
      from: "course",
      badge: {
        label: "Latihan",
        classes: "border-blue-300 bg-blue-50 text-blue-800",
      },
    },
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

export async function loader({ request }) {
  try {
    const res = await fetch("/api/courses", { signal: request?.signal });
    if (!res.ok) {
      return { courses: DUMMY_COURSES };
    }
    const data = await res.json();
    const items = Array.isArray(data) ? data : (data?.courses ?? []);

    const normalized = items.map((it) => ({
      id: it.id ?? it._id ?? Math.random().toString(36).slice(2, 9),
      title: it.title ?? it.label ?? it.name ?? "Untitled",
      image: it.image ?? it.thumbnail ?? "/person.jpg",
      rating: Number(it.rating ?? 0),
      totalSoal: it.totalSoal ?? it.totalQuestions ?? it.total ?? 0,
      participants: it.participants ?? it.totalTaken ?? it.timesTaken ?? 0,
      category: it.category ?? it.subject ?? "Umum",
      createdAt:
        it.createdAt ?? it.uploadedAt ?? it.created_at ?? it.created ?? null,
      path:
        it.path ?? `/dashboard-subscriber/latihan/${slugify(it.title ?? "")}`,
      linkState: {
        from: "course",
        badge: {
          label: "Latihan",
          classes: "border-blue-300 bg-blue-50 text-blue-800",
        },
      },
    }));

    return { courses: normalized };
  } catch (err) {
    return { courses: DUMMY_COURSES };
  }
}

function CourseContainer() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("courseViewMode");
      return saved === "grid" ? "grid" : "list";
    }
    return "list";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("courseViewMode", viewMode);
    }
  }, [viewMode]);

  const defaultFilters = { category: "all", minRating: 0, sortBy: "relevance" };
  const [filters, setFilters] = useState(() => {
    try {
      const raw = localStorage.getItem("courseFilters");
      return raw ? JSON.parse(raw) : defaultFilters;
    } catch (e) {
      return defaultFilters;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("courseFilters", JSON.stringify(filters));
    } catch (e) {}
  }, [filters]);

  useEffect(() => {
    function onWindowClick() {
      if (filterOpen) setFilterOpen(false);
    }
    window.addEventListener("click", onWindowClick);
    return () => window.removeEventListener("click", onWindowClick);
  }, [filterOpen]);

  const handleToggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(t);
  }, [query]);

  const isSearching = query.trim() !== debouncedQuery;

  const loaderData = useLoaderData();
  const courses = loaderData?.courses ?? DUMMY_COURSES;

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => set.add(c.category || "Umum"));
    return ["all", ...Array.from(set)];
  }, [courses]);

  // --- LOGIKA FILTER (DIPERBAIKI) ---
  const filtered = useMemo(() => {
    let list = [...courses];

    // search
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((c) => (c.title || "").toLowerCase().includes(q));
    }

    // category
    if (filters.category && filters.category !== "all") {
      list = list.filter((c) => c.category === filters.category);
    }

    // rating (FIXED: Pastikan casting ke Number)
    const minRating = Number(filters.minRating);
    if (minRating > 0) {
      list = list.filter((c) => Number(c.rating || 0) >= minRating);
    }

    // sorting
    if (filters.sortBy === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
    } else if (filters.sortBy === "rating") {
      list.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
    } else if (filters.sortBy === "questions") {
      list.sort((a, b) => (b.totalSoal || 0) - (a.totalSoal || 0));
    }

    return list;
  }, [courses, debouncedQuery, filters]);

  const handleClearFilters = () => setFilters(defaultFilters);

  return (
    <div className="w-full ">
      <div className="flex items-center">
        <SearchBar
          placeholder="Cari paket soal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="ml-4 flex items-center gap-3">
          <button
            onClick={handleToggleView}
            title={`${viewMode}`}
            className="px-4 py-2.5 border rounded-full cursor-pointer flex items-center justify-center"
          >
            {viewMode === "grid" ? (
              <span className="flex items-center gap-2">
                <LayoutGrid />
                <span className="text-body-s-medium capitalize">
                  {viewMode}
                </span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LayoutList />
                <span className="text-body-s-medium capitalize">
                  {viewMode}
                </span>
              </span>
            )}
          </button>
        </div>
      </div>
      <div className="relative mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFilterOpen((s) => !s);
          }}
          title="Filter"
          className={`px-4 py-2.5 border rounded-full cursor-pointer flex items-center gap-2 ${filterOpen ? "bg-slate-900 text-white" : "bg-white text-black"}`}
        >
          <Sliders />
          <span className="text-body-s-medium">Filter</span>
        </button>

        {filterOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            onClose={() => setFilterOpen(false)}
            onClear={handleClearFilters}
            // SINKRONISASI PROPS BARU
            labels={{
              categoryLabel: "Mata Pelajaran",
              ratingLabel: "Rating Minimal",
              sortLabel: "Urutkan",
              allCategoryText: "Semua Mapel",
              applyButtonText: "Terapkan",
              resetButtonText: "Bersihkan",
            }}
            sortOptions={[
              { value: "relevance", label: "Relevansi" },
              { value: "newest", label: "Terbaru" },
              { value: "rating", label: "Rating Tertinggi" },
              { value: "questions", label: "Soal Terbanyak" },
            ]}
          />
        )}
      </div>

      <div className="py-5">
        {isSearching ? (
          <LoadingCards />
        ) : filtered.length === 0 ? (
          <div className="py-10 text-center text-gray-500">
            Tidak ada paket soal ditemukan.
          </div>
        ) : viewMode === "grid" ? (
          <div className="flex flex-wrap gap-4 animate-in fade-in duration-500 slide-in-from-bottom-[2%]">
            {filtered.map((course) => (
              <CardCourse
                key={course.id}
                title={course.title}
                path={course.path}
                linkState={course.linkState}
                image={course.image}
                rating={course.rating}
                totalQuestion={course.totalSoal}
                totalTaken={course.participants}
                category={course.category}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4 animate-in fade-in duration-500 slide-in-from-bottom-[2%]">
            {filtered.map((course) => (
              <CardCourseList
                key={course.id}
                title={course.title}
                image={course.image}
                rating={course.rating}
                totalSoal={course.totalSoal}
                participants={course.participants}
                category={course.category}
                path={course.path}
                linkState={course.linkState}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseContainer;
