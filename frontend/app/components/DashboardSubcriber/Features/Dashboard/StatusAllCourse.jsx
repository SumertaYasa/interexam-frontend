import { useState, useEffect, useMemo } from "react";
import { LayoutList, LayoutGrid, Sliders } from "lucide-react";
import CardProgress from "../../Common/CardProgress";
import CardProgressList from "../../Common/CardProgressList";
import BreadCrumbs from "../../Common/BreadCrumbs";
import SearchBar from "../../Common/SearchBar";
import FilterPanel from "../../Common/FilterPanel";
import { slugify } from "../../../../utils/slugify.ts";
import { dashboardService } from "../../../../services/subscriber";
import { getAssetUrl } from "../../../../utils/assetHelpper.ts";

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
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // State Filter
  const defaultFilters = { category: "all", minRating: 0, sortBy: "relevance" };
  const [filters, setFilters] = useState(defaultFilters);

  const [isHandleLayout, setIsHandleLayout] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("isHandleLayout");
      return saved !== null ? saved === "true" : false;
    }
    return false;
  });

  // Fetch pakets dari API
  useEffect(() => {
    const fetchPakets = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getAllPaketsWithProgress();
        // Filter hanya paket yang sudah dijawab (answered > 0)
        const answeredPakets = data.filter(
          (paket) => paket.progress?.answered > 0,
        );
        setCourses(answeredPakets);
      } catch (error) {
        console.error("Error fetching pakets:", error);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPakets();
  }, []);

  useEffect(() => {
    const handler = setTimeout(
      () => setDebouncedValue(searchValue.trim()),
      500,
    );
    return () => clearTimeout(handler);
  }, [searchValue]);

  const categories = useMemo(() => {
    const set = new Set();
    courses.forEach((c) => set.add(c.category || "Umum"));
    return ["all", ...Array.from(set)];
  }, [courses]);

  // filtering
  const filteredCourses = useMemo(() => {
    let list = courses.filter((course) => {
      //  Pencarian
      const matchesSearch = course.label
        .toLowerCase()
        .includes(debouncedValue.toLowerCase());

      // Kategori
      const matchesCategory =
        filters.category === "all" || course.category === filters.category;

      // progress
      const progressPercent =
        (course.progress.answered / course.progress.totalSoal) * 100;
      const matchesProgress = progressPercent >= Number(filters.minRating);

      return matchesSearch && matchesCategory && matchesProgress;
    });

    // 4. Logika Sorting
    if (filters.sortBy === "newest") {
      list = [...list].reverse();
    } else if (filters.sortBy === "rating") {
      list = [...list].sort(
        (a, b) =>
          b.progress.answered / b.progress.totalSoal -
          a.progress.answered / a.progress.totalSoal,
      );
    }

    return list;
  }, [debouncedValue, filters, courses]);

  useEffect(() => {
    localStorage.setItem("isHandleLayout", String(isHandleLayout));
  }, [isHandleLayout]);

  return (
    <div className="w-full">
      <nav className="w-full px-7-5 py-3.5 bg-white">
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
            className={`flex justify-center items-center gap-2.5 border px-5 py-2.5 rounded-full cursor-pointer transition-all ${
              filterOpen ? "bg-slate-900 text-white" : "bg-white text-black"
            }`}
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
            // --- UPDATE PROPS FILTERPANEL (SINKRONISASI LABEL) ---
            labels={{
              categoryLabel: "Kategori Mapel",
              ratingLabel: "Minimal Progres Pengerjaan",
              sortLabel: "Urutkan Berdasarkan",
              allCategoryText: "Semua Kategori",
              applyButtonText: "Terapkan Filter",
              resetButtonText: "Reset",
            }}
            sortOptions={[
              { value: "relevance", label: "Paling Relevan" },
              { value: "newest", label: "Terakhir Dipelajari" },
              { value: "rating", label: "Progres Tertinggi" },
            ]}
          />
        )}
      </div>

      <div className="w-full">
        {loading ? (
          <LoadingCards />
        ) : searchValue !== debouncedValue ? (
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
                  image={getAssetUrl(course.image)}
                  progress={course.progress}
                  path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                />
              ) : (
                <CardProgress
                  key={course.id}
                  label={course.label}
                  image={getAssetUrl(course.image)}
                  progress={course.progress}
                  path={`/dashboard-subscriber/status-ujian-terakhir/${slugify(course.label)}`}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatusAllCourse;
