import React from 'react';

const formatJuta = (num) => (num / 1000000).toFixed(1) + "jt";

// ============================================
// 1. LINE CHART
// ============================================
export const LineChartCard = ({ title, data, labels, period, legendLabels = ['Tahun ini', 'Tahun Lalu'] }) => {
    
    // Cari nilai max untuk skala Y
    const maxValue = Math.max(...data.current, ...data.previous) * 1.1; 
    
    const getPoints = (dataset) => {
        return dataset.map((val, i) => {
            const x = (i / (dataset.length - 1)) * 100;
            const y = 100 - (val / maxValue) * 100;
            return `${x},${y}`;
        }).join(" ");
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col font-noto-sans relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 text-base">{title}</h3>
                    <p className="text-xs text-gray-400">Periode: {period}</p>
                </div>
                {/* LEGEND DINAMIS */}
                <div className="flex gap-4 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-primary rounded-full"></span> 
                        {legendLabels[0]}
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 bg-primary/40 rounded-full"></span> 
                        {legendLabels[1]}
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="relative flex-1 min-h-[250px] w-full">
                <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-400 pointer-events-none pb-6 pr-4">
                    {[100, 75, 50, 25, 0].map((pct) => (
                        <div key={pct} className="border-b border-gray-100 w-full h-0 flex items-center relative">
                            <span className="absolute -left-0 -top-2 bg-white pr-1">
                                {formatJuta(maxValue * (pct/100))}
                            </span>
                        </div>
                    ))}
                </div>

                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible pb-6 pl-8" preserveAspectRatio="none">
                    <polyline 
                        points={getPoints(data.previous)} 
                        fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" 
                    />
                    <polyline 
                        points={getPoints(data.current)} 
                        fill="none" stroke="#1e73be" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" 
                    />
                </svg>

                <div className="absolute bottom-0 left-8 right-0 flex justify-between text-[10px] text-gray-500">
                    {labels.map((l, i) => <span key={i}>{l}</span>)}
                </div>
            </div>
        </div>
    );
};

// ============================================
// 2. PIE CHART 
export const PieChartCard = ({ title, data }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let currentAngle = 0;
    
    const gradient = data.map(item => {
        const percentage = (item.value / total) * 100;
        const endAngle = currentAngle + percentage;
        const str = `${item.color} ${currentAngle}% ${endAngle}%`;
        currentAngle = endAngle;
        return str;
    }).join(", ");

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col font-noto-sans">
            <h3 className="font-bold text-gray-800 text-base mb-6">{title}</h3>
            
            <div className="flex-1 flex flex-col items-center justify-center">
                <div 
                    className="w-48 h-48 rounded-full shadow-inner relative"
                    style={{ background: `conic-gradient(${gradient})` }}
                ></div>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    {data.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }}></span>
                            <span className="text-xs text-gray-600 font-medium">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 3. BAR CHART 
export const BarChartCard = ({ title, data }) => {
    // Pengaman: Jika data kosong, atur maxValue ke 1 agar tidak NaN/Error
    const maxValue = data?.length > 0 ? Math.max(...data.map(d => d.value)) * 1.2 : 1;

    return (
        // 1. Tambahkan w-full dan overflow-hidden di sini agar card tidak bocor ke luar
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col font-noto-sans w-full overflow-hidden">
            <h3 className="font-bold text-gray-800 text-base mb-6 shrink-0">{title}</h3>
            
            <div className="relative flex-1 min-h-[300px] flex w-full">
                
                {/* Y-Axis Label (Fixed di Kiri) */}
                <div className="absolute left-0 top-0 bottom-[38px] w-8 flex flex-col justify-between text-[10px] text-gray-400 bg-white z-10">
                    <span>{Math.round(maxValue)}</span>
                    <span>{Math.round(maxValue/2)}</span>
                    <span>0</span>
                </div>

                {/* 2. Chart Area (Tambahkan overflow-x-auto di sini agar bisa di-scroll ke samping) */}
                <div className="flex-1 flex items-end gap-2 sm:gap-4 pl-10 pr-4 overflow-x-auto pb-2 w-full custom-scrollbar">
                    {data.map((item, index) => (
                        // 3. Tambahkan min-w-[70px] agar tiap batang punya ruang napas minimal dan tidak gepeng
                        <div key={index} className="flex flex-col items-center justify-end h-full group min-w-[70px] relative">
                            
                            {/* Tooltip (Dipindah ke luar elemen track agar tidak terpotong overflow-hidden) */}
                            <div className="absolute top-0 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                {item.value} Soal
                            </div>

                            {/* Bar Track */}
                            <div className="w-4 sm:w-6 mt-8 flex-1 bg-blue-50 rounded-full relative overflow-hidden">
                                <div 
                                    className="absolute bottom-0 w-full bg-primary rounded-t-full transition-all duration-1000 ease-out"
                                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                                >
                                </div>
                            </div>
                            
                            {/* Label X-Axis */}
                            <span 
                                className="mt-3 h-6 text-[10px] sm:text-xs text-gray-600 text-center truncate w-full px-1 cursor-default" 
                                title={item.label}
                            >
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
};

// 4. DONUT CHART 
export const DonutChartCard = ({ title, percentage, subtext }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm h-full flex flex-col font-noto-sans">
            <h3 className="font-bold text-gray-800 text-base mb-6">{title}</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <svg width="100%" height="100%" className="transform -rotate-90">
                        <circle cx="50%" cy="50%" r={radius} stroke="#f3f4f6" strokeWidth="18" fill="transparent" />
                        <circle 
                            cx="50%" cy="50%" r={radius} 
                            stroke="#1e73be" 
                            strokeWidth="18" 
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-gray-900">{percentage}%</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wide">{subtext}</span>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-primary rounded-sm"></span> <span className="text-xs">Tervalidasi</span></div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 bg-gray-200 rounded-sm"></span> <span className="text-xs">Pending/Ditolak</span></div>
                </div>
            </div>
        </div>
    );
};