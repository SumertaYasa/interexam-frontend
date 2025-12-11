import AddPaketSoal from "../../../components/dashboard/paket-soal/AddPaketSoal";

export function meta() {
  return [{ title: "Add Paket Soal - InterExam" }];
}

export default function AddPaketSoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <AddPaketSoal />
    </div>
  );
}