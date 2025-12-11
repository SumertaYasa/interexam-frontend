import KontenTable from "../../../components/dashboard/content/Artikel/KontenTable";


export function meta() {
  return [{ title: "Konten Artikel - InterExam" }];
}

export default function ArtikelPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <KontenTable />
    </div>
  );
}