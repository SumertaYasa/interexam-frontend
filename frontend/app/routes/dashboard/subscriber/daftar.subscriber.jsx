import DaftarSubscriber from "../../../components/dashboard/subscription/daftar-subscription/DataSubscriber";


export function meta() {
  return [{ title: "Daftar Subscriber  - InterExam" }];
}

export default function DataSubscriber() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <DaftarSubscriber />
    </div>
  );
}