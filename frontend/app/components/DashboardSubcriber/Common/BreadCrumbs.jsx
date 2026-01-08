import React from "react";
import { useLocation, Link } from "react-router";
import { ChevronRight, Home } from "lucide-react";

function BreadCrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const routeNames = {
    dashboard: "Beranda-subscriber",
    latihan: "Latihan Soal",
    perkembangan: "Statistik Perkembangan",
    "status-ujian-terakhir": "Status Ujian Terakhir",
  };

  const formatName = (slug) => {
    return slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {pathnames.map((value, index) => {
          if (value === "dashboard") return null;

          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          const isLast = index === pathnames.length - 1;
          const displayName = routeNames[value] || formatName(value);

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-5 h-5 text-gray-400 mx-1" />

                {isLast ? (
                  <span className="ml-1 text-sm font-bold text-gray-500 md:ml-2 truncate max-w-[200px] tracking-tight leading-none">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={to}
                    className="ml-1 text-sm font-semibold text-gray-700 hover:text-primary md:ml-2 tracking-tight leading-none transition-colors"
                  >
                    {displayName}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default BreadCrumbs;
