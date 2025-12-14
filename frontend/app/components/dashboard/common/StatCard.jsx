export default function StatCard({ 
    title, 
    count, 
    icon, 
    iconWrapperClass, // Class untuk background icon 
    badgeContent,     // icon + teks
    badgeClass,       // Class warna badge
    subtext 
}) {
    return (
        <div className="bg-white rounded-2xl p-3 lg:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Icon & Judul */}
            <div className="flex items-start justify-between mb-3 lg:mb-3">
                <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center ${iconWrapperClass}`}>
                    {icon}
                </div>
                <h3 className="text-gray-800 font-noto-sans font-semibold text-base lg:text-base leading-snug ml-2 lg:ml-3 flex-1">
                    {title}
                </h3>
            </div>
            
            {/* Angka & Keterangan */}
            <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
                <span className="text-5xl lg:text-5xl font-bold text-gray-900 font-noto-sans">
                    {count}
                </span>
                <div className="flex flex-col pb-1">
                    <span className={`font-noto-sans mb-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium w-max ${badgeClass}`}>
                        {badgeContent}
                    </span>
                    <span className="text-[10px] text-gray-600 leading-tight font-noto-sans ">
                        {subtext}
                    </span>
                </div>
            </div>
        </div>
    );
}