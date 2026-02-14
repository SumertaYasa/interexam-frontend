import React, { forwardRef } from "react";

export const formatSoalDisplay = (text) => {
    const cleanText = text ? String(text).replace(/<[^>]+>/g, '') : '-';
    const limit = 10; 
    const displayText = cleanText.length > limit ? cleanText.substring(0, limit) + "..." : cleanText;
    return <div title={cleanText} className="min-w-[100px]">{displayText}</div>;
};

export const getLevelBadge = (level) => {
    const l = level?.toLowerCase() || "";
    let color = "bg-gray-100 text-gray-800 border-gray-200 rounded-lg";
    if (l === 'mudah') color = "bg-green-100 text-green-800 border-green-200 rounded-lg";
    if (l === 'sedang') color = "bg-yellow-100 text-yellow-800 border-yellow-200 rounded-lg";
    if (l === 'sulit') color = "bg-red-100 text-red-800 border-red-200 rounded-lg";
    return <span className={`px-2.5 py-0.5 rounded text-xs font-medium ${color}`}>{level}</span>;
};

const DraggableTable = forwardRef(({ data, columns, onDragStart, onDragEnter, onDragEnd, onDrop, onDelete, onRowClick, emptyMessage }, ref) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 font-noto-sans min-w-[800px] lg:min-w-0">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                    <tr>
                        {columns ? (
                            columns.map((col, idx) => (
                                <th key={idx} className={`px-6 py-3 ${col.className || ''}`}>{col.header}</th>
                            ))
                        ) : (
                            <>
                                <th className="px-6 py-3">NO</th>
                                <th className="px-6 py-3">SOAL</th>
                                <th className="px-6 py-3">MATA PELAJARAN</th>
                                <th className="px-6 py-3">JENJANG</th>
                                <th className="px-6 py-3">TIPE SOAL</th>
                                <th className="px-6 py-3">LEVEL</th>
                                <th className="px-6 py-3 text-center">AKSI</th>
                            </>
                        )}
                    </tr>
                </thead>
                <tbody ref={ref} className="divide-y divide-gray-100 bg-white">
                    {data.length === 0 ? (
                        <tr><td colSpan={columns ? columns.length : 7} className="px-6 py-8 text-center">{emptyMessage || "Belum ada data."}</td></tr>
                    ) : (
                        data.map((item, index) => (
                            <tr 
                                key={item.id}
                                draggable
                                onDragStart={(e) => onDragStart && onDragStart(e, index)}
                                onDragEnter={(e) => onDragEnter && onDragEnter(e, index)}
                                onDragEnd={onDragEnd}
                                onDrop={onDrop}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => onRowClick && onRowClick(item)}
                                className="hover:bg-gray-50 cursor-move transition-all duration-200 bg-white"
                            >
                                {columns ? (
                                    columns.map((col, cIdx) => (
                                        <td key={cIdx} className="px-6 py-4">
                                            {col.render ? col.render(item, index) : item[col.accessor]}
                                        </td>
                                    ))
                                ) : (
                                    <>
                                        <td className="px-6 py-4 font-medium text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {formatSoalDisplay(item.nama_soal)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{item.mata_pelajaran}</td>
                                        <td className="px-6 py-4">{item.jenjang || "-"}</td>
                                        <td className="px-6 py-4">{item.tipe_soal}</td>
                                        <td className="px-6 py-4">{getLevelBadge(item.level)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <button type="button" 
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    onDelete(item.id); 
                                                }} 
                                                className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition shadow-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                            </button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
});

export default DraggableTable;