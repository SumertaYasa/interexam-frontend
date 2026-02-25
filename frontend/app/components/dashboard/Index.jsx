import { Link, useNavigate } from "react-router"; 
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
// Pastikan folder ini sudah sesuai!
import { dashboardService } from "../../services/dashboardService"; 

import PageHeader from "./common/PageHeader";
import SearchInput from "./common/SearchInput";
import DynamicTable from "./common/DynamicTable";
import StatCard from "./common/StatCard"; 
import DynamicFilter from "./common/DynamicFilter";
import SimpleBarChart from "./common/SimpleBarChart";

// =========================================
// KOMPONEN HELPER: DASHBOARD INFO CARD
// =========================================
const DashboardInfoCard = ({ title, icon, value, badgeText, badgeTheme = "green", subText, iconTheme = "blue" }) => {
    const themes = {
        blue: { iconBg: "bg-primary/10 text-primary", badgeBg: "bg-primary/10 text-primary/70" },
        green: { iconBg: "bg-green-50 text-green-600", badgeBg: "bg-green-100 text-green-700" },
        yellow: { iconBg: "bg-yellow-50 text-yellow-600", badgeBg: "bg-yellow-100 text-yellow-800" },
        red: { iconBg: "bg-red-50 text-red-600", badgeBg: "bg-red-100 text-red-700" },
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center font-noto-sans h-full">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${themes[iconTheme].iconBg}`}>{icon}</div>
                <h3 className="text-gray-600 font-semibold text-sm lg:text-base">{title}</h3>
            </div>
            <div className="flex items-center gap-4">
                <h2 className="text-4xl lg:text-[42px] font-bold text-gray-900 leading-none">{value}</h2>
                <div className="flex flex-col items-start gap-1.5">
                    {badgeText && (
                        <span className={`text-[10px] px-2.5 py-1 rounded-md font-bold uppercase ${themes[badgeTheme].badgeBg}`}>
                            {badgeText}
                        </span>
                    )}
                    {subText && <p className="text-gray-400 text-[11px] font-medium leading-tight">{subText}</p>}
                </div>
            </div>
        </div>
    );
};

// ICONS SVG (TETAP)
const Icons = {
    book: <svg className="w-5 h-5 transition duration-75 min-w-[24px] flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H5.2C4.07989 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V7.2C2 6.07989 2 5.51984 2.21799 5.09202C2.40973 4.71569 2.71569 4.40973 3.09202 4.21799C3.51984 4 4.07989 4 5.2 4H5.6C7.84021 4 8.96031 4 9.81596 4.43597C10.5686 4.81947 11.1805 5.43139 11.564 6.18404C12 7.03968 12 8.15979 12 10.4M12 20V10.4M12 20H18.8C19.9201 20 20.4802 20 20.908 19.782C21.2843 19.5903 21.5903 19.2843 21.782 18.908C22 18.4802 22 17.9201 22 16.8V7.2C22 6.07989 22 5.51984 21.782 5.09202C21.5903 4.71569 21.2843 4.40973 20.908 4.21799C20.4802 4 19.9201 4 18.8 4H18.4C16.1598 4 15.0397 4 14.184 4.43597C13.4314 4.81947 12.8195 5.43139 12.436 6.18404C12 7.03968 12 8.15979 12 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg className="w-5 h-5 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    user: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    smile: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    alert: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    subscriber: <svg className="w-5 h-5 transition duration-75 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 8H8.01M2 5.2L2 9.67451C2 10.1637 2 10.4083 2.05526 10.6385C2.10425 10.8425 2.18506 11.0376 2.29472 11.2166C2.4184 11.4184 2.59135 11.5914 2.93726 11.9373L10.6059 19.6059C11.7939 20.7939 12.388 21.388 13.0729 21.6105C13.6755 21.8063 14.3245 21.8063 14.927 21.6105C15.612 21.388 16.2061 20.7939 17.3941 19.6059L19.6059 17.3941C20.7939 16.2061 21.388 15.612 21.6105 14.927C21.8063 14.3245 21.8063 13.6755 21.6105 13.0729C21.388 12.388 20.7939 11.7939 19.6059 10.6059L11.9373 2.93726C11.5914 2.59135 11.4184 2.4184 11.2166 2.29472C11.0376 2.18506 10.8425 2.10425 10.6385 2.05526C10.4083 2 10.1637 2 9.67452 2L5.2 2C4.0799 2 3.51984 2 3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2ZM8.5 8C8.5 8.27614 8.27614 8.5 8 8.5C7.72386 8.5 7.5 8.27614 7.5 8C7.5 7.72386 7.72386 7.5 8 7.5C8.27614 7.5 8.5 7.72386 8.5 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    paket: <svg className="w-7 h-7 transition duration-75 min-w-[24px] flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.1429 11v9m0-9c-2.50543-.7107-3.19099-1.39543-6.13657-1.34968-.48057.00746-.86348.38718-.86348.84968v7.2884c0 .4824.41455.8682.91584.8617 2.77491-.0362 3.45995.6561 6.08421 1.3499m0-9c2.5053-.7107 3.1067-1.39542 6.0523-1.34968.4806.00746.9477.38718.9477.84968v7.2884c0 .4824-.4988.8682-1 .8617-2.775-.0362-3.3758.6561-6 1.3499m2-14c0 1.10457-.8955 2-2 2-1.1046 0-2-.89543-2-2s.8954-2 2-2c1.1045 0 2 .89543 2 2Z"/></svg>,
    money: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 icon icon-tabler icons-tabler-outline icon-tabler-cash" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" /><path d="M7 10a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8" /><path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /></svg>,
    event: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition duration-75 min-w-[24px] flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" /></svg>
};

// =========================================
// 1. ADMIN DASHBOARD
// =========================================
const AdminDashboard = ({ stats, recentSubs }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterState, setFilterState] = useState({ status: "all", sort: "newest" });

    // Hapus total array dummy, pastikan aman dari API
    const dataSource = recentSubs || [];

    const filterConfig = [
        { key: "sort", label: "Urutkan", type: "radio", options: [{ label: "Terbaru", value: "newest" }, { label: "Terlama", value: "oldest" }] },
        { 
            key: "status", 
            label: "Status", 
            type: "radio", 
            options: [
                { label: "Semua", value: "all" }, 
                { label: "Active", value: "active" }, 
                { label: "Inactive", value: "inactive" },
                { label: "Pending", value: "pending" }
            ] 
        }
    ];

    const handleFilterChange = (key, value) => setFilterState(prev => ({ ...prev, [key]: value }));

    const processedData = useMemo(() => {
        let filtered = dataSource.filter((item) => {
            const search = searchTerm.toLowerCase();
            const matchesSearch = (item.nama?.toLowerCase() || "").includes(search) || (item.email?.toLowerCase() || "").includes(search);
            
            let matchesStatus = true;
            if (filterState.status && filterState.status !== "all") {
                matchesStatus = item.status?.toLowerCase() === filterState.status.toLowerCase();
            }
            
            return matchesSearch && matchesStatus;
        });

        filtered.sort((a, b) => {
            if (filterState.sort === "newest") {
                return b.id - a.id; 
            } else if (filterState.sort === "oldest") {
                return a.id - b.id; 
            }
            return 0;
        });

        return filtered;
    }, [searchTerm, filterState, dataSource]);

    const columns = [
        { header: "NAMA", accessor: "nama", render: (val) => <span className="font-semibold text-gray-900">{val}</span> },
        { header: "EMAIL", accessor: "email", render: (val) => { const email = val || "-"; return <span className="text-gray-600" title={email}>{email.length > 20 ? email.substring(0, 20) + "..." : email}</span> } },
        { header: "PAKET", accessor: "jenis_paket" },
        { header: "HARGA", accessor: "harga", render: (val) => <span className="text-gray-700">Rp{(val || 0).toLocaleString('id-ID')}</span> },
        { header: "STATUS", accessor: "status", render: (val) => {
                const status = (val || "").toLowerCase();
                const colors = { active: "bg-green-100 text-green-700 border-green-200", pending: "bg-yellow-100 text-yellow-700 border-yellow-200", expired: "bg-red-100 text-red-700 border-red-200", suspended: "bg-gray-100 text-gray-700 border-gray-200" };
                return <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${colors[status] || "bg-gray-100"}`}>{status}</span>;
            }
        },
        { header: "TANGGAL PEMBELIAN", accessor: "tanggal_beli" },
        { header: "TANGGAL BERAKHIR", accessor: "tanggal_berakhir" },
    ];

    // Ambil nilai pasti dari API, fallback ke 0 jika kosong
    const totalSemua = stats?.totalSub || 0;
    const totalAktif = stats?.activeSub || 0;

    // Kalkulasi Inaktif
    const inActiveCount = totalSemua - totalAktif;
    // Cegah angka minus jika terjadi anomali data
    const safeInActive = inActiveCount > 0 ? inActiveCount : 0;

    return (
        <div className="space-y-6 animate-fade-in font-noto-sans">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Subscriber" count={stats?.totalSub || 0} iconWrapperClass="bg-primary/10 text-primary" icon={Icons.subscriber} />
                <StatCard title="Total Paket Soal" count={stats?.totalPaket || 0} iconWrapperClass="bg-primary/10 text-primary" icon={Icons.paket} />
                <StatCard 
                    title="Pendapatan 1 Bulan" 
                    count={<span className="text-xl sm:text-2xl font-bold leading-tight block">Rp{(stats?.income || 0).toLocaleString('id-ID')}</span>} 
                    iconWrapperClass="bg-primary/10 text-primary" 
                    icon={Icons.money} 
                />
                <StatCard title="Total Event" count={stats?.totalEvent || 0} iconWrapperClass="bg-primary/10 text-primary" icon={Icons.event} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardInfoCard title="Total Soal" value={stats?.totalSoal || 0} badgeText="Soal dibuat contributor" badgeTheme="green" icon={Icons.book} iconTheme="blue" />
                <DashboardInfoCard title="Total soal Disetujui" value={stats?.approvedSoal || 0} badgeText={`${stats?.pendingSoal || 0} soal belum tervalidasi`} badgeTheme="yellow" icon={Icons.check} iconTheme="blue" />
                <DashboardInfoCard 
                    title="Total Subscriber Active" 
                    value={totalAktif} 
                    badgeText={`${safeInActive} Subscriber tidak active`} 
                    badgeTheme="red" 
                    icon={Icons.user} 
                    iconTheme="blue" 
                />
            </div>

            <div>
                <div className="mt-8">
                    <PageHeader 
                        title="Subscriber Terbaru"
                        breadcrumbs={[
                            { label: "Datar Subscriber", link: "/dashboard/daftar-subscriber" },
                            { label: "Dashboard", link: null },
                        ]}
                    />
                </div>
                <div className="-mt-10 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 relative z-10">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4 mb-4">
                        <SearchInput placeholder="Cari Akun..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <DynamicFilter filters={filterConfig} onFilterChange={handleFilterChange} currentValues={filterState} />
                    </div>
                    <DynamicTable 
                        columns={columns} 
                        data={processedData.slice(0, 5)}
                        isLoading={false} 
                        emptyMessage="Tidak ada subscriber baru di bulan ini." 
                        hidePagination={true}
                    />
                </div>
            </div>
        </div>
    );
};

// =========================================
// 2. VALIDATOR DASHBOARD 
// =========================================
const ValidatorDashboard = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in font-noto-sans">
            <DashboardInfoCard 
                title="Total Paket Soal yang kamu buat" 
                icon={Icons.book} iconTheme="blue"
                value={stats?.totalPaketCreated || 0} badgeText="Bulan ini" badgeTheme="green"
                subText="Setiap paket soal Anda sangat bermakna"
            />
            <DashboardInfoCard 
                title="Jumlah soal butuh validasi" 
                icon={Icons.check} iconTheme="blue"
                value={stats?.pendingValidation || 0} badgeText="Sesuai Keahlian Anda" badgeTheme="yellow"
                subText="Segera lakukan validasi soal"
            />
            <DashboardInfoCard 
                title="Jumlah Soal Ditolak" 
                icon={Icons.alert} iconTheme="blue"
                value={stats?.totalRejected || 0} badgeText="Bulan ini" badgeTheme="red"
                subText="Berikan masukan kepada contributor"
            />
        </div>
    );
};

// =========================================
// 3. CONTRIBUTOR DASHBOARD
// =========================================
const ContributorDashboard = ({ stats, chartData }) => {
    // Pengaman: Jika data chart kosong, jangan biarkan React Crash (NaN error)
    const safeChartData = Array.isArray(chartData) && chartData.length > 0 
        ? chartData 
        : [{ label: "Belum Ada Soal", value: 0 }];

    return (
        <div className="space-y-8 animate-fade-in font-noto-sans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardInfoCard 
                    title="Total soal yang dia buat" 
                    icon={Icons.book} iconTheme="blue"
                    value={stats?.myTotalSoal || 0} badgeText="Bulan ini" badgeTheme="green"
                    subText="Setiap soal Anda sangat bermakna"
                />
                <DashboardInfoCard 
                    title="Jumlah soal tervalidasi" 
                    icon={Icons.check} iconTheme="blue"
                    value={stats?.myApprovedSoal || 0} badgeText={`${stats?.myPendingSoal || 0} soal belum tervalidasi`} badgeTheme="yellow"
                    subText="Pastikan soal dan jawaban sudah benar"
                />
                <DashboardInfoCard 
                    title="Total soal di pakai ke paket & event" 
                    icon={Icons.smile} iconTheme="blue"
                    value={stats?.myUsedSoal || 0} badgeText={`${stats?.myUsedSoal || 0} X Terpakai`} badgeTheme="green"
                    subText="Selamat! soal anda telah digunakan oleh admin dan validator!"
                />
            </div>
            <SimpleBarChart title="Jumlah soal / Subject" data={safeChartData} linkText="Tempat soal" linkUrl="/dashboard/tempat-soal" />
        </div>
    );
};

// =========================================
// PAGE UTAMA (Fetching API)
// =========================================
export default function IndexPage() {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;
            try {
                // Memanggil file dashboardService
                const response = await dashboardService.getStats();
                setDashboardData(response);
            } catch (error) {
                console.error("Gagal load dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, [user]);

    if (!user || isLoading) return (
        <div className="flex h-[80vh] items-center justify-center">
            <span className="text-primary font-bold animate-pulse font-noto-sans text-xl">Memuat Dashboard...</span>
        </div>
    );

    const role = user.role;

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto font-noto-sans relative">
            <PageHeader title="Dashboard" breadcrumbs={[ { label: "Dashboard", link: "/dashboard" } ]} />

            {['Admin', 'Validator', 'Contributor'].includes(role) && (
                <div className="text-sm text-neutral-500 mb-6 font-medium bg-white p-3 sm:p-4 rounded-lg border border-gray-200 inline-flex shadow-sm w-full sm:w-auto">
                    <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            strokeWidth={1.5} 
                            stroke="currentColor" 
                            className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 mt-0.5 sm:mt-0"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z" />
                        </svg> 
                        <span className="leading-snug sm:leading-normal">
                            Menampilkan statistik data dalam <span className="text-primary font-semibold whitespace-nowrap">1 bulan terakhir</span>
                        </span>
                    </div>
                </div>
            )}

            {role === 'Admin' && <AdminDashboard stats={dashboardData?.stats || {}} recentSubs={dashboardData?.recentSubs || []} />}
            {role === 'Validator' && <ValidatorDashboard stats={dashboardData?.stats || {}} />}
            {role === 'Contributor' && <ContributorDashboard stats={dashboardData?.stats || {}} chartData={dashboardData?.chartData || []} />}
            
            {!['Admin', 'Validator', 'Contributor'].includes(role) && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg font-bold border border-red-200">Role tidak dikenali.</div>
            )}
        </div>
    );
}