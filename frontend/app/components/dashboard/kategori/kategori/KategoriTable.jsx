import { Link } from "react-router";
import { useState, useEffect } from "react";

import { categoryService } from "../../../../services/categoryService";

import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";

export default function KategoriTable() {
    const [data, setData] = useState([]); 
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {

                const result = await categoryService.getAllCategories();
                setData(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Gagal mengambil data kategori:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!id) return;
        
        if (window.confirm("Apakah Anda yakin ingin menghapus Kategori ini?")) {
            try {

                await categoryService.deleteCategory(id);
                
                setData(prev => prev.filter(item => (item.id_category || item.id) !== id));
                
                alert("Kategori berhasil dihapus.");
            } catch (error) {
                console.error("Gagal menghapus:", error);
                alert(error.message || "Gagal menghapus kategori.");
            }
        }
    };

    const columns = [
        { 
            header: "NAMA KATEGORI", 
            render: (row) => {

                const nama = row?.nama_category || row?.category || row?.nama || "";
                return <span className="font-medium text-gray-700">{nama || "-"}</span>;
            }
        },
        { 
            header: "DESKRIPSI", 
            render: (row) => {
                const ket = row?.keterangan || row?.deskripsi || "";
                return (
                    <span className="text-gray-500 truncate max-w-xs block" title={ket}>
                        {ket || "-"}
                    </span>
                );
            }
        },
        {
            header: "AKSI",
            render: (row) => {
                const id = row?.id_category || row?.id;

                if (!id) return null;

                return (
                    <div className="flex gap-2">
                        {/* Tombol Edit */}
                        <Link 
                            to={`edit/${id}`} 
                            className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                            title="Edit Kategori"
                        >
                            <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                            </svg>
                        </Link>

                        {/* Tombol Delete */}
                        <button 
                            onClick={() => handleDelete(id)}
                            className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                            title="Hapus Kategori"
                        >
                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                            </svg>
                        </button>
                    </div>
                );
            }
        }
    ];

    // Filter Logic
    const filteredData = data.filter(item => {
        const term = searchTerm.toLowerCase();
        const rawName = item?.nama_category || item?.category || "";
        const name = String(rawName).toLowerCase(); 
        
        return name.includes(term);
    });

    return(
       <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            <PageHeader 
                title="Data Kategori"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Kategori", link: null }
                ]}
            />

            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari Kategori..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ButtonAdd to="add" text="Add Kategori" />
                </div>

                <DynamicTable 
                    columns={columns} 
                    data={filteredData} 
                    isLoading={isLoading} 
                    itemsPerPage={10}
                    emptyMessage="Data Kategori tidak ditemukan."
                />
            </div>
        </div>
    );
}