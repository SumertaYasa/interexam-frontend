export default function DashboardFooter() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto w-full font-noto-sans shrink-0">
            <div className="w-full max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col-reverse md:flex-row md:items-center md:justify-between gap-5 md:gap-4">
                    
                    {/* Bagian Kiri: Copyright */}
                    <div className="text-center md:text-left">
                        {/* Ukuran font dinaikkan menjadi text-sm (mobile) dan sm:text-base (desktop) */}
                        <p className="text-sm sm:text-xs text-gray-500">
                            &copy; {currentYear} <span className="font-bold text-primary">InterExam</span>. All rights reserved.
                        </p>
                    </div>

                    {/* Bagian Kanan: Links & Version */}
                    <div>
                        {/* Ukuran font dinaikkan menjadi text-sm (mobile) dan sm:text-base (desktop) */}
                        <ul className="flex flex-wrap justify-center md:justify-end items-center gap-x-5 sm:gap-x-6 gap-y-3 text-sm sm:text-xs text-gray-500">
                            <li>
                                <a href="#" className="hover:text-primary transition-colors duration-200">
                                    Pusat Bantuan
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors duration-200">
                                    Kebijakan Privasi
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary transition-colors duration-200">
                                    Syarat & Ketentuan
                                </a>
                            </li>
                            {/* Separator */}
                            <li className="hidden sm:block text-gray-300">|</li>
                            {/* Version Label */}
                            <li>
                                {/* Ukuran font badge version juga dinaikkan sedikit agar proporsional */}
                                <span className="text-xs sm:text-sm font-mono text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                                    v1.2.0
                                </span>
                            </li>
                        </ul>
                    </div>
                    
                </div>
            </div>
        </footer>
    );
}