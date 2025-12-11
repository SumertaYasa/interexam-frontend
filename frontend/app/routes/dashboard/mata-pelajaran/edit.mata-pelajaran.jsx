import EditMataPelajaran from "../../../components/dashboard/kategori/mata-pelajaran/EditMataPelajaran";

export function meta() {
  return [{ title: "Edit Topik - InterExam" }];
}

export default function UpdateMataPelajaran() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditMataPelajaran />
    </div>
  );
}