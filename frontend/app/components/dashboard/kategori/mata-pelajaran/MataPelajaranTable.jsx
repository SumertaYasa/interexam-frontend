import { Link } from "react-router";
import { useState, useEffect } from "react";

import { subjectService } from "../../../../services/subjectService";

import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import ButtonAdd from "../../common/ButtonAdd";
import DynamicTable from "../../common/DynamicTable";

export default function MataPelajaranTable() {
    const [subjects, setSubjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchSubjects = async () => {
        setIsLoading(true);
        try {
            const data = await subjectService.getAllSubjects();
            setSubjects(data);
        } catch (error) {
            alert("Gagal memuat data mata pelajaran.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const handleDelete = async (id, nama) => {
        if (!confirm(`Yakin ingin menghapus Mata Pelajaran: ${nama}?`)) return;

        try {
            const result = await subjectService.deleteSubject(id);
            alert(`Sukses: ${result.message}`);
            setSubjects(subjects.filter(subj => subj.id_subject !== id));
        } catch (error) {
            alert(error.message);
        }
    };

    const subjectColumns = [
        { 
            header: "MATA PELAJARAN", 
            accessor: "nama_subject" 
        },
        { 
            header: "KETERANGAN", 
            accessor: "keterangan",
            render: (val, row) => {
                const teks = val; 

                if (!teks) {
                    return <span className="text-gray-400 italic">—</span>;
                }

                return (
                    <span className="text-gray-600 max-w-sm truncate block" title={teks}>
                        {teks}
                    </span>
                );
            }
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2 items-center">
                    {/* Tombol Edit */}
                    <Link 
                        to={`edit/${row.id_subject}`} 
                        className="flex items-center justify-center bg-amber-300 rounded-base h-8 w-8 hover:bg-amber-400 transition-colors"
                        title="Edit"
                    >
                        <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" /></svg>
                    </Link>

                    {/* Tombol Delete */}
                    <button 
                        onClick={() => handleDelete(row.id_subject, row.nama_subject)} 
                        className="flex items-center justify-center text-white bg-red-700 h-8 w-8 rounded-base hover:bg-red-800 transition-colors"
                        title="Hapus"
                    >
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg>
                    </button>
                </div>
            )
        }
    ];

    // --- SEARCH ---
    const filteredSubjects = subjects.filter(item => 
        item.nama_subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.keterangan && item.keterangan.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Header */}
            <PageHeader 
                title="Mata Pelajaran"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Mata Pelajaran", link: null }
                ]}
            />

            {/* Container Utama */}
            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                
                {/* Toolbar (Search & Add) */}
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari mata pelajaran..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    
                    <ButtonAdd to="add" text="Add Mata Pelajaran" />
                </div>

                <DynamicTable 
                    columns={subjectColumns} 
                    data={filteredSubjects} 
                    isLoading={isLoading} 
                    itemsPerPage={5}
                />
                
            </div>
        </div>
    );
}