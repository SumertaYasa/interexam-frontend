import { Link } from "react-router";
import { useState } from "react";

export default function AddArtikel() {

    return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

        {/* Navigasi Head */}
        <div className="pb-6">
          <div className="sm:flex sm:justify-between sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Add Artikel</h1>
            </div>

            <div className="mb-4 sm:mb-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                      <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                  </li>
                  <li className="inline-flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                    <Link to="../artikel" className="inline-flex text-gray-500 items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
                      Data Artikel
                    </Link>
                  </li>

                  <li aria-current="page">
                    <div className="flex items-center">
                      <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2" d="m1 9 4-4-4-4" />
                      </svg>
                      <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-900">Add Artikel</span>
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

                    {/* form judul */}
                    <div>
                        <label for="id_judul_artikel"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Judul Artikel<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_judul_artikel" name="text"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Masukan judul" required />
                        <p className="text-red-500 text-xs mt-1"></p>
                    </div>

                    {/* form isi konten */}
                    <div className="mt-4">
                    <label for="id_judul_artikel"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Isi Konten<span
                            className="text-red-500">*</span>
                    </label>
                    <textarea id="message" rows="4" class="bg-neutral-secondary-medium border border-gray-300 text-heading text-sm rounded-2xl  block w-full p-3.5 shadow-xs placeholder:text-body placeholder:text-gray-500 font-noto-sans" placeholder="Masukan isi konten dengan kalimat..."></textarea>

                    </div>

                </div>
            </div>

            {/* form kiri */}
            <div className="bg-white flex-1 max-w-[350px] h-fit rounded-2xl shadow-lg">

                <div className="p-6">

                    {/* form penulis*/}
                    <div>
                        <label for="id_judul_artikel"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Penulis Artikel<span
                            className="text-red-500">*</span></label>
                        <input type="text" id="id_judul_artikel" name="text"
                            className="bg-gray-50 border font-noto-sans border-gray-300 placeholder:text-gray-400 text-gray-900 text-sm rounded-2xl focus:ring-pr-900 focus:border-pr-900 block w-full p-3.5"
                            placeholder="Contoh: Adi Wirata" required />
                        <p className="text-red-500 text-xs mt-1"></p>
                    </div>


                </div>
                

            </div>
        </div>

            <div className="bg-white shadow-lg flex-1 h-auto rounded-2xl mt-4 w-full max-w-[795px]">
                <div className="p-6">

                    {/* form foto */}
                    <div>
                        <label for="id_judul_artikel"
                            className="block text-sm font-medium text-gray-700 mb-2 font-noto-sans">Gambar<span
                            className="text-red-500">*</span></label>
                        
                            <div className="flex items-center justify-center w-full">
                                <label for="dropzone-file" className="flex flex-col items-center justify-center w-full h-50 bg-neutral-secondary-medium border border-gray-400 border-dashed border-default-strong rounded-base cursor-pointer hover:bg-neutral-tertiary-medium">
                                    <div className="flex flex-col items-center justify-center text-body pt-5 pb-6">
                                        <svg className="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12.5 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H17C17.93 21 18.395 21 18.7765 20.8978C19.8117 20.6204 20.6204 19.8117 20.8978 18.7765C21 18.395 21 17.93 21 17M19 8V2M16 5H22M10.5 8.5C10.5 9.60457 9.60457 10.5 8.5 10.5C7.39543 10.5 6.5 9.60457 6.5 8.5C6.5 7.39543 7.39543 6.5 8.5 6.5C9.60457 6.5 10.5 7.39543 10.5 8.5ZM14.99 11.9181L6.53115 19.608C6.05536 20.0406 5.81747 20.2568 5.79643 20.4442C5.77819 20.6066 5.84045 20.7676 5.96319 20.8755C6.10478 21 6.42628 21 7.06929 21H16.456C17.8951 21 18.6147 21 19.1799 20.7582C19.8894 20.4547 20.4547 19.8894 20.7582 19.1799C21 18.6147 21 17.8951 21 16.456C21 15.9717 21 15.7296 20.9471 15.5042C20.8805 15.2208 20.753 14.9554 20.5733 14.7264C20.4303 14.5442 20.2412 14.3929 19.8631 14.0905L17.0658 11.8527C16.6874 11.5499 16.4982 11.3985 16.2898 11.3451C16.1061 11.298 15.9129 11.3041 15.7325 11.3627C15.5279 11.4291 15.3486 11.5921 14.99 11.9181Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        <p className="mb-1 mt-2 text-sm"><span class="font-semibold font-noto-sans text-primary text-lg ">Klik untuk upload</span></p>
                                        <p className="text-sm font-noto-sans text-gray-700">SVG, PNG, JPG (Ukuran maks 2MB)</p>
                                    </div>
                                    <input id="dropzone-file" type="file" className="hidden" />
                                </label>
                            </div> 

                    </div>

                </div>
            </div>


        {/* button */}
        <div className="mt-4 flex gap-4">
         
            {/* Tombol Simpan */}
           <button type="submit" 
                class="text-white bg-primary bg-brand box-border border border-transparent  shadow-xs font-medium leading-5 rounded-2xl text-sm px-6 py-2.5 focus:outline-none">
                    Simpan
            </button>
            
            {/* Tombol Batal*/}
            <Link 
                to="/dashboard/artikel"
                className="text-primary bg-white bg-brand box-border border-primary border-1   shadow-xs font-medium leading-5 rounded-2xl text-sm px-8 py-2.5 focus:outline-none">
                Batal
            </Link>

        </div>

    </div>
    );
}