import { Link } from "react-router";
import { useState } from "react";

export default function AddUser() {

    const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    role: "",
    keahlian: []
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    };

    const [isJabatanOpen, setIsJabatanOpen] = useState(false);
    const handleSelectJabatan = (value) => {
        setFormData({
            ...formData,
            role: value });
            setIsJabatanOpen(false);
    };

    const [isKeahlianOpen, setIsKeahlianOpen] = useState(false);
    const subjects = ["Matematika", "Bahasa Indonesia", "Fisika", "Kimia", "Biologi", "Sejarah", "Geografi"];

    const handleSelectKeahlian = (subject) => {
        setFormData((prev) => {
        const currentKeahlian = Array.isArray(prev.keahlian) ? prev.keahlian : [];
        let newKeahlian;

        if (currentKeahlian.includes(subject)){
            newKeahlian = currentKeahlian.filter((item) => item !== subject);
        } else {
            newKeahlian = [
                ...currentKeahlian,
                subject
            ];
        }
        return({
            ...prev,
            keahlian: newKeahlian
        });
        });
    };

    return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

        {/* Navigasi Head */}
        <div className="pb-6">
          <div className="sm:flex sm:justify-between sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Add User</h1>
            </div>

            <div className="mb-4 sm:mb-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                      <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                  </li>
                  <li className="inline-flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                    <Link to="../users" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                      Data User
                    </Link>
                  </li>

                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="m1 9 4-4-4-4" />
                      </svg>
                      <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Add User</span>
                    </div>
                  </li>

                </ol>
              </nav>
            </div>

          </div>
        </div>

        {/* Form Add User */}
        <div className="flex flex-col lg:flex-row gap-6  ">

            {/* form kanan */}
            <div className="bg-white shadow-lg flex-1 h-auto rounded-2xl">
                <div className="p-6">

                    {/* form nama */}
                    <div>
                        <label for="id_username"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Name<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_username" name="username"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan nana" required />
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* form email */}
                    <div className="mt-4">
                        <label for="id_email"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Email<span
                            className="text-red-500">*</span></label>
                        <input type="email" id="id_email" name="email"
                            className="bg-gray-50 font-noto-sans border border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan email" required />
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* form Nomor Telepon */}
                    <div className="mt-4">
                        <label for="id_phone_number"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Nomor Telepon<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_phone_number" name="phone_number"
                            className="bg-gray-50 font-noto-sans border border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan nomor telepon" required />
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* form Password */}
                    <div className="mt-4">
                        <label for="id_password"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Password<span
                            className="text-red-500">*</span></label>
                        <input type="password" id="id_password" name="password"
                            className="bg-gray-50 border font-noto-sans placeholder:text-gray-400 border-gray-300 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan password" required />
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>

                </div>
            </div>

            {/* form kiri */}
            <div className="bg-white flex-1 max-w-[350px] h-fit rounded-2xl shadow-lg">

                <div className="p-6">

                    {/* form jabatan */}
                    <div className="relative">
                        <label for="id_jabatan"
                            className="block text-sm font-medium text-gray-700 mb-2  ">Jabatan<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                onClick={()=> setIsJabatanOpen(!isJabatanOpen)}
                                className="w-[300px] font-noto-sans inline-flex  text-gray-900  bg-brand  focus:ring-1 ring-1 ring-gray-300  shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between" type="button">
                                {formData.role  || "Pilih Jabatan"}
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 text-gray-900 transition-transform ${isJabatanOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isJabatanOpen &&(
                            <div id="jabatan" className=" z-10 ring-1 ring-gray-300 rounded-xl shadow-lg w-[300px] bg-white">
                                <ul className="p-2 text-sm text-body font-medium " aria-labelledby="dropdownDefaultButton">
                                    {["Admin", "Validator", "Contributor"].map((roleOption) => (
                                    <li>
                                        <button type="button" onClick={()=> handleSelectJabatan(roleOption)} className="hover:bg-primary/10 inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded-2xl">
                                            {roleOption}
                                        </button>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* Form Keahlian */}
                    {formData.role !== "Admin" && (
                    <div className="relative mt-4">
                        <label for="id_keahlian"
                            className="block text-sm font-medium text-gray-700 mb-2  ">Keahlian<span
                            className="text-red-500">*</span></label>
                            <button id="dropdownDefaultButton"
                                type="button"
                                onClick={()=> setIsKeahlianOpen(!isKeahlianOpen)}
                                className="relative z-20 truncate w-[300px] font-noto-sans inline-flex  text-gray-900  bg-brand  focus:ring-1 ring-1 ring-gray-300  shadow-xs font-medium leading-5 rounded-2xl text-sm px-4 py-3.5 focus:outline-none justify-between">
                                {formData.keahlian.length > 0
                                ? formData.keahlian.join (",")
                                : "Pilih Keahlian"
                                }
                                <svg className={`w-5 h-5 ms-1.5 -me-0.5 flex-shrink-0 text-gray-900 transition-transform ${isKeahlianOpen ? "rotate-180" : ""}`} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/></svg>
                            </button>
                            {isKeahlianOpen &&(
                            <div id="jabatan" className="absolute z-20 ring-1 ring-gray-300 rounded-xl shadow-lg w-[300px] bg-white">
                                <ul className="p-2 text-sm text-body font-medium " aria-labelledby="dropdownDefaultButton">
                                  {subjects.map((subject) => (
                                    <li key={subject}>
                                       <div className="flex items-center w-full p-2 hover:bg-gray-100 rounded cursor-pointer"
                                            onClick={() => handleSelectKeahlian(subject)} >
                                            <input 
                                                type="checkbox" 
                                                readOnly
                                                // value={subject}
                                                // Cek apakah item ini ada di dalam state formData
                                                checked={Array.isArray(formData.keahlian) && formData.keahlian.includes(subject)}
                                                // Panggil fungsi saat diklik
                                                // onChange={() => handleSelectKeahlian(subject)}
                                                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded  focus:ring-2 pointer-events-none"/>
                                            <span className="ms-2 text-sm font-medium text-gray-900">
                                                {subject}
                                            </span>
                                        </div>
                                    </li>
                                    ))}
                                </ul>
                            </div>
                            )}
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>
                    )}


                    {/* form foto profile */}
                    <div className="mt-4">
                        <label for="id_foto_profile"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Foto Profile<span
                            className="text-red-500">*</span></label>

                        <div className="flex items-center w-full">
                            <label 
                                htmlFor="file_input" 
                                className="flex items-center w-full p-2 bg-white border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 hover:border-primary transition-colors">
                                <span className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-xl  transition-colors">
                                    Pilih file
                                </span>
                                <span className="ml-4 text-sm text-gray-900 font-noto-sans truncate">
                                    {formData.fotoProfile ? formData.fotoProfile.name : "Profile.png"}
                                </span>
                                <input 
                                    id="file_input" 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setFormData({ ...formData, fotoProfile: file });
                                        }
                                    }}
                                />
                            </label>
                        </div>
                        <p class="text-red-500 text-xs mt-1"></p>
                    </div>



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
                to="/dashboard/users"
                className="text-primary bg-white bg-brand box-border border-primary border-1   shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none">
                Batal
            </Link>

        </div>

    </div>
    );
}