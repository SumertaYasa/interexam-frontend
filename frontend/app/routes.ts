import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),

  // Khusus Dashboard
  route("dashboard", "routes/dashboard.jsx", [
    index("routes/dashboard/dashboard.home.jsx"),

    // bank soal
    route("bank-soal", "routes/dashboard/bank-soal/data.bank.jsx"),

    // khusus kategori
    // Kategori Mata Pelajaran
    route("mata-pelajaran", "routes/dashboard/mata-pelajaran/data.mata-pelajaran.jsx"),
    route("mata-pelajaran/add", "routes/dashboard/mata-pelajaran/add.mata-pelajaran.jsx"),
    route("mata-pelajaran/edit/:id", "routes/dashboard/mata-pelajaran/edit.mata-pelajaran.jsx"),
    // Kategori Topik
    route("topik", "routes/dashboard/topik/data.topik.jsx"),
    route("topik/add", "routes/dashboard/topik/add.topik.jsx"),
    route("topik/edit/:id", "routes/dashboard/topik/edit.topik.jsx"),

    // user
    route("users", "routes/dashboard/users/data.user.jsx"),
    route("users/add", "routes/dashboard/users/add.user.jsx"),
    route("users/edit/:id", "routes/dashboard/users/edit.user.jsx"),

    // konten
    route("artikel", "routes/dashboard/artikel/data.artikel.jsx"),
    route("artikel/add", "routes/dashboard/artikel/add.artikel.jsx"),
  ]),
] satisfies RouteConfig;
