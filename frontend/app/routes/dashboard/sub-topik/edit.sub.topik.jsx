import EditSubTopik from "../../../components/dashboard/kategori/sub-topik/EditSubTopik";

export function meta() {
  return [{ title: "Edit Sub Topik - InterExam" }];
}

export default function EditSubTopikPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditSubTopik />
    </div>
  );
}