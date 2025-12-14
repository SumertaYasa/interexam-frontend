import { Link } from "react-router"; 
import { useState, useEffect } from "react";

import { soalService } from "../../../services/soalService";

import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import ButtonAdd from "../common/ButtonAdd";
import DynamicTable from "../common/DynamicTable";
import StatCard from "../common/StatCard"; 

export default function SoalPage() {
    const [dataSoal, setDataSoal] = useState([]);
    const [statistics, setStatistics] = useState({
        total_dibuat: 0, total_tervalidasi: 0, total_draft: 0, total_ditolak: 0, total_need_verification: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedIds, setSelectedIds] = useState([]);
    const [isDuplicating, setIsDuplicating] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const result = await soalService.getMyQuestions();
            setDataSoal(result.data || []);
            setStatistics(result.statistics || {});
        } catch (error) {
            console.error("Gagal ambil data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, 
    []);

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
            try {
                await soalService.deleteQuestion(id);
                alert("Soal berhasil dihapus.");
                fetchData();
            } 
            catch (error) {
                alert("Gagal menghapus soal.");
            }
        }

    };

    const handleDuplicate = async () => {
        if (selectedIds.length === 0) return alert("Pilih minimal satu soal.");
        if (!window.confirm(`Duplikasi ${selectedIds.length} soal?`)) return;

        setIsDuplicating(true);
        try {
            await soalService.duplicateQuestions(selectedIds, dataSoal);
            alert("Duplikat berhasil!");
            setSelectedIds([]); 
            fetchData(); 
        } 
        catch (error) {
            alert("Gagal duplikat.");
        } finally {
            setIsDuplicating(false);
        }
    };

    const handleCheckboxChange = (id) => {
        if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
        else setSelectedIds([...selectedIds, id]);
    };

    const truncateText = (text, maxLength = 30) => {
        if (!text) return "-";
        return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
    };

    const getStatusStyle = (status) => {
        const lowerStatus = status ? status.toLowerCase() : "";
        switch (lowerStatus) {
            case "disetujui": return "bg-green-100 text-green-600";
            case "draft": return "bg-gray-200 text-gray-600";
            case "need_verification":
            case "need verification": return "bg-warning/10 text-warning";
            case "ditolak": return "bg-red-100 text-red-600";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "";
        return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    };

    const soalColumns = [
        {
            header: "SOAL",
            render: (row) => truncateText(row.text_soal || row.soal, 15)
        },
        { header: "MATA PELAJARAN", accessor: "mata_pelajaran" },
        { 
            header: "TIPE SOAL", 
            render: (row) => row.tipe_soal === 'multiple_choice' ? 'Pilihan Ganda' : (row.tipe_soal === 'multiple_answer' ? 'Multi Jawaban' : row.tipe_soal)
        },
        { 
            header: "LEVEL KESULITAN", 
            render: (row) => <span className="capitalize">{row.level_kesulitan}</span>
        },
        {
            header: "STATUS",
            render: (row) => (
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusStyle(row.status)}`}>
                    {formatStatus(row.status)}
                </span>
            )
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2 items-center">
                    {/* Edit */}
                    <Link to={`edit/${row.id}`} className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors">
                        <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" /></svg>
                    </Link>
                    {/* Delete */}
                    <button type="button" onClick={() => handleDelete(row.id)} className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors">
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg>
                    </button>
                    {/* Checkbox Duplikat */}
                    <input 
                        id={`checkbox-${row.id}`}
                        type="checkbox" 
                        checked={selectedIds.includes(row.id)} 
                        onChange={() => handleCheckboxChange(row.id)} 
                        className="w-8 h-8 rounded-xl border-1 border-primary bg-white text-primary cursor-pointer"
                    />
                </div>
            )
        }
    ];

    // Filter Data
    const filteredData = dataSoal.filter(item => {
        const term = searchTerm.toLowerCase();
        const textSoal = item.text_soal ? item.text_soal.toLowerCase() : "";
        
        return (
            (item.mata_pelajaran && item.mata_pelajaran.toLowerCase().includes(term)) ||
            (item.tipe_soal && item.tipe_soal.toLowerCase().includes(term)) ||
            (item.level_kesulitan && item.level_kesulitan.toLowerCase().includes(term)) ||
            (textSoal.includes(term))
        );
    });

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            <PageHeader 
                title="Data Soal"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data Soal", link: null }
                ]}
            />

            {/* --- STATISTIK CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-10">
                
                {/* CARD TOTAL */}
                <StatCard 
                    title="Total soal yang di buat"
                    count={statistics.total_dibuat}
                    iconWrapperClass="bg-blue-100 text-primary"
                    icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H5.2C4.07989 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V7.2C2 6.07989 2 5.51984 2.21799 5.09202C2.40973 4.71569 2.71569 4.40973 3.09202 4.21799C3.51984 4 4.07989 4 5.2 4H5.6C7.84021 4 8.96031 4 9.81596 4.43597C10.5686 4.81947 11.1805 5.43139 11.564 6.18404C12 7.03968 12 8.15979 12 10.4M12 20V10.4M12 20H18.8C19.9201 20 20.4802 20 20.908 19.782C21.2843 19.5903 21.5903 19.2843 21.782 18.908C22 18.4802 22 17.9201 22 16.8V7.2C22 6.07989 22 5.51984 21.782 5.09202C21.5903 4.71569 21.2843 4.40973 20.908 4.21799C20.4802 4 19.9201 4 18.8 4H18.4C16.1598 4 15.0397 4 14.184 4.43597C13.4314 4.81947 12.8195 5.43139 12.436 6.18404C12 7.03968 12 8.15979 12 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    badgeClass="bg-green-100 text-green-700"
                    badgeContent={<><svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg> Semua Soal</>}
                    subtext="setiap soal bermakna"
                />

                {/* CARD TERVALIDASI */}
                <StatCard 
                    title="Total soal tervalidasi"
                    count={statistics.total_tervalidasi}
                    iconWrapperClass="bg-green-100 text-green-600"
                    icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    badgeClass="bg-warning/10 text-warning"
                    badgeContent={`${statistics.total_need_verification} belum tervalidasi`}
                    subtext="Pastikan soal benar"
                />

                {/* CARD DRAFT */}
                <StatCard 
                    title="Total soal draft"
                    count={statistics.total_draft}
                    iconWrapperClass="bg-gray-100 text-gray-600"
                    icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 3.5V6.2C13 7.88016 13 8.72024 13.327 9.36197C13.6146 9.92646 14.0735 10.3854 14.638 10.673C15.2798 11 16.1198 11 17.8 11H20.5M21 12.9882V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H11.0118C11.7455 3 12.1124 3 12.4577 3.08289C12.7638 3.15638 13.0564 3.27759 13.3249 3.44208C13.6276 3.6276 13.887 3.88703 14.4059 4.40589L19.5941 9.59411C20.113 10.113 20.3724 10.3724 20.5579 10.6751C20.7224 10.9436 20.8436 11.2362 20.9171 11.5423C21 11.8876 21 12.2545 21 12.9882Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    badgeClass="bg-gray-300 text-gray-700"
                    badgeContent={`${statistics.total_draft} soal status draft`}
                    subtext="Ayo ajukan soal!"
                />

                {/* CARD DITOLAK */}
                <StatCard 
                    title="Total soal ditolak"
                    count={statistics.total_ditolak}
                    iconWrapperClass="bg-red-100 text-red-600"
                    icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    badgeClass="bg-red-200 text-red-700"
                    badgeContent="soal ditolak"
                    subtext="Segera perbaiki soal!"
                />
            </div>

            {/* Container Tabel */}
            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari soal..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                        <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button 
                            onClick={handleDuplicate} 
                            disabled={isDuplicating || selectedIds.length === 0}
                            className={`w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-primary text-sm font-medium rounded-2xl h-10 shadow-sm text-primary transition-colors ${selectedIds.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'}`}
                        >
                            {isDuplicating ? "Proses..." : "Duplikat"}
                        </button>
                        <ButtonAdd to="add" text="Add Soal" />
                    </div>
                </div>

                <DynamicTable 
                    columns={soalColumns} 
                    data={filteredData} 
                    isLoading={isLoading} 
                    itemsPerPage={10} 
                />
            </div>

        </div>
    );
}