import { Link } from "react-router";
import { useState, useEffect } from "react";


import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";

const dummySubTopikData = [
    { id: 1, mata_pelajaran: "Matematika", topik: "Aljabar", sub_topik: "Persamaan Linear Satu Variabel", deskripsi: "Mempelajari konsep dasar PLSV dan penyelesaiannya.", jenjang: "SMP" },
    { id: 2, mata_pelajaran: "Biologi", topik: "Sel", sub_topik: "Struktur Sel Hewan", deskripsi: "Detail organel sel hewan dan fungsinya.", jenjang: "SMA" },
    { id: 3, mata_pelajaran: "Fisika", topik: "Dinamika Gerak", sub_topik: "Hukum Newton I", deskripsi: "Konsep kelembaman benda.", jenjang: "SMA" },
    
];

export default function SubTopikPage() {
    const [data, setData] = useState(dummySubTopikData);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false); 

    const handleDelete = (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus sub topik ini?")) {
            setData(prev => prev.filter(item => item.id !== id));
        }
    };

    const subTopicColumns = [
        { 
            header: "MATA PELAJARAN", 
            accessor: "mata_pelajaran",
            render: (row) => <span className="font-medium text-gray-700">{row.mata_pelajaran}</span>
        },
        { 
            header: "TOPIK", 
            accessor: "topik",
            render: (row) => <span className="font-medium text-gray-700">{row.topik}</span>
        },
        { 
            header: "SUB TOPIK", 
            accessor: "sub_topik",
            render: (row) => <span className="font-medium text-gray-900">{row.sub_topik}</span>
        },
        { 
            header: "DESKRIPSI", 
            accessor: "deskripsi",
            render: (row) => <span className="text-gray-500 truncate max-w-xs block" title={row.deskripsi}>{row.deskripsi}</span>
        },
        { 
            header: "JENJANG", 
            accessor: "jenjang",
            render: (row) => <span className="font-medium text-gray-700" title={row.jenjang}>{row.jenjang}</span>
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2">
                    {/* Tombol Edit */}
                    <Link 
                        to={`edit/${row.id_user}`} 
                        className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                        title="Edit User"
                    >
                        <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>
                    </Link>

                    {/* Tombol Delete */}
                    <button 
                        onClick={() => handleDelete(row.id_user)}
                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                        title="Hapus User"
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
        return (
            item.sub_topik.toLowerCase().includes(term) ||
            item.topik.toLowerCase().includes(term) ||
            item.mata_pelajaran.toLowerCase().includes(term)
        );
    });

    return(
       <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Header */}
            <PageHeader 
                title="Data Sub Topik"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Sub Topik", link: null }
                ]}
            />

            {/* Container */}
            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                
                {/* Toolbar */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari sub topik..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ButtonAdd to="add" text="Add Sub Topik" />
                </div>

                {/* Table */}
                <DynamicTable 
                    columns={subTopicColumns} 
                    data={filteredData} 
                    isLoading={isLoading} 
                    itemsPerPage={10}
                    emptyMessage="Data sub topik tidak ditemukan."
                />
            </div>
        </div>
    );
}