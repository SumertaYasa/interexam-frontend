import ModalDetailSoal from "../../../components/dashboard/bank-soal/ModalDetailSoal";

export function meta() {
  return [{ title: "Detail Soal - InterExam" }];
}

export default function SoalPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <ModalDetailSoal/>
    </div>
  );
}