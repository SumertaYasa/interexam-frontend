import EditBankSoal from "../../../components/dashboard/bank-soal/EditBankSoal";

export function meta() {
  return [{ title: "Edit Bank Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditBankSoal/>
    </div>
  );
}