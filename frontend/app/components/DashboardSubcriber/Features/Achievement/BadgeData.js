import { Zap, Flame, Target, BookOpen, Star, Trophy } from "lucide-react";

export const DATA_LENCANA = [
  {
    id: 1,
    title: "Early Bird",
    description: "Menyelesaikan ujian sebelum jam 7 pagi.",
    date: "12 Des 2025",
    isUnlocked: true,
    color: "bg-amber-400",
    icon: Zap,
  },
  {
    id: 2,
    title: "Ambisius Tinggi",
    description: "Belajar selama 5 jam tanpa henti.",
    date: "15 Des 2025",
    isUnlocked: true,
    color: "bg-indigo-500",
    icon: Flame,
  },
  {
    id: 3,
    title: "Master Logika",
    description: "Skor 100 pada kategori ujian Logika.",
    date: "20 Des 2025",
    isUnlocked: true, // Ubah ke true untuk tes warna
    color: "bg-emerald-500",
    icon: Target,
  },
  {
    id: 4,
    title: "Penjelajah Soal",
    description: "Menyimpan 50 soal ke dalam koleksi.",
    isUnlocked: false,
    color: "bg-pink-500",
    icon: BookOpen,
  },
  {
    id: 5,
    title: "Bintang Kelas",
    description: "Mencapai peringkat 1 di Ranking Global.",
    isUnlocked: false,
    color: "bg-amber-400",
    icon: Star,
  },
  {
    id: 6,
    title: "Legenda InterExam",
    description: "Menyelesaikan total 100 paket soal.",
    isUnlocked: false,
    color: "bg-indigo-500",
    icon: Trophy,
  },
];
