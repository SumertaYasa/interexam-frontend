import TopikTable from "../../../components/dashboard/kategori/topik/TopikTable";

export function meta() {
  return [{ title: "Manajemen Topik - InterExam" }];
}

export default function TopikPage() {
  return (
    <div className="">

      <TopikTable />
    </div>
  );
}