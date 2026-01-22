import DataPaketSoal from "../../../components/dashboard/paket-soal/DataPaketSoal";

export function meta() {
  return [{ title: "Manajemen Paket Soal - InterExam" }];
}

export default function PaketSoalPage() {
  return (
    <div className="">
 
      <DataPaketSoal />
    </div>
  );
}