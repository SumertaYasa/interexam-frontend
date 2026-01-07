import JenjangTable from "../../../components/dashboard/kategori/jenjang/JenjangTable";

export function meta() {
  return [{ title: "Manajemen Jenjang - InterExam" }];
}

export default function JenjangTablePage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <JenjangTable />
    </div>
  );
}