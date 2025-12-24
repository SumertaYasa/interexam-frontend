import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import DynamicTable from "../common/DynamicTable";
import DynamicFilter from "../common/DynamicFilter";
import ButtonAdd from "../common/ButtonAdd"; 

export default function DataPaketSoal() {
    const navigate = useNavigate();

    const [dataPaket, setDataPaket] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [filterState, setFilterState] = useState({
        status: "all",
        jenis: "all",
        sort: "newest"
    });

    const paketFilterConfig = [
        {
            key: "sort",
            label: "Urutkan Data",
            type: "radio",
            defaultValue: "newest",
            options: [
                { label: "Terbaru (Default)", value: "newest" },
                { label: "Terlama", value: "oldest" },
                { label: "Abjad (A-Z)", value: "a-z" },
                { label: "Abjad (Z-A)", value: "z-a" }
            ]
        },
        {
            key: "status",
            label: "Filter Status",
            type: "radio",
            defaultValue: "all",
            options: [
                { label: "Semua Status", value: "all" },
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Draft", value: "draft" }
            ]
        },
        {
            key: "jenis",
            label: "Filter Jenis",
            type: "radio",
            defaultValue: "all",
            options: [
                { label: "Semua Jenis", value: "all" },
                { label: "Berbayar", value: "berbayar" },
                { label: "Gratis", value: "gratis" }
            ]
        }
    ];

    const handleFilterChange = (key, value) => {
        setFilterState(prev => ({ ...prev, [key]: value }));
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const dummyData = [
                { 
                    id: 1, 
                    nama: "Latihan Matematika Dasar", 
                    mapel: "Matematika", 
                    jumlah: 50, 
                    jenis: "Gratis", 
                    status: "active", 
                    image: "/profile.jpg" 
                },
                { 
                    id: 2, 
                    nama: "Tryout Fisika UN 2024", 
                    mapel: "Fisika", 
                    jumlah: 40, 
                    jenis: "Berbayar", 
                    status: "draft",
                    image: "/profile.jpg" 
                },
                { 
                    id: 3, 
                    nama: "Latihan Biologi Sel", 
                    mapel: "Biologi", 
                    jumlah: 30, 
                    jenis: "Gratis", 
                    status: "inactive", 
                    image: "/profile.jpg" 
                },
                
            ];
            
            setTimeout(() => {
                setDataPaket(dummyData); 
                setIsLoading(false);
            }, 500);

        } catch (error) {
            console.error("Gagal load data:", error);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // LOGIKA FILTERING ---
    const processedData = dataPaket.filter(item => {
        const term = searchTerm.toLowerCase();
        const nama = String(item.nama || "").toLowerCase();
        const mapel = String(item.mapel || "").toLowerCase();
        const matchesSearch = nama.includes(term) || mapel.includes(term);

        let matchesStatus = true;
        if (filterState.status !== "all") {
            matchesStatus = item.status?.toLowerCase() === filterState.status;
        }

        let matchesJenis = true;
        if (filterState.jenis !== "all") {
            matchesJenis = item.jenis?.toLowerCase() === filterState.jenis;
        }

        return matchesSearch && matchesStatus && matchesJenis;

    }).sort((a, b) => {
        const namaA = String(a.nama || "").toLowerCase();
        const namaB = String(b.nama || "").toLowerCase();
        
        switch (filterState.sort) {
            case "a-z": return namaA.localeCompare(namaB);
            case "z-a": return namaB.localeCompare(namaA);
            case "oldest": return a.id - b.id;
            case "newest": default: return b.id - a.id;
        }
    });

    const handleDelete = (id) => {
        if(confirm("Apakah Anda yakin ingin menghapus paket soal ini?")) {
            setDataPaket(prev => prev.filter(p => p.id !== id));
            alert("Data berhasil dihapus (Simulasi).");
        }
    };

    const getStatusBadge = (status) => {
        const s = status?.toLowerCase() || "";
        switch(s) {
            case "active":
                return "bg-green-100 text-green-700";
            case "inactive":
                return "bg-yellow-100 text-yellow-700";
            case "draft":
                return "bg-gray-200 text-gray-900";
            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    // KOLOM TABEL ---
    const columns = [
        {
            header: "GAMBAR",
            render: (row) => (
                <img 
                    src={row.image || "/placeholder.jpg"} 
                    alt="Cover" 
                    className="rounded-lg h-12 w-16 object-cover border border-gray-200"
                />
            )
        },
        { header: "NAMA", accessor: "nama" },
        { header: "MATA PELAJARAN", accessor: "mapel" },
        { header: "JUMLAH SOAL", accessor: "jumlah", render: (row) => `${row.jumlah} Soal` },
        { 
            header: "JENIS", 
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    row.jenis?.toLowerCase() === 'berbayar' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                }`}>
                    {row.jenis}
                </span>
            ) 
        },
        {
            header: "STATUS",
            render: (row) => (
                <span className={`px-2 py-1 text-xs font-semibold rounded-md capitalize ${getStatusBadge(row.status)}`}>
                    {row.status}
                </span>
            )
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2 items-center">
                    <Link 
                        to={`edit/${row.id}`} 
                        className="flex items-center justify-center bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                        title="Edit"
                    >
                        <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>
                    </Link>
                    <button 
                        onClick={() => handleDelete(row.id)} 
                        className="flex items-center justify-center bg-red-700 hover:bg-red-800 text-white rounded-base h-8 w-8 transition-colors"
                        title="Hapus"
                    >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => alert(`Preview ID: ${row.id}`)} 
                        className="flex items-center justify-center bg-primary hover:bg-blue-700 text-white rounded-base h-8 w-8 transition-colors"
                        title="Lihat Detail"
                    >
                        <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            <PageHeader 
                title="Data Paket Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Paket Soal", link: null }
                ]}
            />

            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari paket soal..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <DynamicFilter 
                            filters={paketFilterConfig}
                            onFilterChange={handleFilterChange}
                            currentValues={filterState}
                        />
                    </div>
                    <ButtonAdd to="add" text="Add Paket Soal" />
                </div>

                <DynamicTable 
                    columns={columns} 
                    data={processedData} 
                    isLoading={isLoading} 
                    itemsPerPage={5} 
                />
            </div>
        </div>
    );
}