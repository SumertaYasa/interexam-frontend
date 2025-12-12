import AddPaketTable from "../../../components/dashboard/subscription/paket-langganan/AddPaketTable";


export function meta() {
  return [{ title: "Add Paket  - InterExam" }];
}

export default function AddPaketLangganan() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <AddPaketTable />
    </div>
  );
}