import JenjangTable from "../../../components/dashboard/kategori/jenjang/JenjangTable";

export function meta() {
  return [{ title: "Manajemen Jenjang - InterExam" }];
}

export default function JenjangTablePage() {
  return (
    <div className="">

      <JenjangTable />
    </div>
  );
}