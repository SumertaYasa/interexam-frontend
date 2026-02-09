import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import DynamicFilter from "../common/DynamicFilter";
import ActionButton from "../common/ActionButton";
import EventCard from "../common/EventCard"; 

const DUMMY_EVENTS_LIST = [
    { 
        id: 1, 
        nama_event: "Mega Tryout UTBK SNBT 2026 Gelombang 1", 
        kategori: "UTBK SNBT", 
        jenis: "Berbayar", 
        status: "active", 
        jumlah_paket: 4, 
        tanggal_mulai: "12 Feb 2026",
        image: "https://placehold.co/600x400/1e40af/ffffff?text=TRYOUT+UTBK"
    },
    { 
        id: 2, 
        nama_event: "Simulasi CPNS SKD Nasional", 
        kategori: "CPNS", 
        jenis: "Gratis", 
        status: "active", 
        jumlah_paket: 2, 
        tanggal_mulai: "20 Feb 2026",
        image: "https://placehold.co/600x400/991b1b/ffffff?text=CPNS+SKD"
    },
    { 
        id: 3, 
        nama_event: "Ujian Akhir Semester Matematika SD", 
        kategori: "Sekolah Dasar", 
        jenis: "Gratis", 
        status: "draft", 
        jumlah_paket: 1, 
        tanggal_mulai: "01 Mar 2026",
        image: "https://placehold.co/600x400/166534/ffffff?text=UAS+SD"
    },
    { 
        id: 4, 
        nama_event: "Olimpiade Sains Nasional (OSN) Fisika", 
        kategori: "Olimpiade", 
        jenis: "Berbayar", 
        status: "inactive", 
        jumlah_paket: 5, 
        tanggal_mulai: "15 Apr 2026",
        image: "https://placehold.co/600x400/6b21a8/ffffff?text=OSN+FISIKA"
    },
    { 
        id: 5, 
        nama_event: "Latihan Soal Harian Bahasa Inggris", 
        kategori: "Bahasa", 
        jenis: "Gratis", 
        status: "active", 
        jumlah_paket: 10, 
        tanggal_mulai: "Setiap Hari",
        image: "https://placehold.co/600x400/ea580c/ffffff?text=ENGLISH+DAILY"
    },
];

export default function DataEvent() {
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({ jenis: "all", status: "all" });

    const filterConfig = [
        {
            key: "jenis", label: "Jenis", type: "radio",
            options: [{ label: "Semua", value: "all" }, { label: "Gratis", value: "Gratis" }, { label: "Berbayar", value: "Berbayar" }]
        },
        {
            key: "status", label: "Status", type: "radio",
            options: [{ label: "Semua", value: "all" }, { label: "Active", value: "active" }, { label: "Inactive", value: "inactive" }, { label: "Draft", value: "draft" }]
        }
    ];

    useEffect(() => {
        setEvents(DUMMY_EVENTS_LIST);
    }, []);

    const filteredData = events.filter(item => {
        const matchSearch = item.nama_event.toLowerCase().includes(search.toLowerCase());
        const matchJenis = filters.jenis === "all" || item.jenis === filters.jenis;
        const matchStatus = filters.status === "all" || item.status === filters.status;
        return matchSearch && matchJenis && matchStatus;
    });

    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    const handleDelete = (id) => {
        if(window.confirm("Yakin ingin menghapus event ini?")) {
            setEvents(prev => prev.filter(e => e.id !== id));
        }
    };

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50 font-noto-sans">
            
            <PageHeader 
                title="Data Event"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Event", link: null }
                ]}
            />

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center">
                    
                    <div className="flex flex-row gap-2 w-full md:w-auto flex-1 items-center">
                        <div className="relative flex-1"> 
                            <SearchInput 
                                placeholder="Cari nama event..." 
                                value={search} 
                                onChange={(e) => setSearch(e.target.value)} 
                            />
                        </div>
                        <div className="shrink-0"> 
                            <DynamicFilter 
                                filters={filterConfig}
                                currentValues={filters}
                                onFilterChange={(key, val) => setFilters(prev => ({ ...prev, [key]: val }))}
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-auto md:ml-auto">
                        <ActionButton 
                            text="+ Buat Event" 
                            onClick={() => navigate("add")} 
                            variant="primary"
                            className="w-full justify-center"
                        />
                    </div>
                </div>
            </div>

            {/* GRID KONTEN*/}
            {filteredData.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {filteredData.map(event => (
                        <EventCard 
                            key={event.id} 
                            event={event} 
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            ) : (
                // EMPTY STATE
                <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
                    <div className="mx-auto w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                    </div>
                    <h3 className="text-base font-medium text-gray-900">Tidak ada event ditemukan</h3>
                    <p className="text-sm text-gray-500 mt-1">Coba ubah kata kunci pencarian atau filter.</p>
                </div>
            )}
        </div>
    );
}