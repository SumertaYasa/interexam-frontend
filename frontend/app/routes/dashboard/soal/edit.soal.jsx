import EditSoal from "../../../components/dashboard/soal/EditSoal";

export function meta() {
  return [{ title: "Edit Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditSoal />
    </div>
  );
}