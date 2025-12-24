import DetailPembayaran from "../../../components/dashboard/subscription/daftar-subscription/DetailPembayaran";



export function meta() {
  return [{ title: "Detail Pembayaran  - InterExam" }];
}

export default function DetailSubs() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
 
      <DetailPembayaran />
    </div>
  );
}