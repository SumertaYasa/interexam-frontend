import { Link } from "react-router";
import { useState } from "react"; 

export default function AddPaketTable() {

    // --- State dan Logic dari Form Paket Soal (Disesuaikan) ---
    
    const [formData, setFormData] = useState({
        // Diubah dari 'matapelajaran' menjadi 'hargaAsli' untuk input teks
        hargaAsli: "", 
        topik: "", 
        jenjang: "", 
    });

    // State untuk dropdown Masa Aktif
    const [isJenjangOpen, setIsJenjangOpen] = useState(false);
    const jenjangList = ["1 Bulan"]; 

    // State untuk tombol Segmented Switch (Status Aktif/Non Aktif)
    const [finalStatus, setFinalStatus] = useState('Aktif');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleSelectJenjang = (value) => {
        setFormData({ ...formData, jenjang: value });
        setIsJenjangOpen(false);
    };
    
 
    const handleSegmentedToggle = (newStatus) => {
        setFinalStatus(newStatus);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalData = {
            nama_paket: formData.topik,
            harga_asli: formData.hargaAsli, 
            masa_aktif: formData.jenjang,
            status: finalStatus
        };
        console.log("Form submitted with:", finalData);
        alert("Form Data: " + JSON.stringify(finalData));
    }
    

    const isAktif = finalStatus === 'Aktif';

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
        
            {/* Menu Head */}
            <div className="pb-6">
                <div className="sm:flex sm:justify-between sm:items-center mb-6">
                    <div className="mb-4 sm:mb-0">
                        <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Add Paket</h1>
                    </div>

                    <div className="mb-4 sm:mb-0">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                                <li className="inline-flex items-center">
                                    <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                                </li>
                                <li className="inline-flex items-center">
                                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" /></svg>
                                    <Link to="../paket-langganan" className="inline-flex items-center text-sm font-noto-sans font-medium text-dark-primary text-gray-500 hover:text-primary-hover">
                                        Data Paket
                                    </Link>
                                </li>

                                <li aria-current="page">
                                    <div className="flex items-center">
                                        <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                strokeWidth="2" d="m1 9 4-4-4-4" />
                                        </svg>
                                        <span className="ms-1 text-sm font-medium text-gray-900 font-noto-sans md:ms-2">Add Paket</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>

                {/* Form Component */}
                <form onSubmit={handleSubmit} className="w-full h-auto">
                    
                    {/* --- Form Detail Paket Soal --- */}
                    <div className=" mt-11  bg-white rounded-2xl shadow-xl lg:w-[500px]">
                        <div className="p-6 ">
                            
                            {/* Nama Paket Soal Input */}
                            <div className="">
                                <label htmlFor="id_topik"
                                    className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Nama Paket <span
                                    className="text-red-500">*</span></label>
                                <input type="text" id="id_topik" name="topik"
                                    value={formData.topik}
                                    onChange={handleChange}
                                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl   block w-full p-3.5"
                                    placeholder="Masukan nama paket" required />
                                <p className="text-red-500 text-xs mt-1 font-noto-sans"></p>
                            </div>

                            {/* HARGA ASLI INPUT TEKS (Pengganti Dropdown) */}
                            <div className="relative mt-4">
                                <label htmlFor="id_hargaAsli"
                                    className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Harga Asli<span
                                    className="text-red-500">*</span></label>
                                <input 
                                    type="text" // Menggunakan type="text"
                                    id="id_hargaAsli" 
                                    name="hargaAsli" // Menggunakan name="hargaAsli"
                                    value={formData.hargaAsli}
                                    onChange={handleChange}
                                    className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl block w-full p-3.5"
                                    placeholder="Contoh: 100000" 
                                    required 
                                />
                                {/* Anda mungkin ingin mengganti type="text" dengan type="number" dan menambahkan prefix Rp. untuk pengalaman pengguna yang lebih baik */}
                                <p className="text-red-500 text-xs mt-1 font-noto-sans"></p>
                            </div>
                            
                            {/* Masa Aktif Dropdown (Jenjang) - Tetap ada */}
                            <div className="relative mt-4 ">
                                <label htmlFor="id_jenjang"
                                    className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Masa Aktif<span
                                    className="text-red-500">*</span></label>
                                    <button id="dropdownDefaultButton"
                                        type="button"
                                        onClick={() => setIsJenjangOpen(!isJenjangOpen)}
                                        className="relative z-10 truncate w-full font-noto-sans inline-flex text-gray-900 bg-white focus:ring-1 ring-1 ring-gray-300 shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                        {formData.jenjang || "Masa Aktif"}
                                        <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isJenjangOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7"/></svg>
                                    </button>
                                    {isJenjangOpen && (
                                        <div className="absolute z-10 mt-2 w-full ring-1 ring-gray-300 rounded-xl shadow-lg bg-white max-h-60 overflow-y-auto">
                                            <ul className="p-2 text-sm text-gray-600 font-medium">
                                                {jenjangList.map((item) => (
                                                    <li key={item}>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleSelectJenjang(item)}
                                                            className="flex items-center w-full p-2 hover:bg-gray-100 rounded-lg text-left font-noto-sans">
                                                            <span className="text-gray-900">{item}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                            </div>

                            {/* Tombol Segmented Switch (Status Aktif/Non Aktif) - Tetap ada */}
                            {/* <div className="mt-4  ">
                                <label className="block text-base font-normal text-gray-900 mb-2 font-noto-sans">
                                    Status<span className="text-red-500">*</span>
                                </label> */}
                                
                                {/* Kontainer Utama Tombol Segmented */}
                                {/* <div className="flex w-60 h-10 rounded-full bg-blue-50/50 overflow-hidden shadow-sm border border-blue-100">  */}
                                    
                                    {/* Tombol Aktif */}
                                    {/* <button
                                        type="button"
                                        onClick={() => handleSegmentedToggle('Aktif')}
                                        className={`flex-1 text-sm font-noto-sans transition-all duration-200 ease-in-out ${
                                            isAktif
                                                ? 'bg-primary text-white shadow-md' 
                                                : 'bg-transparent text-gray-700 hover:bg-blue-100'
                                        } rounded-full m-0.5`}
                                    >
                                        Aktif
                                    </button> */}
                                    
                                    {/* Tombol Non Aktif */}
                                    {/* <button
                                        type="button"
                                        onClick={() => handleSegmentedToggle('Non Aktif')}
                                        className={`flex-1 text-sm font-noto-sans transition-all duration-200 ease-in-out ${
                                            !isAktif
                                                ? 'bg-primary text-white shadow-md' 
                                                : 'bg-transparent text-gray-700 hover:bg-blue-100' 
                                        } rounded-full m-0.5`}
                                    >
                                        Non Aktif
                                    </button> */}
                                {/* </div> */}
                            {/* </div> */}
                            
                        </div>
                    </div>
                    
                    {/* Tombol Simpan/Batal */}
                    <div className="mt-4 flex gap-4 justify-start">
                        <button type="submit"
                            className="text-white bg-primary box-border border border-transparent shadow-xs font-medium leading-5 rounded-2xl text-sm px-6 py-2.5 focus:outline-none font-noto-sans ">
                            Simpan
                        </button>
                        <Link
                            to="/dashboard/paket-langganan"
                            className="text-primary bg-white box-border border border-primary shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none font-noto-sans ">
                            Batal
                        </Link>
                    </div>
                </form>

            </div>
        </div>
    );
}