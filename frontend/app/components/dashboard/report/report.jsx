import { useState, useMemo, useEffect } from "react";
import PageHeader from "../common/PageHeader";
import StatCard from "../common/StatCard";
import DynamicFilter from "../common/DynamicFilter";

import { 
    LineChartCard, 
    PieChartCard, 
    BarChartCard, 
    DonutChartCard 
} from "../common/ReportCharts";

import { reportService } from "../../../services/reportService";

const EmptyChartCard = ({ title }) => (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full min-h-[350px] flex flex-col font-noto-sans w-full">
        <h3 className="font-bold text-gray-800 text-base mb-6 shrink-0">{title}</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            {/* Icon Kotak Kosong */}
            <svg className="w-16 h-16 mb-4 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span className="text-sm font-medium">Data tidak ada saat ini</span>
        </div>
    </div>
);

const Icons = {
    subscriber: <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 15.8369C19.4559 16.5683 20.7041 17.742 21.6152 19.2096C21.7956 19.5003 21.8858 19.6456 21.917 19.8468C21.9804 20.2558 21.7008 20.7585 21.3199 20.9204C21.1325 21 20.9216 21 20.5 21M16 11.5322C17.4817 10.7959 18.5 9.26686 18.5 7.5C18.5 5.73314 17.4817 4.20411 16 3.46776M14 7.5C14 9.98528 11.9852 12 9.49996 12C7.01468 12 4.99996 9.98528 4.99996 7.5C4.99996 5.01472 7.01468 3 9.49996 3C11.9852 3 14 5.01472 14 7.5ZM2.55919 18.9383C4.1535 16.5446 6.66933 15 9.49996 15C12.3306 15 14.8464 16.5446 16.4407 18.9383C16.79 19.4628 16.9646 19.725 16.9445 20.0599C16.9289 20.3207 16.7579 20.64 16.5495 20.7976C16.2819 21 15.9138 21 15.1776 21H3.82232C3.08613 21 2.71804 21 2.4504 20.7976C2.24201 20.64 2.07105 20.3207 2.05539 20.0599C2.03529 19.725 2.20992 19.4628 2.55919 18.9383Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>,
    paket: <svg className="w-7 h-7 transition duration-75 min-w-[24px] flex-shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.1429 11v9m0-9c-2.50543-.7107-3.19099-1.39543-6.13657-1.34968-.48057.00746-.86348.38718-.86348.84968v7.2884c0 .4824.41455.8682.91584.8617 2.77491-.0362 3.45995.6561 6.08421 1.3499m0-9c2.5053-.7107 3.1067-1.39542 6.0523-1.34968.4806.00746.9477.38718.9477.84968v7.2884c0 .4824-.4988.8682-1 .8617-2.775-.0362-3.3758.6561-6 1.3499m2-14c0 1.10457-.8955 2-2 2-1.1046 0-2-.89543-2-2s.8954-2 2-2c1.1045 0 2 .89543 2 2Z"/>
            </svg>,
    money: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 icon icon-tabler icons-tabler-outline icon-tabler-cash" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 15h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v3" />
                <path d="M7 10a1 1 0 0 1 1 -1h12a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-12a1 1 0 0 1 -1 -1l0 -8" /><path d="M12 14a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
            </svg>,
    event: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 transition duration-75 min-w-[24px] flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
            </svg>
};

const formatJutaCard = (num) => {
    if (num >= 1000000) return `Rp ${(num / 1000000).toFixed(1).replace('.0', '')}jt`;
    if (num >= 1000) return `Rp ${(num / 1000).toFixed(1).replace('.0', '')}rb`;
    return `Rp ${num}`;
};

export default function LaporanPage() {
    const [filterState, setFilterState] = useState({ period: "year" });
    const [isLoading, setIsLoading] = useState(true);
    
    // State untuk Data Keseluruhan (Atas)
    const [summaryData, setSummaryData] = useState({
        totalSub: 0,
        totalPaket: 0,
        totalIncome: 0,
        totalEvent: 0
    });

    // State untuk Data Chart (Bawah)
    const [chartData, setChartData] = useState({
        lineData: { current: [0], previous: [0], labels: ['-'] },
        legendText: ['Tahun Ini', 'Tahun Lalu'],
        pieData: [],
        barData: [],
        donutPercent: 0
    });

    // 2. CONFIG FILTER
    const filterConfig = [
        {
            key: "period",
            label: "Periode Laporan",
            type: "radio", 
            options: [
                { label: "1 Minggu", value: "week" },
                { label: "1 Bulan", value: "month" },
                { label: "1 Tahun", value: "year" },
            ]
        }
    ];

    const getLegendLabels = (period) => {
        if (period === 'week') return ['Minggu Ini', 'Minggu Lalu'];
        if (period === 'month') return ['Bulan Ini', 'Bulan Lalu'];
        return ['Tahun Ini', 'Tahun Lalu'];
    };

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const response = await reportService.getStats(filterState.period);
                
                // Set data summary (atas) dengan fallback 0 agar toLocaleString tidak error
                setSummaryData({
                    totalSub: response?.summary?.totalSub || 0,
                    totalPaket: response?.summary?.totalPaket || 0,
                    totalIncome: response?.summary?.totalIncome || 0,
                    totalEvent: response?.summary?.totalEvent || 0
                });
                
                // Jika backend lupa mengirim 'previous', kita ganti dengan '[0]' secara otomatis
                setChartData({
                    lineData: {
                        current: response?.filteredData?.lineData?.current || [0],
                        previous: response?.filteredData?.lineData?.last || [0],
                        labels: response?.filteredData?.lineData?.labels || ['-']
                    },
                    legendText: getLegendLabels(filterState.period),
                    pieData: response?.filteredData?.pieData || [],
                    barData: response?.filteredData?.barData || [],
                    donutPercent: response?.filteredData?.donutPercent || 0
                });

            } catch (error) {
                console.error("Gagal mengambil data laporan", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [filterState.period]);

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto min-h-screen bg-gray-50 font-noto-sans">

            {isLoading && (
                <div className="absolute inset-0 bg-white/50 z-50 flex items-center justify-center rounded-xl">
                     <span className="text-primary font-bold animate-pulse">Memuat Data...</span>
                </div>
            )}
            
            {/* Header */}
            <PageHeader title="Laporan" breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }, { label: "Laporan", link: null }]} />

            {/* Top Cards (Data All Time - Static) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                <StatCard 
                    title="Total Subscriber" 
                    count={<span className="text-3xl sm:text-3xl font-bold leading-none block -mt-0">{summaryData.totalSub}</span>} 
                    iconWrapperClass="bg-primary/10 text-primary" 
                    icon={Icons.subscriber} 
                />
                
                <StatCard 
                    title="Total Paket Soal" 
                    count={<span className="text-3xl sm:text-3xl font-bold leading-none block -mt-0">{summaryData.totalPaket}</span>} 
                    iconWrapperClass="bg-primary/10 text-primary" 
                    icon={Icons.paket} 
                />
                
                <StatCard 
                    title="Total Pendapatan" 
                    count={<span className="text-2xl sm:text-3xl font-bold leading-none block -mt-0 truncate" title={`Rp ${summaryData.totalIncome.toLocaleString('id-ID')}`}>{formatJutaCard(summaryData.totalIncome)}</span>} 
                    iconWrapperClass="bg-primary/10 text-primary" 
                    icon={Icons.money} 
                />
                
                <StatCard 
                    title="Total Event" 
                    count={<span className="text-3xl sm:text-3xl font-bold leading-none block -mt-0">{summaryData.totalEvent}</span>} 
                    iconWrapperClass="bg-primary/10 text-primary" 
                    icon={Icons.event} 
                />

            </div>

            {/* Filter Section */}
            <div className="flex justify-start mb-6 relative z-20">
                <div className="rounded-xl filter-left-align">
                    <DynamicFilter 
                        filters={filterConfig} 
                        currentValues={filterState} 
                        onFilterChange={(key, val) => setFilterState({ ...filterState, [key]: val })} 
                    />
                </div>
                <style>{`
                    .filter-left-align .absolute {
                        right: auto !important;
                        left: 0 !important;
                        transform-origin: top left !important;
                    }
                `}</style>
            </div>

            {/* Charts Grid */}
            {/* <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-[350px]">
                        <LineChartCard 
                            title="Pendapatan" 
                            period={filterState.period === 'week' ? 'Mingguan' : filterState.period === 'month' ? 'Bulanan' : 'Tahunan'}
                            legendLabels={chartData.legendText}
                            data={chartData.lineData} 
                            labels={chartData.lineData.labels}
                        />
                    </div>
                    <div className="lg:col-span-1 min-h-[350px]">
                        <PieChartCard title="Subscriber Aktif" data={chartData.pieData} />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-[350px]">
                        <BarChartCard title="Jumlah soal per Mata Pelajaran" data={chartData.barData} />
                    </div>
                    <div className="lg:col-span-1 min-h-[350px]">
                        <DonutChartCard title="Status Soal" percentage={chartData.donutPercent} subtext="Tervalidasi" />
                    </div>
                </div>
            </div> */}



            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-[350px]">
                        {chartData.lineData?.current?.some(val => val > 0) ? (
                            <LineChartCard 
                                title="Pendapatan" 
                                period={filterState.period === 'week' ? 'Mingguan' : filterState.period === 'month' ? 'Bulanan' : 'Tahunan'}
                                legendLabels={chartData.legendText}
                                data={chartData.lineData} 
                                labels={chartData.lineData.labels}
                            />
                        ) : (
                            <EmptyChartCard title="Pendapatan" />
                        )}
                    </div>
                    <div className="lg:col-span-1 min-h-[350px]">
                        {chartData.pieData?.length > 0 ? (
                            <PieChartCard title="Subscriber Aktif" data={chartData.pieData} />
                        ) : (
                            <EmptyChartCard title="Subscriber Aktif" />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 min-h-[350px]">
                        {chartData.barData?.length > 0 ? (
                            <BarChartCard title="Jumlah soal per Mata Pelajaran" data={chartData.barData} />
                        ) : (
                            <EmptyChartCard title="Jumlah soal per Mata Pelajaran" />
                        )}
                    </div>
                    <div className="lg:col-span-1 min-h-[350px]">
                        {chartData.barData?.length > 0 ? (
                            <DonutChartCard title="Status Soal" percentage={chartData.donutPercent} subtext="Tervalidasi" />
                        ) : (
                            <EmptyChartCard title="Status Soal" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}