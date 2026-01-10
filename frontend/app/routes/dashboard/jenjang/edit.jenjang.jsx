import EditJenjang from "../../../components/dashboard/kategori/jenjang/EditJenjang";

export function meta() {
  return [{ title: "Add Jenjang - InterExam" }];
}

export default function JenjangTablePage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditJenjang/>
    </div>
  );
}