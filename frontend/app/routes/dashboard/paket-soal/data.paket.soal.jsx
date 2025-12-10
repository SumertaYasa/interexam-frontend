import DataPaketSoal from "../../../components/dashboard/paket-soal/DataPaketSoal";

export function meta() {
  return [{ title: "Manajemen Paket Soal - InterExam" }];
}

export default function PaketSoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
      
      {/* Panggil komponen tabel di sini */}
      <DataPaketSoal />
    </div>
  );
}