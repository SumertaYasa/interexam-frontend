import AddMataPelajaran from "../../../components/dashboard/kategori/mata-pelajaran/AddMataPelajaran";

export function meta() {
  return [{ title: "Add Mata Pelajaran - InterExam" }];
}

export default function TambahMataPelajaran() {
  return (
    <div className="">

      <AddMataPelajaran />
    </div>
  );
}