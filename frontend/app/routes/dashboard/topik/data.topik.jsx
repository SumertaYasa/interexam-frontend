import TopikTable from "../../../components/dashboard/kategori/topik/TopikTable";

export function meta() {
  return [{ title: "Manajemen Topik - InterExam" }];
}

export default function TopikPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <TopikTable />
    </div>
  );
}