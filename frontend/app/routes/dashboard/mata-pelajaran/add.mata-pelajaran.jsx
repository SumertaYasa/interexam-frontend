import AddMataPelajaran from "../../../components/dashboard/kategori/mata-pelajaran/AddMataPelajaran";

export function meta() {
  return [{ title: "Manajemen Topik - InterExam" }];
}

export default function TambahMataPelajaran() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
      
      {/* Panggil komponen tabel di sini */}
      <AddMataPelajaran />
    </div>
  );
}