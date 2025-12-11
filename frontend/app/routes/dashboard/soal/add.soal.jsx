import AddSoal from "../../../components/dashboard/soal/AddSoal";

export function meta() {
  return [{ title: "Add Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <AddSoal />
    </div>
  );
}