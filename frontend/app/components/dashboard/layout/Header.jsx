import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";

import { getPhotoUrl } from "../../../utils/urlHelper";
import NotificationDropdown from "../common/NotificationDropdown";

export default function Header({
  toggleDesktopSidebar,
  toggleMobileSidebar,
  username,
  email,
  avatar,
}) {
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
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer md:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100"
            >
              <svg
                className="w-[18px] h-[18px]"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
              <span className="sr-only">Toggle sidebar</span>
            </button>

            {/* Logo */}
            <Link to="/dashboard" className="flex mr-4 items-center">
              <img
                src="/interexam-logo.svg"
                className="mr-3 h-8 w-8"
                alt="InterExam Logo"
                onError={(e) => (e.target.style.display = "none")}
              />
              <span className="self-center text-xl font-semibold whitespace-nowrap font-sora">
                Inter<span className="text-secondary">E</span>xam
              </span>
            </Link>

            {/* Button Toggle Desktop */}
            <button
              id="toggleSidebar"
              onClick={toggleDesktopSidebar}
              className="hidden p-2 mr-3 text-gray-600 rounded-full cursor-pointer md:flex hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 12"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h14M1 6h14M1 11h7"
                />
              </svg>
            </button>
          </div>

          <div className="flex items-center lg:order-2 gap-2">
            {/* Tombol Notifikasi */}
            <NotificationDropdown />

            {/* Menu User Profil*/}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex items-center mx-3 text-sm md:mr-0 rounded-full"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  src={getPhotoUrl(avatar)} 
                  alt="user photo"
                />
                <span className="hidden md:block ml-2 text-gray-900 font-se font-medium">
                  {username}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isUserOpen && (
                <div className="absolute right-0 top-10 z-50 my-4 w-56 text-base list-none bg-white rounded-xl divide-y divide-gray-100 shadow">
                  <div className="py-3 px-4">
                    <span className="block text-sm font-noto-sans font-semibold text-gray-900">
                      {username}
                    </span>
                    <span className="block text-sm text-gray-500 truncate font-noto-sans">
                      {email}
                    </span>
                  </div>
                  <ul className="py-1 text-gray-700">
                    <li>
                      <Link
                        to="edit-profile/"
                        className="flex items-center py-2 px-4 text-sm gap-2 hover:bg-primary/10 font-noto-sans"
                      >
                        {/* Icon Edit */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          ></path>
                        </svg>
                        Edit profile
                      </Link>
                    </li>
                    <li className="border-t border-gray-100 pt-1">
                      <Link
                        to="/logout"
                        className="flex items-center py-2 px-4 text-sm gap-2 font-noto-sans hover:bg-primary/10 text-red-600"
                      >
                        {/* Icon Logout */}
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          ></path>
                        </svg>
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
