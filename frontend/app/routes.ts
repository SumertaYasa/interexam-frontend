import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),

  route("/tes", "landing/tes/tes.tsx"),
  route("/paket", "landing/paket/paket.tsx"),
  route("/tentang-kami", "landing/tentangKami/tentangKami.tsx"),
  route("/coba-gratis", "landing/cobaGratis/cobaGratis.tsx"),
  route("login", "routes/auth/formSubscriber.jsx", [
    index("components/Auth/LoginFormSubscriber.jsx"),
    route("registrasi", "components/Auth/RegisFormSubscriber.jsx"),
  ]),

  // Khusus Dashboard
  route("dashboard", "routes/dashboard.jsx", [
    index("routes/dashboard/dashboard.home.jsx"),

    // bank soal
    route("bank-soal", "routes/dashboard/bank-soal/data.bank.jsx"),
    route(
      "bank-soal/edit/:id",
      "routes/dashboard/bank-soal/edit.bank.soal.jsx"
    ),
    route("bank-soal/detail/:id", "routes/dashboard/bank-soal/detail.soal.jsx"),

    //  -------------------- KHUSUS KATEGORI ------------------------
    // Kategori Mata Pelajaran
    route(
      "mata-pelajaran",
      "routes/dashboard/mata-pelajaran/data.mata-pelajaran.jsx"
    ),
    route(
      "mata-pelajaran/add",
      "routes/dashboard/mata-pelajaran/add.mata-pelajaran.jsx"
    ),
    route(
      "mata-pelajaran/edit/:id",
      "routes/dashboard/mata-pelajaran/edit.mata-pelajaran.jsx"
    ),

    // Kategori Topik
    route("topik", "routes/dashboard/topik/data.topik.jsx"),
    route("topik/add", "routes/dashboard/topik/add.topik.jsx"),
    route("topik/edit/:id", "routes/dashboard/topik/edit.topik.jsx"),

    // Kategori Sub Topik
    route("sub-topik", "routes/dashboard/sub-topik/data.sub.topik.jsx"),
    route("sub-topik/add", "routes/dashboard/sub-topik/add.sub.topik.jsx"),
    route(
      "sub-topik/edit/:id",
      "routes/dashboard/sub-topik/edit.sub.topik.jsx"
    ),

    //  -------------------- BATAS KATEGORI ------------------------

    // soal
    route("soal", "routes/dashboard/soal/data.soal.jsx"),
    route("soal/add", "routes/dashboard/soal/add.soal.jsx"),
    route("soal/edit/:id", "routes/dashboard/soal/edit.soal.jsx"),

    // Paket Soal
    route("paket-soal", "routes/dashboard/paket-soal/data.paket.soal.jsx"),
    route("paket-soal/add", "routes/dashboard/paket-soal/add.paket.soal.jsx"),

    // user
    route("users", "routes/dashboard/users/data.user.jsx"),
    route("users/add", "routes/dashboard/users/add.user.jsx"),
    route("users/edit/:id", "routes/dashboard/users/edit.user.jsx"),

    //paket langganan
    route(
      "paket-langganan",
      "routes/dashboard/paket-langganan/data.paket.langganan.jsx"
    ),
    route(
      "paket-langganan/add",
      "routes/dashboard/paket-langganan/add.paket.langganan.jsx"
    ),

    //daftar subscriber
    route(
      "daftar-subscriber",
      "routes/dashboard/subscriber/daftar.subscriber.jsx"
    ),
    route(
      "detail-pembayaran",
      "routes/dashboard/subscriber/detail.pembayaran.jsx"
    ),

    // konten
    route("artikel", "routes/dashboard/artikel/data.artikel.jsx"),
    route("artikel/add", "routes/dashboard/artikel/add.artikel.jsx"),
  ]),

  // Route Halaman dashboard subscriber
  layout("routes/dashboardSubscriber.jsx", [
    route(
      "dashboard-subscriber",
      "routes/dashboardSubscriber/dashboardHome/dashboard.home.jsx"
    ),
    route(
      "dashboard-subscriber/latihan",
      "routes/dashboardSubscriber/course/dashboard.course.jsx"
    ),
    route(
      "dashboard-subscriber/tersimpan",
      "routes/dashboardSubscriber/save/dashboard.save.jsx"
    ),
    route(
      "dashboard-subscriber/pengaturan",
      "routes/dashboardSubscriber/settings/dashboard.setting.jsx"
    ),
    route(
      "dashboard-subscriber/perkembangan",
      "routes/dashboardSubscriber/progress/dashboard.progress.jsx"
    ),
    route(
      "dashboard-subscriber/pencapaian",
      "routes/dashboardSubscriber/achievement/dashboard.achievement.jsx"
    ),
  ]),

  // Route Halaman Status
  route(
    "dashboard-subscriber/status-ujian-terakhir",
    "components/DashboardSubcriber/Features/Dashboard/StatusAllCourse.jsx"
  ),
  route(
    "dashboard-subscriber/status-ujian-terakhir/:label",
    "components/DashboardSubcriber/Features/Exam/DetailExam.jsx",
    { id: "status-detail" }
  ),
  route(
    "dashboard-subscriber/status-ujian-terakhir/:label/attempt",
    "components/DashboardSubcriber/Features/Exam/ExamAttempt.jsx",
    { id: "status-attempt" }
  ),
  route(
    "dashboard-subscriber/status-ujian-terakhir/:label/result",
    "components/DashboardSubcriber/Features/Exam/ResultExam.jsx",
    { id: "status-result" }
  ),

  // Route Halaman Latihan
  route(
    "dashboard-subscriber/latihan/:label",
    "components/DashboardSubcriber/Features/Exam/DetailExam.jsx",
    { id: "latihan-detail" }
  ),
  route(
    "dashboard-subscriber/latihan/:label/attempt",
    "components/DashboardSubcriber/Features/Exam/ExamAttempt.jsx",
    { id: "latihan-attempt" }
  ),
  route(
    "dashboard-subscriber/latihan/:label/result",
    "components/DashboardSubcriber/Features/Exam/ResultExam.jsx",
    { id: "latihan-result" }
  ),

  // Route Halaman Simpan
  route(
    "dashboard-subscriber/tersimpan/:id",
    "components/DashboardSubcriber/Features/Save/DetailSave.jsx"
  ),
  route(
    "dashboard-subscriber/tersimpan/:label/exam-detail",
    "components/DashboardSubcriber/Features/Exam/DetailExam.jsx",
    { id: "folder-detail" }
  ),
  route(
    "dashboard-subscriber/tersimpan/:label/attempt",
    "components/DashboardSubcriber/Features/Exam/ExamAttempt.jsx",
    { id: "folder-attempt" }
  ),
  route(
    "dashboard-subscriber/tersimpan/:label/result",
    "components/DashboardSubcriber/Features/Exam/ResultExam.jsx",
    { id: "folder-result" }
  ),

  route(
    "dashboard-subscriber/pencapaian/lencana",
    "components/DashboardSubcriber/Features/Achievement/BadgeContainer.jsx"
  ),

  // login internal (admin, validator, contributor)
  route("login-internal", "routes/auth/internal/formInternal.jsx", [
    index("components/Auth/Internal/LoginInternalForm.jsx"),
    route(
      "registrasi-internal",
      "components/Auth/Internal/RegisFormWrapper.jsx"
    ),
  ]),
] satisfies RouteConfig;
