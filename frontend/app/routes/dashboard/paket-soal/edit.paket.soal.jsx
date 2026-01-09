import EditPaketSoal from "../../../components/dashboard/paket-soal/EditPaketSoal";

export function meta() {
  return [{ title: "Edit Paket Soal - InterExam" }];
}

export default function EditPaketSoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <EditPaketSoal />
    </div>
  );
}