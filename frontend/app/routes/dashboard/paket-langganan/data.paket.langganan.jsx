import PaketTable from "../../../components/dashboard/subscription/paket-langganan/PaketTable";


export function meta() {
  return [{ title: "Manajemen Paket - InterExam" }];
}

export default function PaketLanggananPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <PaketTable />
    </div>
  );
}