import { useNavigate } from "react-router"; 
import { useState, useMemo } from "react"; 

import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import DynamicTable from "../../common/DynamicTable";
import StatCard from "../../common/StatCard";
import DynamicFilter from "../../common/DynamicFilter";

// --- DATA DUMMY ---
const DUMMY_SUBSCRIBERS = [
    { id: 1, nama: "Budi Santoso", email: "budi.s@example.com", telpn: "081234567890", langganan: "Premium Bulanan", status: "active", tanggal_berakhir: "2026-01-24" },
    { id: 2, nama: "Siti Aminah", email: "siti.aminah@web.id", telpn: "085712344321", langganan: "Basic Tahunan", status: "pending", tanggal_berakhir: "2025-12-30" },
    { id: 3, nama: "Rian Hidayat", email: "rian.h@gmail.com", telpn: "081999888777", langganan: "Premium Tahunan", status: "expired", tanggal_berakhir: "2024-12-20" },
    { id: 4, nama: "Dewi Lestari", email: "dewi.les@example.com", telpn: "082155667788", langganan: "Basic Bulanan", status: "active", tanggal_berakhir: "2026-02-15" }
];

export default function DaftarSubscriber() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterState, setFilterState] = useState({ 
        status: "all", 
        sort: "newest" 
    });

    // Konfigurasi Filter
    const filterConfig = [
        {
            key: "sort",
            label: "Urutkan Data",
            type: "radio",
            options: [
                { label: "Terbaru", value: "newest" },
                { label: "Terlama", value: "oldest" },
                { label: "Nama (A-Z)", value: "a-z" },
                { label: "Nama (Z-A)", value: "z-a" }
            ]
        },
        {
            key: "status",
            label: "Filter Status",
            type: "radio",
            options: [
                { label: "Semua Status", value: "all" },
                { label: "Aktif", value: "active" },
                { label: "Pending", value: "pending" },
                { label: "Expired", value: "expired" }
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilterState(prev => ({ ...prev, [key]: value }));
    };

    // --- LOGIKA FILTER & SORT ---
    const processedData = useMemo(() => {
        return DUMMY_SUBSCRIBERS.filter((item) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = 
                item.nama.toLowerCase().includes(search) ||
                item.email.toLowerCase().includes(search);

            let matchesStatus = true;
            if (filterState.status !== "all") {
                matchesStatus = item.status === filterState.status;
            }
            return matchesSearch && matchesStatus;
        }).sort((a, b) => {
            const nameA = a.nama.toLowerCase();
            const nameB = b.nama.toLowerCase();
            switch (filterState.sort) {
                case "a-z": return nameA.localeCompare(nameB);
                case "z-a": return nameB.localeCompare(nameA);
                case "oldest": return new Date(a.tanggal_berakhir) - new Date(b.tanggal_berakhir);
                case "newest": default: return new Date(b.tanggal_berakhir) - new Date(a.tanggal_berakhir);
            }
        });
    }, [searchTerm, filterState]);

    // Kolom Tabel
    const columns = [
        { header: "NAMA", accessor: "nama" },
        { header: "EMAIL", accessor: "email" },
        { header: "PAKET", accessor: "langganan" },
        { 
            header: "STATUS", 
            accessor: "status", 
            render: (val) => {
                const colors = {
                    active: "bg-green-100 text-green-700",
                    pending: "bg-yellow-100 text-yellow-700",
                    expired: "bg-red-100 text-red-700"
                };
                return <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors[val] || "bg-gray-100"}`}>{val.toLowerCase()}</span>;
            } 
        },
        { header: "TGL BERAKHIR", accessor: "tanggal_berakhir" },
        {
            header: "AKSI",
            accessor: "id",
            render: (_, row) => {
                const stopProp = (e) => e.stopPropagation();
                const st = row.status.toLowerCase();

                // SVG Icons dari User
                const IconCheck = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5 17.5 22 12 22C6.5 22 2 17.5 2 12C2 6.47715 6.47715 2 12 2C17.5 2 22 6.47715 22 12Z"/></svg>;
                const IconBlock = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.93 4.93L19.07 19.07M22 12C22 17.5 17.5 22 12 22C6.47715 22 2 17.5 2 12C2 6.47715 6.47715 2 12 2C17.5 2 22 6.47715 22 12Z"/></svg>;
                const IconStats = <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 15V17M12 11V17M16 7V17M22 12C22 17.5 17.5 22 12 22C6.47715 22 2 17.5 2 12C2 6.47715 6.5 2 12 2C17.5 2 22 6.47715 22 12Z"/></svg>;

                if (st === "active" || st === "expired") {
                    return (
                        <div className="flex gap-2">
                            <button onClick={(e) => { stopProp(e); /* Logika Block */ }} className="flex items-center justify-center text-white bg-red-600 h-8 w-8 rounded-lg hover:bg-red-700" title="Blokir">
                                {IconBlock}
                            </button>
                            <button onClick={(e) => { stopProp(e); /* Logika Stats */ }} className="flex items-center justify-center text-white bg-blue-600 h-8 w-8 rounded-lg hover:bg-blue-700" title="Statistik">
                                {IconStats}
                            </button>
                        </div>
                    );
                }

                if (st === "pending") {
                    return (
                        <div className="flex gap-2">
                            <button onClick={(e) => { stopProp(e); /* Logika Approve */ }} className="flex items-center justify-center text-white bg-green-600 h-8 w-8 rounded-lg hover:bg-green-700" title="Setujui">
                                {IconCheck}
                            </button>
                            <button onClick={(e) => { stopProp(e); /* Logika Reject */ }} className="flex items-center justify-center text-white bg-red-600 h-8 w-8 rounded-lg hover:bg-red-700" title="Tolak">
                                {IconBlock}
                            </button>
                        </div>
                    );
                }
                return null;
            }
        }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            <PageHeader title="Daftar Subscriber" breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }, { label: "Daftar Subscriber", link: null }]} />

            {/* Statistik Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard title="Total Subscriber" count={4} iconWrapperClass="bg-blue-100 text-blue-600" 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

                <StatCard title="Aktif" count={2} iconWrapperClass="bg-green-100 text-green-600" 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 18L18 20L22 16M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

                                <StatCard title="Pending" count={1} iconWrapperClass="bg-yellow-100 text-yellow-600"
                                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7M11.9999 21.5L14.025 21.095C14.2015 21.0597 14.2898 21.042 14.3721 21.0097C14.4452 20.9811 14.5147 20.9439 14.579 20.899C14.6516 20.8484 14.7152 20.7848 14.8426 20.6574L21.5 14C22.0524 13.4477 22.0523 12.5523 21.5 12C20.9477 11.4477 20.0523 11.4477 19.5 12L12.8425 18.6575C12.7152 18.7848 12.6516 18.8484 12.601 18.921C12.5561 18.9853 12.5189 19.0548 12.4902 19.1278C12.458 19.2102 12.4403 19.2984 12.405 19.475L11.9999 21.5ZM13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

                                <StatCard title="Expired" count={1} iconWrapperClass="bg-red-100 text-red-600" icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 16L21.5 21M21.5 16L16.5 21M15.5 3.29076C16.9659 3.88415 18 5.32131 18 7C18 8.67869 16.9659 10.1159 15.5 10.7092M12 15H8C6.13623 15 5.20435 15 4.46927 15.3045C3.48915 15.7105 2.71046 16.4892 2.30448 17.4693C2 18.2044 2 19.1362 2 21M13.5 7C13.5 9.20914 11.7091 11 9.5 11C7.29086 11 5.5 9.20914 5.5 7C5.5 4.79086 7.29086 3 9.5 3C11.7091 3 13.5 4.79086 13.5 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>}/>
            </div>

            <div className="mx-auto p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                        <SearchInput placeholder="Cari nama atau email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <DynamicFilter filters={filterConfig} onFilterChange={handleFilterChange} currentValues={filterState} />
                    </div>
                </div>

                <DynamicTable 
                columns={columns} 
                data={processedData} 
                isLoading={false} 
                // Mengarahkan ke detail berdasarkan ID unik subscriber
                onRowClick={(row) => navigate(`../detail-pembayaran`)} 
                />
                    </div>
                </div>
    );
}