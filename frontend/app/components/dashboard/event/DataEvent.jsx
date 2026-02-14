import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

import { eventService } from "../../../services/eventService";

import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import DynamicFilter from "../common/DynamicFilter";
import ActionButton from "../common/ActionButton";
import EventCard from "../common/EventCard"; 


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

    const fetchData = async () => {
        try {
            const params = {
                search: search,
                jenis: filters.jenis,
                status: filters.status
            };

            const response = await eventService.getAllEvents(params);
            
            setEvents(response.data || []);
            
        } catch (error) {
            console.error("Gagal memuat event:", error);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchData();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, filters]); 

    // Edit Handler
    const handleEdit = (id) => {
        navigate(`edit/${id}`);
    };

    const filteredData = events.filter(item => {
        const matchSearch = item.nama_event.toLowerCase().includes(search.toLowerCase());
        const matchJenis = filters.jenis === "all" || item.jenis === filters.jenis;
        const matchStatus = filters.status === "all" || item.status === filters.status;
        return matchSearch && matchJenis && matchStatus;
    });

    const handleDelete = async (id) => {
        if(window.confirm("Yakin ingin menghapus event ini?")) {
            try {
                await eventService.deleteEvent(id);
                setEvents(prev => prev.filter(e => e.id !== id));
            } catch (error) {
                console.error("Gagal hapus:", error);
                alert("Gagal menghapus event.");
            }
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