import KontenTable from "../../../components/dashboard/content/Artikel/KontenTable";


export function meta() {
  return [{ title: "Konten Artikel - InterExam" }];
}

export default function ArtikelPage() {
  return (
    <div className="">

      <KontenTable />
    </div>
  );
}