// Daftar Menu untuk ADMIN
export const ADMIN_MENU = [
  {
    category: "Menu Utama",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Bank Soal", path: "/dashboard/bank-soal" },
      { label: "Paket Soal", path: "/dashboard/paket-soal" },
    ]
  },
  {
    category: "Pengguna",
    items: [
      { label: "Users Data", path: "/dashboard/users" },
    ]
  },

];

// Daftar Menu untuk CONTRIBUTOR
export const CONTRIBUTOR_MENU = [
  {
    category: "Menu Utama",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Tempat Soal", path: "/dashboard/tempat-soal" }, // Menu khusus contributor
    ]
  },
];

// Daftar Menu untuk VALIDATOR
export const VALIDATOR_MENU = [
  {
    category: "Menu Utama",
    items: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Validasi Soal", path: "/dashboard/validasi" }, // Menu khusus validator
    ]
  },
];