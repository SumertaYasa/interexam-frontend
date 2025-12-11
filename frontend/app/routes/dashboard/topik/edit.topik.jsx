import EditTopik from "../../../components/dashboard/kategori/topik/EditTopik";

export function meta() {
  return [{ title: "Edit Topik - InterExam" }];
}

export default function EditTopikPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <EditTopik />
    </div>
  );
}