import MataPelajaranTable from "../../../components/dashboard/kategori/mata-pelajaran/MataPelajaranTable";

export function meta() {
  return [{ title: "Manajemen Mata Pelajaran - InterExam" }];
}

export default function MataPelajaranData() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
      
      {/* Panggil komponen tabel di sini */}
      <MataPelajaranTable />
    </div>
  );
}