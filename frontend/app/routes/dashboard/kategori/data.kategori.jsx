import KategoriTable from "../../../components/dashboard/kategori/kategori/KategoriTable";

export function meta() {
  return [{ title: "Data Kategori - InterExam" }];
}

export default function JenjangTablePage() {
  return (
    <div className="">

      <KategoriTable/>
    </div>
  );
}