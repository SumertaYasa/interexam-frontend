import AddTopik from "../../../components/dashboard/kategori/topik/AddTopik";

export function meta() {
  return [{ title: "Add Topik - InterExam" }];
}

export default function AddTopikPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <AddTopik />
    </div>
  );
}