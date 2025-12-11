import AddArtikel from "../../../components/dashboard/content/Artikel/AddArtikel";

export function meta() {
  return [{ title: "Konten Artikel - InterExam" }];
}

export default function AddArtikelPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <AddArtikel />
    </div>
  );
}