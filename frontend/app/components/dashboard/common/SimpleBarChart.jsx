import React from 'react';

export default function SimpleBarChart({ data, title, linkText, linkUrl }) {
    const rawMax = Math.max(...data.map(d => d.value));
    const maxValue = Math.ceil(rawMax / 5) * 5 || 10; 

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mt-6 w-full">
            {/* Header Chart */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                <h3 className="text-xl font-bold text-gray-900 font-noto-sans">{title}</h3>
                {linkUrl && (
                    <a href={linkUrl} className="text-sm text-gray-500 hover:text-primary flex items-center gap-1 font-medium transition-colors">
                        {linkText} 
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 18l6-6-6-6"/>
                        </svg>
                    </a>
                )}
            </div>
            
            <div className="flex font-noto-sans">
                <div className="flex flex-col justify-between h-64 text-xs text-gray-400 pr-3 border-r border-gray-100 flex-shrink-0 select-none py-2">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className="transform -translate-y-1/2 block text-right w-6 h-4">
                            {Math.round(maxValue - (maxValue / 5) * i)}
                        </span>
                    ))}
                </div>

                <div className="flex-1 overflow-x-auto pb-2 custom-scrollbar">
                    <div className="relative h-64 min-w-[600px] lg:min-w-full pl-4 pr-2">
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pl-4 pr-2 py-2">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="border-b border-gray-100 w-full h-0"></div>
                            ))}
                        </div>
                        <div className="flex items-end justify-around h-full gap-4 pt-2 pb-0 z-10 relative">
                            {data.map((item, index) => (
                                <div key={index} className="flex flex-col items-center justify-end flex-1 h-full group">
                                    
                                    <div className="w-full relative flex items-end justify-center h-full">
                                        <div 
                                            className="w-full max-w-[40px] bg-[#1e73be] rounded-t-sm hover:opacity-80 transition-all duration-300 relative cursor-pointer"
                                            style={{ height: `${(item.value / maxValue) * 100}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-20 shadow-lg pointer-events-none">
                                                {item.value} Soal
                                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 border-t border-transparent w-full">
                                        <p className="text-xs text-gray-600 text-center font-medium truncate w-full px-1" title={item.label}>
                                            {item.label}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}