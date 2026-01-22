import SoalTable from "../../../components/dashboard/soal/SoalTable";

export function meta() {
  return [{ title: "Manajemen Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">

      <SoalTable />
    </div>
  );
}