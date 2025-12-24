import AddSubTopik from "../../../components/dashboard/kategori/sub-topik/AddSubTopik";

export function meta() {
  return [{ title: "Add Sub Topik - InterExam" }];
}

export default function AddSubTopikPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <AddSubTopik />
    </div>
  );
}