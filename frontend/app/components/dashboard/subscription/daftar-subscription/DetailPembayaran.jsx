import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";

import { subscriptionService } from "../../../../services/subscriptionService";

import PageHeader from "../../common/PageHeader";
import ButtonSave from "../../common/ButtonSave";
import ButtonCancel from "../../common/ButtonCancel";
import InfoCard from "../../common/InfoCard"; 
import DetailPembayaranCard from "../../common/DetailPembayaranCard";

export default function DetailPembayaran() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleResendInvoice = async () => {
    if(!window.confirm("Kirim ulang invoice ke email subscriber?")) return;
    
    const btn = document.activeElement; 
    if(btn) { btn.innerText = "Mengirim..."; btn.disabled = true; }

    try {
        await subscriptionService.resendInvoice(id); 
        alert("Sukses! Invoice telah dikirim ke email user.");
    } catch (error) {
        console.error(error);
        alert("Gagal mengirim invoice.");
    } finally {
        if(btn) { btn.innerText = "Kirim Ulang Invoice"; btn.disabled = false; }
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
        try {
            const response = await subscriptionService.getAdminTransactionDetail(id);
            setDetail(response);
        } catch (error) {
            console.error("Error", error);
            alert("Data transaksi tidak ditemukan");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;
  if (!detail) return null;

  const dataDisplay = {
    tanggal_pembayaran: new Date(detail.created_at).toLocaleString("id-ID", {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }),
    
    // Status Logic
    status: detail.status === 'success' ? 'Active' : detail.status,
    statusClass: detail.status === 'success' 
        ? "bg-green-100 text-green-600" 
        : detail.status === 'suspended' 
            ? "bg-gray-200 text-gray-700" 
            : "bg-yellow-100 text-yellow-600",

    jenis_pembayaran: (detail.payment_type || "Manual").toUpperCase(),
    id_transaksi: detail.id_transaksi,
    
    nama: detail.subscriber?.nama_user || "Tanpa Nama",
    email: detail.subscriber?.email_user || "-",
    telepon: detail.subscriber?.phone || "-",
    
    paket: detail.paketLangganan?.nama_paket || "Paket Terhapus",
    masa_berlaku: detail.pricing_detail?.masa_berlaku_text || "Tidak diketahui",
    
    harga_asli: detail.pricing_detail?.harga_asli || 0,
    diskon: detail.pricing_detail?.diskon_persen, 
    total_bayar: detail.pricing_detail?.total_bayar || 0,
  };

  const formatIDR = (val) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

  const infoPembayaranItems = [
    { label: "Tanggal Pembayaran", value: dataDisplay.tanggal_pembayaran },
    { 
      label: "Status", 
      value: dataDisplay.status.toUpperCase(), 
      type: "badge", 
      className: dataDisplay.statusClass 
    },
    { label: "Jenis Pembayaran", value: dataDisplay.jenis_pembayaran },
    { label: "ID Transaksi", value: dataDisplay.id_transaksi },
  ];

  const infoSubscriberItems = [
    { label: "Nama", value: dataDisplay.nama },
    { label: "Alamat Email", value: dataDisplay.email },
    { label: "No Telepon", value: dataDisplay.telepon },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
      <PageHeader
        title="Detail Pembayaran"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Data Subscriber", link: "/dashboard/daftar-subscriber" },
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
          
          {/* Card Rincian Harga */}
          <DetailPembayaranCard data={dataDisplay} formatIDR={formatIDR} />

          {/* Card Aksi */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold font-noto-sans text-gray-800 mb-4">Aksi</h3>
            <div className="flex flex-col gap-3">
              <ButtonSave 
                text="Kirim Ulang Invoice" 
                onClick={handleResendInvoice}
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