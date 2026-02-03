import { useState,useEffect, useMemo } from "react";

import { subscriptionService } from "../../../../services/subscriptionService";

import { Link } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";
import DiscountModal from "./DiscountModal";
import DynamicFilter from "../../common/DynamicFilter";

// Helper Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

export default function PaketTable() {
    const [data, setData] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);
    
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState({ status: "all", periode: "" });
    
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState(null);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const response = await subscriptionService.getAllPackages();
            setData(response.data); 
        } catch (error) {
            console.error("Gagal load paket:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const periodOptions = useMemo(() => {
        const allPeriods = data.map(item => item.nama_periode);
        
        const uniquePeriods = [...new Set(allPeriods)];

        return uniquePeriods.map(periode => ({
            label: periode.charAt(0).toUpperCase() + periode.slice(1), // Capitalize
            value: periode
        }));
    }, [data]); 

    const filterConfig = useMemo(() => [
        {
            key: "status",
            label: "Filter Status",
            type: "radio",
            defaultValue: "all",
            options: [
                { label: "Semua Status", value: "all" },
                { label: "Aktif", value: "active" },
                { label: "Inaktif", value: "inactive" },
            ]
        },
        {
            key: "periode",
            label: "Masa Periode",
            type: "select",
            options: periodOptions 
        }
    ], [periodOptions]);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = item.nama_paket.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchesStatus = filterValues.status === "all" || item.status === filterValues.status;
            
            const matchesPeriode = filterValues.periode === "" || item.nama_periode === filterValues.periode;
            
            return matchesSearch && matchesStatus && matchesPeriode;
        });
    }, [data, searchTerm, filterValues]);

    const handleFilterChange = (key, value) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    const handleDelete = async (id) => {
        if (!confirm("Apakah Anda yakin ingin menghapus paket ini secara permanen?")) {
            return;
        }

        try {
            await subscriptionService.deletePackage(id);
            setData((prevData) => prevData.filter(item => item.id_paket_langganan !== id));
            
            alert("Paket berhasil dihapus!");
            
        } catch (error) {
            console.error(error);
            const pesanError = error.response?.data?.message || "Gagal menghapus paket.";
            alert(pesanError);
        }
    };
    const columns = [
        { 
            header: "NAMA PAKET", 
            render: (row) => <span className="  font-noto-sans">{row.nama_paket}</span> 
        },
        { 
            header: "HARGA", 
            render: (row) => {
                const isDiskonAktif = row.is_promo && row.diskon_info;

                return (
                    <div className="flex flex-col">
                        {isDiskonAktif ? (
                            <>
                                <span className="text-xs text-gray-400 line-through">
                                    {formatRupiah(row.harga_asli)}
                                </span>
                                <span className="text-primary  font-noto-sans ">
                                    {formatRupiah(row.harga_akhir)}
                                </span>
                            </>
                        ) : (
                            <span className="font-noto-sans ">
                                {formatRupiah(row.harga_asli)}
                            </span>
                        )}
                    </div>
                );
            }
        },
        { 
            header: "DURASI", 
            // Gabungkan masa_berlaku dan nama_periode
            render: (row) => (
                <span className=" font-noto-sans capitalize">
                    {row.masa_berlaku} {row.nama_periode}
                </span> 
            )
        },
        { 
            header: "STATUS", 
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-noto-sans uppercase ${
                    row.status === "active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                    {row.status === "active" ? "Aktif" : "Non-Aktif"}
                </span>
            )
        },
        {
           header: "DISKON",
            render: (row) => {
                if (!row.diskon_info) {
                    return <span className="text-gray-400 text-xs">-</span>;
                }

                const now = new Date();
                const startDate = new Date(row.diskon_info.tanggal_mulai_diskon);
                const endDate = new Date(row.diskon_info.tanggal_selesai_diskon);

                let badgeClass = "";
                let statusText = "";

                if (now > endDate) {
                    badgeClass = "bg-gray-200 text-gray-500 border-gray-300 font-noto-sans"; 
                    statusText = "(Expired)";
                } else if (now < startDate) {
                    badgeClass = "bg-primary/10 text-primary border-blue-200  font-noto-sans "; 
                    statusText = "(Terjadwal)";
                } else {
                    // KONDISI: AKTIF (Sedang Berjalan)
                    badgeClass = "bg-red-100 text-red-600 border-red-200 font-noto-sans "; 
                    statusText = "OFF";
                }

                return (
                    <div className={`px-2 py-1 rounded text-[10px] font-bold border w-fit whitespace-nowrap ${badgeClass}`}>
                        {row.diskon_info.diskon}% {statusText}
                    </div>
                );
            }
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            setSelectedPacket({
                                id: row.id_paket_langganan,
                                name: row.nama_paket,
                                currentDiscount: row.diskon_info 
                            });
                            setIsDiscountModalOpen(true);
                        }}
                        className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-lg h-8 w-8 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 5L5 19M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7ZM19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </button>

                    <Link to={`edit/${row.id_paket_langganan}`} className="flex items-center justify-center bg-amber-300 hover:bg-amber-400 text-neu-900 rounded-lg h-8 w-8 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" /></svg>
                    </Link>

                    <button 
                        onClick={() => handleDelete(row.id_paket_langganan)}
                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                        title="Hapus Paket"
                    >
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto">
            <PageHeader title="Data Paket Langganan" breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }, { label: "Paket Langganan", link: null }]} />

            <div className="p-5 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <SearchInput placeholder="Cari nama paket..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <DynamicFilter filters={filterConfig} onFilterChange={handleFilterChange} currentValues={filterValues} />
                    </div>
                    <ButtonAdd to="add" text="Tambah Paket" />
                </div>

                <DynamicTable
                    columns={columns}
                    data={filteredData}
                    isLoading={false}
                    emptyMessage="Data paket tidak ditemukan."
                />
            </div>

            {selectedPacket && (
                <DiscountModal
                    isOpen={isDiscountModalOpen}
                    onClose={() => { setIsDiscountModalOpen(false); setSelectedPacket(null); }}
                    packetName={selectedPacket.name}
                    packetId={selectedPacket.id}
                    currentDiscount={selectedPacket.currentDiscount}
                    // onSave={(updatedData) => alert(`Diskon ${updatedData.packetName} diperbarui!`)}
                    onSave={() => {
                        loadData(); 
                    }}
                />
            )}
        </div>
    );
}