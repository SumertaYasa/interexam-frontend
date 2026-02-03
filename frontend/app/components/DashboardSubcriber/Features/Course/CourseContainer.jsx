import { useState, useMemo, useEffect } from "react";
import { LayoutGrid, LayoutList, Sliders } from "lucide-react";
import SearchBar from "../../Common/SearchBar";
import CardCourseList from "../../Common/CardCourseList";
import CardCourse from "../../Common/CardCourse";
import FilterPanel from "../../Common/FilterPanel";
import { slugify } from "../../../../utils/slugify";
import { courseService } from "../../../../services/subscriber";
import { getAssetUrl } from "../../../../utils/assetHelpper";

function LoadingCards() {
  return (
    <div className="w-full py-20 flex justify-center items-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-semibold text-lg animate-pulse">
          Sedang mencari paket soal...
        </p>
      </div>
    </div>
  );
}

function CourseContainer() {
  // --- STATE MANAGEMENT ---
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("courseViewMode") || "list";
    }
    return "list";
  });

  const defaultFilters = { category: "all", minRating: 0, sortBy: "relevance" };
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await courseService.getAllPaketsWithProgress();
        const items =
          response && Array.isArray(response.data) ? response.data : [];

        const normalized = items.map((it) => {
          return {
            id: it.id || it.id_paket_soal,
            title: it.label || it.nama_paket || "Paket Soal",
            image: getAssetUrl(it.image),
            rating: 4.5,
            totalSoal: it.progress?.totalSoal || 0,
            answeredSoal: it.progress?.answered || 0,
            participants: it.participants || 0,
            category: it.category || "Umum",
            path: `/dashboard-subscriber/latihan/${slugify(it.label || it.nama_paket || "paket")}`,
            linkState: {
              from: "course",
              badge: {
                label: "Latihan",
                classes: "border-blue-300 bg-blue-50 text-blue-800",
              },
            },
          };
        });

        setCourses(normalized);
      } catch (error) {
        console.error("Gagal memuat data paket soal:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- 3. SIDE EFFECTS ---
  useEffect(() => {
    localStorage.setItem("courseViewMode", viewMode);
  }, [viewMode]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 500);
    return () => clearTimeout(t);
  }, [query]);

  // --- 4. LOGIKA FILTER & MEMO ---
  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => set.add(c.category));
    return ["all", ...Array.from(set)];
  }, [courses]);

  const filtered = useMemo(() => {
    let list = [...courses];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      list = list.filter((c) => (c.title || "").toLowerCase().includes(q));
    }

    if (filters.category && filters.category !== "all") {
      list = list.filter((c) => c.category === filters.category);
    }

    if (filters.sortBy === "newest") {
      list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
    } else if (filters.sortBy === "questions") {
      list.sort((a, b) => (b.totalSoal || 0) - (a.totalSoal || 0));
    }

    return list;
  }, [courses, debouncedQuery, filters]);

  // --- 5. RENDER LOGIC ---
  return (
    <div className="w-full">
      {/* Search & View Mode Toggle */}
      <div className="flex items-center">
        <SearchBar
          placeholder="Cari paket soal"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="ml-4 flex items-center gap-3">
          <button
            onClick={() => setViewMode((v) => (v === "grid" ? "list" : "grid"))}
            className="px-4 py-2.5 border rounded-full cursor-pointer flex items-center justify-center gap-2"
          >
            {viewMode === "grid" ? (
              <LayoutGrid size={20} />
            ) : (
              <LayoutList size={20} />
            )}
            <span className="text-body-s-medium capitalize">{viewMode}</span>
          </button>
        </div>
      </div>

      {/* Filter Button */}
      <div className="relative mt-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setFilterOpen((s) => !s);
          }}
          className={`px-4 py-2.5 border rounded-full cursor-pointer flex items-center gap-2 transition-all ${
            filterOpen
              ? "bg-slate-900 text-white"
              : "bg-white text-black hover:bg-slate-50"
          }`}
        >
          <Sliders size={18} />
          <span className="text-body-s-medium">Filter</span>
        </button>

        {filterOpen && (
          <FilterPanel
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            onClose={() => setFilterOpen(false)}
            onClear={() => setFilters(defaultFilters)}
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

      {/* Main Content Area */}
      <div className="py-5">
        {loading ? (
          <LoadingCards />
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center gap-2">
            <p className="text-gray-500 font-medium">
              Tidak ada paket soal ditemukan.
            </p>
            <button
              onClick={() => {
                setQuery("");
                setFilters(defaultFilters);
              }}
              className="text-primary text-sm font-bold hover:underline"
            >
              Reset Pencarian
            </button>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "flex flex-wrap gap-6"
                : "flex flex-col gap-4"
            } animate-in fade-in slide-in-from-bottom-2 duration-500`}
          >
            {filtered.map((course) =>
              viewMode === "grid" ? (
                <CardCourse
                  key={course.id}
                  title={course.title}
                  path={course.path}
                  linkState={course.linkState}
                  image={course.image}
                  rating={course.rating}
                  totalQuestion={course.totalSoal}
                  category={course.category}
                  participants={course.participants}
                  answered={course.answeredSoal}
                />
              ) : (
                <CardCourseList
                  key={course.id}
                  title={course.title}
                  image={course.image}
                  rating={course.rating}
                  totalSoal={course.totalSoal}
                  category={course.category}
                  participants={course.participants}
                  answered={course.answeredSoal}
                  path={course.path}
                  linkState={course.linkState}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CourseContainer;
