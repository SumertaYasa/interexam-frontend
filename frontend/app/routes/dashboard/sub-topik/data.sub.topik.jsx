import SubTopikPage from "../../../components/dashboard/kategori/sub-topik/SubTopikTable";

export function meta() {
  return [{ title: "Manajemen Sub Topik - InterExam" }];
}

export default function SubTopikTable() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <SubTopikPage />
    </div>
  );
}