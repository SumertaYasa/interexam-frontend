import { useNavigate, useParams } from "react-router";
import PageHeader from "../../common/PageHeader";

export default function DetailPembayaran() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Data dummy yang disesuaikan dengan field tabel & gambar
  // Di masa depan, data ini bisa di-fetch menggunakan bankSoalService atau service terkait
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

  // Helper format rupiah
  const formatIDR = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);
  };

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        {/* KOLOM KIRI: Informasi Utama */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card Informasi Pembayaran */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Pembayaran</h3>
            <div className="border-t border-gray-300 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Tanggal Pembayaran</p>
                <p className="font-noto-sans text-gray-800">{data.tanggal_pembayaran}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-lg border border-green-200">
                   {data.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Jenis Pembayaran</p>
                <p className="font-noto-sans text-gray-800">{data.jenis_pembayaran}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">ID Transaksi Mitrands</p>
                <p className="font-noto-sans text-gray-800 break-all">{data.id_transaksi}</p>
              </div>
            </div>
          </div>

          {/* Card Informasi Subscriber */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold font-noto-sans text-gray-800 mb-4">Informasi Subscriber</h3>
            <div className="border-t border-gray-300 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-y-6">
              <div>
                <p className="text-sm text-gray-400 mb-1">Nama</p>
                <p className="font-noto-sans text-gray-800">{data.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Alamat Email</p>
                <p className="font-noto-sans text-gray-800">{data.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">No Telepon</p>
                <p className="font-noto-sans text-gray-800">{data.telepon}</p>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Detail Pembelian & Aksi */}
        <div className="space-y-6">
          
          {/* Card Detail Pembelian */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-noto-sans text-gray-800 mb-4">Detail Pembelian</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Paket Langganan</span>
                <span className="font-noto-sans text-gray-800">{data.paket}</span>
              </div>
              <div className="flex justify-between items-start text-sm">
                <span className="text-gray-400">Masa Berlaku</span>
                <span className="font-noto-sans text-gray-800 text-right">{data.masa_berlaku}</span>
              </div>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Harga Asli</span>
                <span className="font-noto-sans text-gray-800">{formatIDR(data.harga_asli)}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">Diskon</span>
                <span className="font-noto-sans text-gray-800">{data.diskon}</span>
              </div>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="font-noto-sans text-gray-800">Total Pembayaran</span>
                <span className="text-lg font-noto-sans text-gray-900">{formatIDR(data.total_bayar)}</span>
              </div>
            </div>
          </div>

          {/* Card Aksi */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold font-noto-sans text-gray-800 mb-4">Aksi</h3>
            <div className="flex flex-col gap-3">
              {/* Button Utama menggunakan warna biru sesuai gambar */}
              <button 
                type="button"
                className="w-full text-white bg-primary focus:ring-4 focus:ring-blue-300 font-bold font-noto-sans rounded-xl text-sm px-5 py-3 transition-all"
                onClick={() => alert("Invoice berhasil dikirim ulang")}
              >
                Kirim Ulang Invoice
              </button>
              
              {/* Button Outline untuk kembali */}
              <button 
                type="button"
                className="w-full text-primary bg-white border-2 border-primary hover:bg-blue-50 focus:ring-4 focus:ring-blue-100 font-bold font-noto-sans rounded-xl text-sm px-5 py-3 transition-all"
                onClick={() => navigate(-1)}
              >
                Kembali ke Data Subscriber
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}