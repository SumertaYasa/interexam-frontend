import SoalTable from "../../../components/dashboard/soal/SoalTable";

export function meta() {
  return [{ title: "Manajemen Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <SoalTable />
    </div>
  );
}