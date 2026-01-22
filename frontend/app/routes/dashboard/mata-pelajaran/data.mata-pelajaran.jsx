import MataPelajaranTable from "../../../components/dashboard/kategori/mata-pelajaran/MataPelajaranTable";

export function meta() {
  return [{ title: "Manajemen Mata Pelajaran - InterExam" }];
}

export default function MataPelajaranData() {
  return (
    <div className="">

      <MataPelajaranTable />
    </div>
  );
}