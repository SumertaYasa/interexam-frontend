import { Link } from "react-router";
import { useState, useEffect } from "react";

export default function SoalTable() {

    const dataSoal = [
    {
      id: 1,
      mataPelajaran: "Matematika",
      tipeSoal: "Pilihan ganda",
      levelKesulitan: "Sulit",
      status: "Disetujui",
    },
    {
      id: 2,
      mataPelajaran: "Bahasa Indonesia",
      tipeSoal: "Pilihan ganda",
      levelKesulitan: "Sedang",
      status: "Draft",
    },
    {
      id: 3,
      mataPelajaran: "Matematika",
      tipeSoal: "Multi jawban",
      levelKesulitan: "Mudah",
      status: "Need Verification",
    },
    {
      id: 4,
      mataPelajaran: "Matematika",
      tipeSoal: "Pilihan ganda",
      levelKesulitan: "Sulit",
      status: "Ditolak",
    },
    {
      id: 5,
      mataPelajaran: "Matematika",
      tipeSoal: "Multi jawban",
      levelKesulitan: "Sedang",
      status: "Need Verification",
    },
    {
      id: 6,
      mataPelajaran: "Bahasa Indonesia",
      tipeSoal: "Pilihan ganda",
      levelKesulitan: "Mudah",
      status: "Ditolak",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-600";
      case "Draft":
        return "bg-gray-200 text-gray-600";
      case "Need Verification":
        return "bg-orange-100 text-orange-600";
      case "Ditolak":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
            
            {/* Head Navigasi */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Data Soal</h1>
                    </div>

                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/></svg>
                                    <Link to="" className="inline-flex items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                                        Data Soal
                                    </Link>
                                </li>
                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                            strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>


            {/* Card laporan soal */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                <div className="bg-white rounded-2xl p-3 lg:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 lg:mb-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-blue-100 flex items-center justify-center text-primary">
                            <svg className="w-6 h-6  min-w-[24px] " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 20H5.2C4.07989 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V7.2C2 6.07989 2 5.51984 2.21799 5.09202C2.40973 4.71569 2.71569 4.40973 3.09202 4.21799C3.51984 4 4.07989 4 5.2 4H5.6C7.84021 4 8.96031 4 9.81596 4.43597C10.5686 4.81947 11.1805 5.43139 11.564 6.18404C12 7.03968 12 8.15979 12 10.4M12 20V10.4M12 20H18.8C19.9201 20 20.4802 20 20.908 19.782C21.2843 19.5903 21.5903 19.2843 21.782 18.908C22 18.4802 22 17.9201 22 16.8V7.2C22 6.07989 22 5.51984 21.782 5.09202C21.5903 4.71569 21.2843 4.40973 20.908 4.21799C20.4802 4 19.9201 4 18.8 4H18.4C16.1598 4 15.0397 4 14.184 4.43597C13.4314 4.81947 12.8195 5.43139 12.436 6.18404C12 7.03968 12 8.15979 12 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-gray-800 font-noto-sans font-semibold text-base lg:text-base leading-snug ml-2 lg:ml-3 flex-1">
                            Total soal yang di buat
                        </h3>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
                        <span className="text-5xl lg:text-5xl font-bold text-gray-900 font-noto-sans">30</span>
                        <div className="flex flex-col pb-1">
                            <span className="font-noto-sans inline-flex items-center px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium bg-green-100 text-green-700 mb-1 w-max">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
                                +15 Soal bulan ini
                            </span>
                            <span className="text-[10px] text-gray-600 leading-tight font-noto-sans">setiap soal bermakna</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-3 lg:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 lg:mb-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600">
                            <svg  className="w-6 h-6  min-w-[24px] " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-gray-800 font-semibold text-base lg:text-base leading-snug ml-2 lg:ml-3 flex-1 font-noto-sans">
                            Total soal tervalidasi
                        </h3>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
                        <span className="text-5xl lg:text-5xl font-bold text-gray-900 font-noto-sans">25</span>
                        <div className="flex flex-col pb-1">
                            <span className="font-noto-sans inline-flex items-center px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium bg-warning/10 text-warning mb-1 w-max">
                                5 belum tervalidasi
                            </span>
                            <span className="text-[10px] text-gray-600 leading-tight font-noto-sans">Pastikan soal dan jawaban benar</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-3 lg:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 lg:mb-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                            <svg className="w-6 h-6  min-w-[24px] " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13 3.5V6.2C13 7.88016 13 8.72024 13.327 9.36197C13.6146 9.92646 14.0735 10.3854 14.638 10.673C15.2798 11 16.1198 11 17.8 11H20.5M21 12.9882V16.2C21 17.8802 21 18.7202 20.673 19.362C20.3854 19.9265 19.9265 20.3854 19.362 20.673C18.7202 21 17.8802 21 16.2 21H7.8C6.11984 21 5.27976 21 4.63803 20.673C4.07354 20.3854 3.6146 19.9265 3.32698 19.362C3 18.7202 3 17.8802 3 16.2V7.8C3 6.11984 3 5.27976 3.32698 4.63803C3.6146 4.07354 4.07354 3.6146 4.63803 3.32698C5.27976 3 6.11984 3 7.8 3H11.0118C11.7455 3 12.1124 3 12.4577 3.08289C12.7638 3.15638 13.0564 3.27759 13.3249 3.44208C13.6276 3.6276 13.887 3.88703 14.4059 4.40589L19.5941 9.59411C20.113 10.113 20.3724 10.3724 20.5579 10.6751C20.7224 10.9436 20.8436 11.2362 20.9171 11.5423C21 11.8876 21 12.2545 21 12.9882Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-gray-800 font-semibold text-base lg:text-base leading-snug ml-2 lg:ml-3 flex-1 font-noto-sans">
                            Total soal draft
                        </h3>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
                        <span className="text-5xl lg:text-5xl font-bold text-gray-900 font-noto-sans">4</span>
                        <div className="flex flex-col pb-1">
                            <span className="font-noto-sans inline-flex items-center px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium bg-gray-300 text-gray-700 mb-1 w-max">
                                4 soal status draft
                            </span>
                            <span className="text-[10px] text-gray-600 leading-tight font-noto-sans">Ayo ajukan soal ke validator!</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl p-3 lg:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 lg:mb-4">
                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                            <svg className="w-6 h-6  min-w-[24px] " viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h3 className="text-gray-800 font-semibold text-base lg:text-base leading-snug ml-2 lg:ml-3 flex-1 font-noto-sans">
                            Total soal ditolak
                        </h3>
                    </div>
                    
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4 lg:gap-3">
                        <span className="text-5xl lg:text-5xl font-bold text-gray-900 font-noto-sans">1</span>
                        <div className="flex flex-col pb-1">
                            <span className="font-noto-sans inline-flex items-center px-2 py-0.5 rounded text-[10px] lg:text-xs font-medium bg-red-200 text-red-700 mb-1 w-max">
                                1 soal ditolak
                            </span>
                            <span className="text-[10px] text-gray-600 leading-tight font-noto-sans">Segera perbaiki soal!</span>
                        </div>
                    </div>
                </div>
            </div>


            {/* Kontainer Tabel Soal */}
            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl mt-10">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex  flex-row items-center gap-4">
                        <form method="GET" action="#" className="relative w-full sm:w-auto">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center ">
                            <svg className="h-5 w-5 text-gray-400 " viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" 
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clipRule="evenodd" />
                            </svg>
                            </span>
                            <input className="font-noto-sans block w-full sm:w-64 md:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-3xl h-10 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pr-900 focus:border-pr-900 sm:text-sm"
                            type="search" name="q"  placeholder="Cari soal..." />
                        </form>
                            <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <button className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-primary text-sm font-medium rounded-2xl h-10 shadow-sm text-primary">
                            Duplikat
                        </button>

                        <Link to="add" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-2xl h-10 shadow-sm text-white bg-primary ">
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                            aria-hidden="true">
                            <path fillRule="evenodd"
                                d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                                clipRule="evenodd" />
                        </svg>
                        Add Soal
                        </Link>
                    </div>
                </div>


                {/* Tabel Soal */}
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                            {["NO", "MATA PELAJARAN", "TIPE SOAL", "LEVEL KESULITAN", "STATUS", "AKSI"].map((head) => (
                                <th key={head} scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-900 font-noto-sans uppercase tracking-wider">
                                {head}
                                </th>
                            ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {dataSoal.map((item, index) => (
                            <tr key={item.id} className="hover:bg-gray-50 transition-colors">

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                {index + 1}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                {item.mataPelajaran}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                {item.tipeSoal}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900">
                                {item.levelKesulitan}
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-md ${getStatusStyle(item.status)}`}>
                                    {item.status}
                                </span>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex gap-2 items-center">
                                                
                                        {/* TOMBOL EDIT*/}
                                         <Link 
                                            to={`edit/:id`} 
                                            className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors">
                                            <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                 <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                                             </svg>
                                        </Link>

                                        {/* TOMBOL DELETE*/}
                                        <button 
                                            type="button" 
                                            className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors">
                                            <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                                            </svg>
                                                </button>

                                        {/* Tombol Cheklist*/}
                                        <input
                                            id="default-checkbox"
                                            type="checkbox"
                                            value=""
                                            className="
                                                w-8 h-8 
                                                rounded-xl 
                                                border-1 border-primary 
                                                bg-white 
                                                text-primary 
                                                cursor-pointer"/>

                                     </div>
                                </td>

                            </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
            </div>
                         


        </div>
    );
}