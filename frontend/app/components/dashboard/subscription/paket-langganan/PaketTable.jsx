import { Link } from "react-router";
import { useState } from "react"; 

function DiscountModal({ isOpen, onClose, packetName, currentDiscount, onSave }) {
    // State untuk form Diskon
    const [discountData, setDiscountData] = useState({
        diskon: currentDiscount.rate || "",
        tanggalMulai: currentDiscount.start || "01/01/2026 00:00",
        tanggalBerakhir: currentDiscount.end || "31/01/2026 23:59",
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDiscountData({
            ...discountData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...discountData,
            packetName: packetName
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        // Overlay (Latar Belakang Gelap)
        <div className="fixed inset-0  transition-opacity z-50 flex items-center justify-center p-4">
            
            {/* Modal Konten */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-auto transform transition-all">
                
                {/* Header Modal */}
                <div className="p-6 mt-4">
                    <h2 className="text-2xl font-bold font-sora text-dark-primary">Kelola diskon paket langganan</h2>
                </div>

                {/* Body Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    
                    {/* Diskon Input */}
                    <div className="mb-4">
                        <label htmlFor="diskon" className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Diskon<span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="diskon" 
                            name="diskon" 
                            value={discountData.diskon}
                            onChange={handleChange}
                            placeholder="Contoh: 0.2 (untuk 20%)"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                            required
                        />
                    </div>
                    
                    {/* **BLOK STATUS SWITCH DIHAPUS SESUAI PERMINTAAN USER** */}

                    {/* Tanggal Mulai Diskon */}
                    <div className="mb-4">
                        <label htmlFor="tanggalMulai" className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Tanggal mulai diskon<span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="tanggalMulai" 
                            name="tanggalMulai" 
                            value={discountData.tanggalMulai}
                            onChange={handleChange}
                            placeholder="01/01/2026 00:00"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                            required
                        />
                    </div>

                    {/* Tanggal Berakhir Diskon */}
                    <div className="mb-6">
                        <label htmlFor="tanggalBerakhir" className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">
                            Tanggal berakhir diskon<span className="text-red-500">*</span>
                        </label>
                        <input 
                            type="text" 
                            id="tanggalBerakhir" 
                            name="tanggalBerakhir" 
                            value={discountData.tanggalBerakhir}
                            onChange={handleChange}
                            placeholder="31/01/2026 23:59"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                            required
                        />
                    </div>

                    {/* Tombol Aksi Modal */}
                    <div className="flex gap-4 justify-start">
                        <button type="submit"
                            className="text-white bg-primary box-border border border-transparent shadow-xs font-medium leading-5 rounded-2xl text-sm px-6 py-2.5 focus:outline-none font-noto-sans ">
                            Simpan
                        </button>
                        <button type="button" onClick={onClose}
                            className="text-primary bg-white box-border border border-primary shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none font-noto-sans ">
                            Batal
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


export default function PaketTable() {

    // State untuk Modal Diskon
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    // State untuk menyimpan data paket yang sedang diedit diskonnya
    const [selectedPacket, setSelectedPacket] = useState(null);

    // Data placeholder yang akan ditampilkan di tabel (biasanya diambil dari API)
    const paketData = [
        {
            id: 1,
            nama: "Bulanan",
            hargaAsli: "Rp 100.000",
            diskonRate: "0.25", // 25%
            hargaFinal: "Rp 75.000",
            masaAktif: "1 Bulan",
            diskonStart: "01/01/2026 00:00",
            diskonEnd: "31/01/2026 23:59"
        }
    ];

    // Placeholder function agar onClick Delete tidak error
    const confirmUserDelete = () => {
        if(window.confirm("Apakah anda yakin ingin menghapus?")) {
            console.log("Delete confirmed");
        }
    };
    
    // Fungsi untuk membuka modal Diskon
    const handleOpenDiscountModal = (packet) => {
        setSelectedPacket({
            id: packet.id,
            name: packet.nama,
            currentDiscount: {
                rate: packet.diskonRate,
                start: packet.diskonStart,
                end: packet.diskonEnd,
            }
        });
        setIsDiscountModalOpen(true);
    };

    // Fungsi untuk menutup modal Diskon
    const handleCloseDiscountModal = () => {
        setIsDiscountModalOpen(false);
        setSelectedPacket(null);
    };

    // Fungsi saat form Diskon disubmit (placeholder)
    const handleSaveDiscount = (newDiscountData) => {
        console.log("Menyimpan Diskon Baru untuk Paket:", newDiscountData.packetName);
        console.log("Data Diskon:", newDiscountData);
        // Di sini Anda akan memanggil API untuk menyimpan data diskon
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Menu Head */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Data Paket Langganan</h1>
                    </div>

                    {/* Breadcrumb tetap sama */}
                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                                    <Link to="topik" className="inline-flex items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                                        Data Paket Langganan
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>

            {/* Icon Search dan button Add Paket */}
            <div className=" mx-auto p-4 bg-white rounded-2xl shadow-xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <form method="GET" action="#" className="relative w-full sm:w-auto">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center ">
                                <svg className="h-5 w-5 text-gray-400 " viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" 
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd" />
                                </svg>
                            </span>
                            <input className="font-noto-sans block w-full sm:w-64 md:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-3xl h-10 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pr-900 focus:border-pr-900 sm:text-sm"
                                type="search" name="q" placeholder="Cari paket soal..." />
                        </form>
                        <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <Link to="add" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-2xl h-10 shadow-sm text-white bg-primary hover:bg-pr-900 ">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" 
                            aria-hidden="true">
                            <path fillRule="evenodd" 
                                d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                                clipRule="evenodd" />
                        </svg>
                        Add Paket Langganan
                    </Link>
                </div> 

                {/* Tabel paket-soal */}
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">NO</th>
                                <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">NAMA PAKET</th>
                                <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">HARGA</th>
                                <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">MASA AKTIF</th>
                                <th scope="col" className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">AKSI</th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {paketData.map((paket) => (
                                <tr key={paket.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">{paket.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">{paket.nama}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">{paket.hargaAsli}</td>
                             
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">{paket.masaAktif}</td>

                                    <td className="px-6 py-4 mt-2 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                        <div className="flex gap-2 items-center">
                                            {/* Tombol Edit */}
                                            <Link to={`edit/${paket.id}`}
                                                className="flex items-center justify-center text-neu-900 bg-amber-300 rounded-base h-8 w-8">
                                                <svg className="w-6 h-6 text-gray-800" aria-hidden="true"
                                                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                                        d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                                </svg>
                                            </Link>

                                            {/* Tombol Delete */}
                                            <button type="button" className="text-red-500 hover:text-red-700 bg-red-700 h-8 w-8 rounded-base" onClick={confirmUserDelete}>
                                                <svg className="w-6 h-6 text-center mx-auto text-white dark:text-white bg-red-700"
                                                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                                                    viewBox="0 0 24 24">
                                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                                </svg>
                                            </button>
                                        
                                            {/* Tombol Ikon Mata (Aksi ke-3) -> Membuka Modal Diskon */}
                                            {/* <button 
                                                type="button" 
                                                className="text-white item-center justify-center bg-primary h-8 w-8 rounded-base" 
                                                onClick={() => handleOpenDiscountModal(paket)}
                                                >
                                                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                                                    <path d="M19 5L5 19M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7ZM19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </button> */}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Render Modal Diskon */}
            {selectedPacket && (
                <DiscountModal 
                    isOpen={isDiscountModalOpen}
                    onClose={handleCloseDiscountModal}
                    packetName={selectedPacket.name}
                    currentDiscount={selectedPacket.currentDiscount}
                    onSave={handleSaveDiscount}
                />
            )}


        </div>
    );
}