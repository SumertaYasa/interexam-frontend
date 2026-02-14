import React from 'react';

export default function EventCard({ event, onEdit, onDelete }) {
    // Helper warna badge
    const getJenisBadge = (jenis) => {
        return jenis === 'Gratis' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-primary text-white';
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'draft': return 'bg-gray-50 text-gray-600 border-gray-200';
            case 'inactive': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-gray-50 text-gray-600';
        }
    };

    return (
        <div className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-200 overflow-hidden flex flex-col h-full font-noto-sans">
            
            <div className="relative h-40 w-full overflow-hidden bg-gray-100">
                <img 
                    src={event.image || "https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image"} 
                    alt={event.nama_event} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/600x400/e2e8f0/1e293b?text=Error+Load+Image";
                    }}
                />
                
                <div className="absolute top-2 left-2 flex gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide shadow-sm ${getJenisBadge(event.jenis)}`}>
                        {event.jenis}
                    </span>
                </div>
                <div className="absolute top-2 right-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(event.status)}`}>
                        {event.status}
                    </span>
                </div>
            </div>

            {/* KONTEN CARD*/}
            <div className="p-4 flex flex-col flex-1">
                {/* Kategori */}
                <div className="text-[11px] font-bold text-primary mb-1 uppercase tracking-wider">
                    {event.kategori}
                </div>

                {/* Judul Event */}
                <h3 className="text-base font-bold text-gray-800 mb-3 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {event.nama_event}
                </h3>

                <div className="mt-auto flex items-center justify-between text-xs text-gray-500 border-t border-gray-100 pt-3">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="font-medium">{event.jumlah_paket} Paket</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.tanggal_mulai}</span>
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="mt-4 flex gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                        onClick={() => onEdit(event.id)}
                        className="flex-1 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-bold hover:bg-primary hover:text-white border border-gray-200 hover:border-primary transition-all"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => onDelete(event.id)}
                        className="px-3 rounded-lg bg-red-50 text-red-500 hover:bg-red-600 hover:text-white border border-red-100 transition-all flex items-center justify-center"
                        title="Hapus"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
}