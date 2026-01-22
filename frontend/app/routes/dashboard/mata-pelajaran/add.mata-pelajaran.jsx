import AddMataPelajaran from "../../../components/dashboard/kategori/mata-pelajaran/AddMataPelajaran";

export function meta() {
  return [{ title: "Manajemen Topik - InterExam" }];
}

export default function TambahMataPelajaran() {
  return (
    <div className="">

      <AddMataPelajaran />
    </div>
  );
}