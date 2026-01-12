import DetailPaketSoal from "../../../components/dashboard/paket-soal/DetailPaketSoal";

export function meta() {
  return [{ title: "Detail Paket Soal - InterExam" }];
}

export default function EditPaketSoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <DetailPaketSoal />
    </div>
  );
}