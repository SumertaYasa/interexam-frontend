import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";
import DiscountModal from "./DiscountModal";
import DynamicFilter from "../../common/DynamicFilter";

const DUMMY_PAKET = [
    { 
        id: 1, 
        nama_paket: "Paket Bronze - Bulanan", 
        harga_paket: "Rp 100.000", 
        periode: "Bulanan", 
        berlaku_angka: "1",
        status: "Aktif",
        diskon_rate: "0.1", 
        tgl_mulai: "2026-02-01T08:00", 
        tgl_selesai: "2026-02-28T23:59" 
    },
    { 
        id: 2, 
        nama_paket: "Paket Silver - 3 Bulan", 
        harga_paket: "Rp 275.000", 
        periode: "Triwulan", 
        berlaku_angka: "3", 
        status: "Aktif",
        diskon_rate: "0.15", 
        tgl_mulai: "2026-02-01T00:00", 
        tgl_selesai: "2026-05-01T00:00" 
    },
    { 
        id: 3, 
        nama_paket: "Paket Gold - Tahunan", 
        harga_paket: "Rp 1.000.000", 
        periode: "Tahunan", 
        berlaku_angka: "12", 
        status: "Inaktif",
        diskon_rate: "0.25", 
        tgl_mulai: "2026-01-01T00:00", 
        tgl_selesai: "2026-12-31T23:59" 
    },
];

export default function PaketTable() {
    // 1. Inisialisasi data langsung dari dummy agar tidak ada loading saat refresh
    const [data] = useState(DUMMY_PAKET); 
    const [searchTerm, setSearchTerm] = useState("");
    const [filterValues, setFilterValues] = useState({ status: "all", periode: "" });
    
    // UI states
    const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
    const [selectedPacket, setSelectedPacket] = useState(null);

    const filterConfig = [
        {
            key: "status",
            label: "Filter Status",
            type: "radio",
            defaultValue: "all",
            options: [
                { label: "Semua Status", value: "all" },
                { label: "Aktif", value: "Aktif" },
                { label: "Inaktif", value: "Inaktif" },
            ]
        },
        {
            key: "periode",
            label: "Masa Periode",
            type: "select",
            options: [
                { label: "Bulanan", value: "Bulanan" },
                { label: "Triwulan", value: "Triwulan" },
                { label: "Tahunan", value: "Tahunan" },
            ]
        }
    ];

    // 2. Gunakan useMemo untuk filtering agar lebih ringan (hanya hitung jika input berubah)
    const filteredData = useMemo(() => {
        return data.filter((item) => {
            const matchesSearch = item.nama_paket.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterValues.status === "all" || item.status === filterValues.status;
            const matchesPeriode = filterValues.periode === "" || item.periode === filterValues.periode;
            return matchesSearch && matchesStatus && matchesPeriode;
        });
    }, [data, searchTerm, filterValues]);

    const handleFilterChange = (key, value) => {
        setFilterValues(prev => ({ ...prev, [key]: value }));
    };

    const columns = [
        { 
            header: "NAMA PAKET", 
            render: (row) => <span className="font-semibold text-dark-primary font-sora">{row.nama_paket}</span> 
        },
        { 
            header: "HARGA", 
            render: (row) => <span className="text-gray-700 font-noto-sans">{row.harga_paket}</span> 
        },
        { 
            header: "MASA BERLAKU", 
            render: (row) => <span className="text-gray-700 font-bold font-noto-sans">{row.berlaku_angka}</span> 
        },
        { 
            header: "MASA PERIODE", 
            render: (row) => <span className="text-gray-700 font-noto-sans">{row.periode}</span> 
        },
        { 
            header: "STATUS", 
            render: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                    row.status === "Aktif" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                }`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2">
                    <Link to={`edit/${row.id}`} className="flex items-center justify-center bg-amber-300 hover:bg-amber-400 text-neu-900 rounded-lg h-8 w-8 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" /></svg>
                    </Link>
                    <button
                        onClick={() => {
                            setSelectedPacket({
                                id: row.id,
                                name: row.nama_paket,
                                currentDiscount: { rate: row.diskon_rate, start: row.tgl_mulai, end: row.tgl_selesai },
                            });
                            setIsDiscountModalOpen(true);
                        }}
                        className="flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-lg h-8 w-8 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 5L5 19M9 7C9 8.10457 8.10457 9 7 9C5.89543 9 5 8.10457 5 7C5 5.89543 5.89543 5 7 5C8.10457 5 9 5.89543 9 7ZM19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17Z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
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
                    currentDiscount={selectedPacket.currentDiscount}
                    onSave={(updatedData) => alert(`Diskon ${updatedData.packetName} diperbarui!`)}
                />
            )}
        </div>
    );
}