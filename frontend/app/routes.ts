import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/landing.tsx"),

  // --- RUTE LANDING (PUBLIK) ---
  route("/tes", "landing/tes/tes.jsx"),
  route("/tes/:slug", "landing/tes/publicDetailExam.jsx"),

  route("/paket", "landing/paket/paket.jsx"),
  route("/tentang-kami", "landing/tentangKami/tentangKami.tsx"),
  route("/coba-gratis", "landing/cobaGratis/cobaGratis.jsx"),
  route("/coba-gratis/:label", "landing/cobaGratis/CobaGratisDetail.jsx"),
  route(
    "/coba-gratis/:label/attempt",
    "landing/cobaGratis/CobaGratisAttempt.jsx",
  ),
  route(
    "/coba-gratis/:label/result",
    "landing/cobaGratis/CobaGratisResult.jsx",
  ),

  route("login", "routes/auth/formSubscriber.jsx", [
    index("components/Auth/LoginFormSubscriber.jsx"),
    route("registrasi", "components/Auth/RegisFormSubscriber.jsx"),
  ]),

  route("unauthorized", "components/Common/Unauthorized.tsx"),

  // --- RUTE DASHBOARD INTERNAL/ADMIN ---
  route("dashboard", "routes/dashboard.jsx", [
    index("routes/dashboard/dashboard.home.jsx"),

    route("bank-soal", "routes/dashboard/bank-soal/data.bank.jsx"),
    route(
      "bank-soal/edit/:id",
      "routes/dashboard/bank-soal/edit.bank.soal.jsx",
    ),
    route("bank-soal/detail/:id", "routes/dashboard/bank-soal/detail.soal.jsx"),
    route(
      "bank-soal/modal-soal/:id",
      "routes/dashboard/bank-soal/modal.soal.jsx",
    ),

    route("kategori", "routes/dashboard/kategori/data.kategori.jsx"),
    route("kategori/add", "routes/dashboard/kategori/add.kategori.jsx"),
    route("kategori/edit/:id", "routes/dashboard/kategori/edit.kategori.jsx"),

    route("jenjang", "routes/dashboard/jenjang/data.jenjang.jsx"),
    route("jenjang/add", "routes/dashboard/jenjang/add.jenjang.jsx"),
    route("jenjang/edit/:id", "routes/dashboard/jenjang/edit.jenjang.jsx"),

    route(
      "mata-pelajaran",
      "routes/dashboard/mata-pelajaran/data.mata-pelajaran.jsx",
    ),
    route(
      "mata-pelajaran/add",
      "routes/dashboard/mata-pelajaran/add.mata-pelajaran.jsx",
    ),
    route(
      "mata-pelajaran/edit/:id",
      "routes/dashboard/mata-pelajaran/edit.mata-pelajaran.jsx",
    ),

    route("topik", "routes/dashboard/topik/data.topik.jsx"),
    route("topik/add", "routes/dashboard/topik/add.topik.jsx"),
    route("topik/edit/:id", "routes/dashboard/topik/edit.topik.jsx"),

    route("sub-topik", "routes/dashboard/sub-topik/data.sub.topik.jsx"),
    route("sub-topik/add", "routes/dashboard/sub-topik/add.sub.topik.jsx"),
    route(
      "sub-topik/edit/:id",
      "routes/dashboard/sub-topik/edit.sub.topik.jsx",
    ),

    route("soal", "routes/dashboard/soal/data.soal.jsx"),
    route("soal/add", "routes/dashboard/soal/add.soal.jsx"),
    route("soal/edit/:id", "routes/dashboard/soal/edit.soal.jsx"),

    route("paket-soal", "routes/dashboard/paket-soal/data.paket.soal.jsx"),
    route("paket-soal/add", "routes/dashboard/paket-soal/add.paket.soal.jsx"),
    route(
      "paket-soal/edit/:id",
      "routes/dashboard/paket-soal/edit.paket.soal.jsx",
    ),
    route(
      "paket-soal/detail/:id",
      "routes/dashboard/paket-soal/detail.paket.soal.jsx",
    ),

    route("event", "routes/dashboard/event/data.event.jsx"),
    route("event/add", "routes/dashboard/event/add.event.jsx"),
    route("event/edit/:id", "routes/dashboard/event/edit.event.jsx"),

    route("users", "routes/dashboard/users/data.user.jsx"),
    route("users/add", "routes/dashboard/users/add.user.jsx"),
    route("users/edit/:id", "routes/dashboard/users/edit.user.jsx"),

    route("edit-profile/", "routes/dashboard/users/edit.profile.user.jsx"),

    route("reset-password/", "routes/dashboard/users/reset.password.user.jsx"),

    route(
      "paket-langganan",
      "routes/dashboard/paket-langganan/data.paket.langganan.jsx",
    ),
    route(
      "paket-langganan/add",
      "routes/dashboard/paket-langganan/add.paket.langganan.jsx",
    ),

    route(
      "paket-langganan/edit/:id",
      "routes/dashboard/paket-langganan/edit.paket.langganan.jsx",
    ),

    route("akun-subscriber", "routes/dashboard/subscriber/akun.subscriber.jsx"),

    route(
      "daftar-subscriber",
      "routes/dashboard/subscriber/daftar.subscriber.jsx",
    ),
    route(
      "detail-pembayaran/:id",
      "routes/dashboard/subscriber/detail.pembayaran.jsx",
    ),

    route("artikel", "routes/dashboard/artikel/data.artikel.jsx"),
    route("artikel/add", "routes/dashboard/artikel/add.artikel.jsx"),

    route("report", "routes/dashboard/report/report.jsx"),
  ]),

  // --- LAYOUT DASHBOARD SUBSCRIBER (DENGAN SIDEBAR) ---
  layout("routes/dashboardSubscriber.jsx", [
    route(
      "dashboard-subscriber",
      "routes/dashboardSubscriber/dashboardHome/dashboard.home.jsx",
    ),
    route(
      "dashboard-subscriber/latihan",
      "routes/dashboardSubscriber/course/dashboard.course.jsx",
    ),
    route(
      "dashboard-subscriber/tersimpan",
      "routes/dashboardSubscriber/save/dashboard.save.jsx",
    ),
    route(
      "dashboard-subscriber/pengaturan",
      "routes/dashboardSubscriber/settings/dashboard.setting.jsx",
    ),
    route(
      "dashboard-subscriber/perkembangan",
      "routes/dashboardSubscriber/progress/dashboard.progress.jsx",
    ),
    route(
      "dashboard-subscriber/pencapaian",
      "routes/dashboardSubscriber/achievement/dashboard.achievement.jsx",
    ),
  ]),

  // LAYOUT FULL VIEW
  layout("components/DashboardSubcriber/Layout/FullViewLayout.jsx", [
    // Semua Status Ujian
    route(
      "dashboard-subscriber/status-ujian-terakhir",
      "components/DashboardSubcriber/Features/Dashboard/StatusAllCourse.jsx",
    ),
    route(
      "dashboard-subscriber/status-ujian-terakhir/:label",
      "components/DashboardSubcriber/Features/Exam/DetailExam.jsx",
      { id: "status" },
    ),
    route(
      "dashboard-subscriber/status-ujian-terakhir/:label/attempt",
      "components/DashboardSubcriber/Features/Exam/ExamAttempt.jsx",
      { id: "status-attempt" },
    ),
    route(
      "dashboard-subscriber/status-ujian-terakhir/:label/result",
      "components/DashboardSubcriber/Features/Exam/ResultExam.jsx",
      { id: "status-result" },
    ),

    // 2. Semua Detail Latihan
    route(
      "dashboard-subscriber/latihan/:label",
      "components/DashboardSubcriber/Features/Exam/DetailExam.jsx",
    ),
    route(
      "dashboard-subscriber/latihan/:label/attempt",
      "components/DashboardSubcriber/Features/Exam/ExamAttempt.jsx",
    ),
    route(
      "dashboard-subscriber/latihan/:label/result",
      "components/DashboardSubcriber/Features/Exam/ResultExam.jsx",
    ),

    route(
      "dashboard-subscriber/latihan/:label/discussion",
      "components/DashboardSubcriber/Features/Exam/Components/ExamDiscussion.jsx",
    ),

    route(
      "dashboard-subscriber/latihan/events",
      "components/DashboardSubcriber/Features/Course/components/EventListContainer.jsx",
    ),

    route(
      "dashboard-subscriber/latihan/events/:label",
      "components/DashboardSubcriber/Features/Course/EventDetailContainer.jsx",
    ),

    route(
      "dashboard-subscriber/latihan/events/:eventLabel/:label",
      "components/DashboardSubcriber/Features/Course/components/ExamEventDetail.jsx",
    ),

    route(
      "dashboard-subscriber/latihan/events/:eventLabel/:label/attempt",
      "components/DashboardSubcriber/Features/Course/components/ExamEventAttempt.jsx",
    ),

    route(
      "/dashboard-subscriber/latihan/events/results",
      "components/DashboardSubcriber/Features/Course/components/EventResultWrapper.jsx",
    ),

    route(
      "/dashboard-subscriber/latihan/events/results/:label",
      "components/DashboardSubcriber/Features/Course/components/EventResultDetail.jsx",
    ),

    route(
      "/dashboard-subscriber/latihan/events/results/:eventLabel/discussion/:paketLabel",
      "components/DashboardSubcriber/Features/Course/components/EventDiscussion.jsx",
    ),

    route(
      "/dashboard-subscriber/latihan/events/results/:eventLabel/ranking/:rankingType",
      "components/DashboardSubcriber/Features/Course/components/RankingTablePage.jsx",
    ),

    // 3. Semua Detail Tersimpan
    route(
      "dashboard-subscriber/tersimpan/:label",
      "components/DashboardSubcriber/Features/Save/DetailSave.jsx",
    ),
    route(
      "dashboard-subscriber/tersimpan/:label/attempt",
      "components/DashboardSubcriber/Features/Save/Components/FolderAttempt.jsx",
    ),
    route(
      "dashboard-subscriber/tersimpan/:label/result",
      "components/DashboardSubcriber/Features/Save/Components/FolderResult.jsx",
    ),

    route(
      "dashboard-subscriber/tersimpan/:label/discussion",
      "components/DashboardSubcriber/Features/Save/Components/FolderDiscussion.jsx",
    ),

    // 4. Detail Lencana
    route(
      "dashboard-subscriber/pencapaian/lencana",
      "components/DashboardSubcriber/Features/Achievement/BadgeContainer.jsx",
    ),
  ]),

  // --- LOGIN INTERNAL ---
  route("login-internal", "routes/auth/internal/formInternal.jsx", [
    index("components/Auth/Internal/LoginInternalForm.jsx"),
    route(
      "registrasi-internal",
      "components/Auth/Internal/RegisFormWrapper.jsx",
    ),
  ]),

  route("logout", "components/Auth/Logout.jsx"),
] satisfies RouteConfig;
