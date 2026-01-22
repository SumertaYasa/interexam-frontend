import PaketTable from "../../../components/dashboard/subscription/paket-langganan/PaketTable";


export function meta() {
  return [{ title: "Manajemen Paket - InterExam" }];
}

export default function PaketLanggananPage() {
  return (
    <div className="">
 
      <PaketTable />
    </div>
  );
}