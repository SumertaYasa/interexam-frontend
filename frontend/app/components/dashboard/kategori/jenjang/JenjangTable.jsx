import { Link } from "react-router";
import { useState, useEffect } from "react";

import { jenjangService } from "../../../../services/jenjangService";

import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";


export default function JenjangTable() {
    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const result = await jenjangService.getAllJenjang();
                setData(result);
            } catch (error) {
                console.error("Gagal mengambil data jenjang:", error);
                alert("Gagal memuat data jenjang.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus Jenjang ini?")) {
            try {
                await jenjangService.deleteJenjang(id);
                setData(prev => prev.filter(item => item.id_jenjang !== id));
                alert("Jenjang berhasil dihapus.");
            } catch (error) {
                console.error("Gagal menghapus:", error);
                alert(error.message || "Gagal menghapus jenjang.");
            }
        }
    };

    const columns = [
        { 
            header: "NAMA JENJANG", 
            render: (row) => {
                const nama = row?.nama_jenjang || row?.jenjang || row?.nama || "";
                
                return <span className="font-medium text-gray-700">{nama || "-"}</span>;
            }
        },
        { 
            header: "DESKRIPSI", 
            render: (row) => {
                const ket = row?.keterangan || row?.deskripsi || row?.description || "";
                
                return (
                    <span className="text-gray-500 truncate max-w-xs block" title={ket}>
                        {ket || "-"}
                    </span>
                );
            }
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2">
                    {/* Tombol Edit */}
                    <Link 
                       to={`edit/${row.id_jenjang}`}
                        className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                        title="Edit User"
                    >
                        <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>
                    </Link>

                    {/* Tombol Delete */}
                    <button 
                        onClick={() => handleDelete(row.id_jenjang)}
                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                        title="Hapus jenjang"
                    >
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                    </button>
                </div>
            )
        }
    ];

    const filteredData = data.filter(item => {
        const term = searchTerm.toLowerCase();
        const name = item.nama_jenjang ? item.nama_jenjang.toLowerCase() : "";
        return name.includes(term);
    });
    
    return(
       <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Header */}
            <PageHeader 
                title="Data Jenjang"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Jenjang", link: null }
                ]}
            />

            {/* Container */}
            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                
                {/* Toolbar */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari Jenjang..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ButtonAdd to="add" text="Add Jenjang" />
                </div>

                {/* Table */}
                <DynamicTable 
                    columns={columns} 
                    data={filteredData} 
                    isLoading={isLoading} 
                    itemsPerPage={10}
                    emptyMessage="Data Jenjang tidak ditemukan."
                />
            </div>
        </div>
    );
}