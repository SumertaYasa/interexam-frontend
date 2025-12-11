import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";

export default function Header({ toggleDesktopSidebar, toggleMobileSidebar }) {
  const user = {
    username: "Mangadi",
    email: "adi@interexam.com",
    avatar: "/images/profile.png",
  };

  const [isUserOpen, setIsUserOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuRef]);

  return (
    <header className="antialiased">
      <nav className="bg-white border-gray-300 border-b px-4 lg:px-6 py-2.5 fixed top-0 left-0 w-full z-50">
        <div className="flex flex-wrap justify-between items-center">
          
          {/* TOGGLE & LOGO */}
          <div className="flex justify-start items-center">
            
            {/* Button Toggle Mobile */}
            <button
              onClick={toggleMobileSidebar} 
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100"
            >
              <svg className="w-[18px] h-[18px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex mr-4 items-center">
              <img src="/interexam-logo.svg" className="mr-3 h-8 w-8" alt="InterExam Logo" onError={(e) => e.target.style.display='none'} />
              <span className="self-center text-xl font-semibold whitespace-nowrap font-sora">
                Inter<span className="text-secondary">E</span>xam
              </span>
            </Link>

            {/* Button Toggle Desktop */}
            <button
              id="toggleSidebar"
              onClick={toggleDesktopSidebar}
              className="hidden p-2 mr-3 text-gray-600 rounded-full cursor-pointer lg:flex hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h14M1 6h14M1 11h7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center lg:order-2 gap-2">
            
            {/* Tombol Notifikasi */}
            <button
              type="button"
              className="p-2 mr-1 text-gray-900 border-gray-300 rounded-full hover:text-gray-900 hover:bg-gray-100 border"
            >
              <span className="sr-only">Lihat Notifikasi</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Menu User Profil*/}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex items-center mx-3 text-sm md:mr-0 rounded-full"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <img className="w-10 h-10 rounded-full object-cover" src="/profile-default.png" alt="user photo" />
                <span className="hidden md:block ml-2 text-gray-900 font-se font-medium">
                  {user.username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserOpen && (
                <div
                  className="absolute right-0 top-10 z-50 my-4 w-56 text-base list-none bg-white rounded-xl divide-y divide-gray-100 shadow"
                >
                  <div className="py-3 px-4">
                    <span className="block text-sm font-noto-sans font-semibold text-gray-900">{user.username}</span>
                    <span className="block text-sm text-gray-500 truncate font-noto-sans">{user.email}</span>
                  </div>
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link to="#" className="flex items-center py-2 px-4 text-sm gap-2 hover:bg-primary/10 font-noto-sans">
                        {/* Icon Edit */}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        Edit profile
                      </Link>
                    </li>
                    <li className="border-t border-gray-100 pt-1">
                      <Link to="/logout" className="flex items-center py-2 px-4 text-sm gap-2 font-noto-sans hover:bg-primary/10 text-red-600">
                         {/* Icon Logout */}
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        Keluar
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </div>

          </div>
        </div>
      </nav>
    </header>
  );
}