import BankTable from "../../../components/dashboard/bank-soal/BankTable";

export function meta() {
  return [{ title: "Bank Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <BankTable />
    </div>
  );
}