import { Link, useNavigate } from "react-router"; 
import { useState, useEffect, useMemo } from "react";

import { subscriptionService } from "../../../../services/subscriptionService";

import PageHeader from "../../common/PageHeader";
import SearchInput from "../../common/SearchInput";
import DynamicTable from "../../common/DynamicTable";
import StatCard from "../../common/StatCard";
import DynamicFilter from "../../common/DynamicFilter";



export default function AkunSubscriber() {
    const navigate = useNavigate();

    const [subscribers, setSubscribers] = useState([]);
    const [stats, setStats] = useState({ total_semua: 0, total_active: 0, total_inactive: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterState, setFilterState] = useState({ langganan: "all", sort: "newest" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await subscriptionService.getDashboardSubscribers();
                if (response.status === "success") {
                    setSubscribers(response.data);
                    setStats(response.statistics);
                }
            } catch (error) {
                console.error("Gagal load data akun subscriber", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const filterConfig = [
        { key: "sort", label: "Urutkan", type: "radio", options: [{ label: "Terbaru", value: "newest" }, { label: "Terlama", value: "oldest" }] },
        { key: "langganan", label: "langganan", type: "radio", options: [{ label: "Semua", value: "all" }, { label: "Langganan", value: "langganan" }, { label: "Tidak Berlangganan", value: "tidak-berlangganan" }] }
    ];

    const handleFilterChange = (key, value) => setFilterState(prev => ({ ...prev, [key]: value }));

    const processedData = useMemo(() => {
        return subscribers.filter((item) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = (item.nama?.toLowerCase() || "").includes(search) || (item.email?.toLowerCase() || "").includes(search);
            
            let matcheslangganan = true;
            if (filterState.langganan === "langganan") {
                matcheslangganan = item.status === "active";
            } else if (filterState.langganan === "tidak-berlangganan") {
                matcheslangganan = item.status === "inactive";
            }

            return matchesSearch && matcheslangganan;
        });
    }, [searchTerm, filterState, subscribers]);

    const columns = [
        { 
            header: "NAMA", 
            accessor: "nama",
            render: (val) => <span className="font-semibold text-gray-900">{val}</span>
        },
        { 
            header: "EMAIL", 
            accessor: "email",
            render: (val) => {
                const email = val || "-";
                return <span className="text-gray-600" title={email}>{email.length > 20 ? email.substring(0, 20) + "..." : email}</span>
            }
        },
        { 
            header: "LANGGANAN", 
            accessor: "langganan",
            render: (val, row) => {
                if (row.status === "inactive") {
                    return <span className="text-gray-400 italic">Tidak Berlangganan</span>;
                }
                return <span className="font-medium text-gray-800">{val}</span>;
            }
        },
        { 
            header: "HARGA", 
            accessor: "harga", 
            render: (val, row) => {
                if (row.status === "inactive" || !val || val === 0) {
                    return <span className="text-gray-400">Rp -</span>;
                }
                return <span className="text-gray-700">Rp {val.toLocaleString("id-ID")}</span>;
            }
        },
    ];

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            <PageHeader
                title="Akun Subscriber"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Akun Subscriber", link: "/dashboard/akun-subscriber" },
                ]}
            />

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                
                <StatCard title="Total Subscriber" count={stats.total_semua} iconWrapperClass="bg-primary/10 text-primary" 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

                <StatCard title="Total Berlangganan" count={stats.total_active}iconWrapperClass="bg-green-100 text-green-600" 
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

                <StatCard title="Total Tidak Berlangganan" count={stats.total_inactive} iconWrapperClass="bg-yellow-100 text-yellow-600"
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>} />

            </div>

            <div className="mx-auto p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="flex flex-row items-center gap-4 w-full sm:w-auto">
                        <SearchInput placeholder="Cari Soal..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <DynamicFilter filters={filterConfig} onFilterChange={handleFilterChange} currentValues={filterState} />
                    </div>
                </div>

                {/* TABEL */}
                <DynamicTable 
                    columns={columns} 
                    data={processedData} 
                    isLoading={false} 
                    emptyMessage="Tidak ada subscriber." 
                />
            </div>
        </div>
    );
}