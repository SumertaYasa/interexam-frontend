// DetailPembelianCard.jsx
export default function DetailPembelianCard({ data, formatIDR }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <h3 className="text-lg font-bold font-noto-sans text-gray-800 mb-4">Detail Pembelian</h3>
      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-noto-sans">Paket Langganan</span>
          <span className="font-noto-sans text-gray-800">{data.paket}</span>
        </div>
        <div className="flex justify-between items-start text-sm">
          <span className="text-gray-400 font-noto-sans">Masa Berlaku</span>
          <span className="font-noto-sans text-gray-800 text-right">{data.masa_berlaku}</span>
        </div>
        <div className="border-t border-gray-100 my-2"></div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-noto-sans">Harga Asli</span>
          <span className="font-noto-sans text-gray-800">{formatIDR(data.harga_asli)}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 font-noto-sans">Diskon</span>
          <span className="font-noto-sans text-gray-800">{data.diskon}</span>
        </div>
        <div className="border-t border-gray-100 my-2"></div>
        <div className="flex justify-between items-center">
          <span className="font-noto-sans text-gray-800 font-bold">Total Pembayaran</span>
          <span className="text-lg font-bold font-noto-sans text-gray-900">{formatIDR(data.total_bayar)}</span>
        </div>
      </div>
    </div>
  );
}