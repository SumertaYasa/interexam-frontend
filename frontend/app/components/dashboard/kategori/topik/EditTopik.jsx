import { Link } from "react-router";
import { useState } from "react";

export default function EditTopik() {

    const [formData, setFormData] = useState({
        matapelajaran: "",
        topik: "",
        jenjang: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    const [isMapelOpen, setIsMapelOpen] = useState(false);
    const mataPelajaranList = ["Matematika", "Bahasa Indonesia", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi"];

    const handleSelectMapel = (subject) => {
        setFormData({ ...formData, mataPelajaran: subject });
        setIsMapelOpen(false); 
    };

    const [isJenjangOpen, setIsJenjangOpen] = useState(false);
    const jenjangList = ["SD", "SMP", "SMA", "SMK", "Kuliah", "Umum"];

    const handleSelectJenjang = (value) => {
        setFormData({ ...formData, jenjang: value });
        setIsJenjangOpen(false);
    };


    return(
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            {/* Navigasi Head */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                    <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Edit Topik</h1>
                    </div>

                    <div className="mb-4 sm:mb-0">
                    <nav className="flex" aria-label="Breadcrumb">
                        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                        <li className="inline-flex items-center">
                            <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                        </li>
                        <li className="inline-flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                            <Link to="../topik" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                            Data Topik
                            </Link>
                        </li>

                        <li aria-current="page">
                            <div className="flex items-center">
                            <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" d="m1 9 4-4-4-4" />
                            </svg>
                            <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Edit Topik</span>
                            </div>
                        </li>

                        </ol>
                    </nav>
                    </div>

                </div>
            </div>

            {/* form add topik */}
            <div className="bg-white shadow-lg flex-1 h-auto rounded-2xl w-full max-w-[600px]">
                <div className="p-6">

                    {/* mata pelajaran atau subjek */}
                    <div className="relative ">
                        <label for="id_matapelajaran"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans  ">Mata Pelajaran<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                type="button"
                               onClick={() => setIsMapelOpen(!isMapelOpen)}
                                className="relative z-20 truncate w-full font-noto-sans inline-flex  text-gray-900  bg-brand  focus:ring-1 ring-1 ring-gray-300  shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                {formData.mataPelajaran || "Pilih Mata Pelajaran"}
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isMapelOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isMapelOpen && (
                                <div className="absolute z-20 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                    <ul className="p-2 text-sm text-body font-medium">
                                        {mataPelajaranList.map((subject) => (
                                            <li key={subject}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectMapel(subject)}
                                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left">
                                                    <span className="text-gray-900">{subject}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        <p className="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* form nama */}
                    <div className="mt-4">
                        <label for="id_topik"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Topik<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_topik" name="topik"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan nama topik" required />
                        <p className="text-red-500 text-xs mt-1"></p>
                    </div>


                    {/* Jenjang */}
                    <div className="relative mt-4 ">
                        <label for="id_jenjang"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans  ">Jenjang<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                type="button"
                               onClick={() => setIsJenjangOpen(!isJenjangOpen)}
                                className="relative z-10 truncate w-full font-noto-sans inline-flex  text-gray-900  bg-brand  focus:ring-1 ring-1 ring-gray-300  shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                {formData.jenjang || "Pilih Jenjang"}
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isJenjangOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isJenjangOpen && (
                                <div className="absolute z-10 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                    <ul className="p-2 text-sm text-body font-medium">
                                        {jenjangList.map((item) => (
                                            <li key={item}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectJenjang(item)}
                                                    className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left">
                                                    <span className="text-gray-900">{item}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        <p className="text-red-500 text-xs mt-1"></p>
                    </div>

                    

                </div>
            </div>

            {/* button */}
            <div className="mt-4 flex gap-4">
            
                {/* Tombol Simpan (Biru) */}
                <button type="submit" 
                    class="text-white bg-primary bg-brand box-border border border-transparent  shadow-xs font-medium leading-5 rounded-2xl text-sm px-6 py-2.5 focus:outline-none">
                        Simpan
                </button>
                
                {/* Tombol Batal (Putih dengan Border Biru) */}
                <Link 
                    to="/dashboard/topik"
                    className="text-primary bg-white bg-brand box-border border-primary border-1   shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none">
                    Batal
                </Link>

            </div>
            
        </div>
    );
}