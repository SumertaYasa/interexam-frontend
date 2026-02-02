import { useNavigate, useParams } from "react-router";
import PageHeader from "../../common/PageHeader";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";
import InfoCard from "../../common/InfoCard"; // Sesuaikan path
import DetailPembayaranCard from "../../common/DetailPembayaranCard"; // Sesuaikan path

export default function DetailPembayaran() {
  const navigate = useNavigate();
  const { id } = useParams();

  const data = {
    tanggal_pembayaran: "15 November 2025, 19:20 WITA",
    status: "Active",
    jenis_pembayaran: "Bank Transfer",
    id_transaksi: "f028473465-345646456456475",
    nama: "I Komang Adi Wirata",
    email: "Mangadi@gmail.com",
    telepon: "081265434343",
    paket: "1 Tahun",
    masa_berlaku: "13/11/2025 - 13/11/2026",
    harga_asli: 1200000,
    diskon: "25%",
    total_bayar: 900000,
  };

  const formatIDR = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

  const infoPembayaranItems = [
    { label: "Tanggal Pembayaran", value: data.tanggal_pembayaran },
    { 
      label: "Status", 
      value: data.status, 
      type: "badge", 
      className: "bg-green-100 text-green-600 border-green-200" 
    },
    { label: "Jenis Pembayaran", value: data.jenis_pembayaran },
    { label: "ID Transaksi Mitrands", value: data.id_transaksi },
  ];

  const infoSubscriberItems = [
    { label: "Nama", value: data.nama },
    { label: "Alamat Email", value: data.email },
    { label: "No Telepon", value: data.telepon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
      <PageHeader
        title="Detail Pembayaran"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Data Subscriber", link: "/dashboard/subscriber" },
          { label: "Detail Pembayaran", link: null },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* KOLOM KIRI */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Informasi Pembayaran" items={infoPembayaranItems} />
          <InfoCard title="Informasi Subscriber" items={infoSubscriberItems} />
        </div>

        {/* KOLOM KANAN */}
        <div className="space-y-6">
          <DetailPembayaranCard data={data} formatIDR={formatIDR} />

          {/* Card Aksi */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold font-noto-sans text-gray-800 mb-4">Aksi</h3>
            <div className="flex flex-col gap-3">
              <ButtonSave 
                text="Kirim Ulang Invoice" 
                onClick={() => alert("Invoice dikirim!")}
                className="w-full justify-center" 
              />
              <ButtonCancel 
                text="Kembali"
                onClick={() => navigate(-1)}
                className="w-full justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}