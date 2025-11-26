import { Link } from "react-router";

export default function Header({ toggleDesktopSidebar }) {
  const user = {
    username: "Mangadi",
    email: "adi@interexam.com",
    avatar: "/images/profile.png",
  };

  return (
    <header className="antialiased">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 fixed top-0 left-0 w-full z-50">
        <div className="flex flex-wrap justify-between items-center">

          <div className="flex justify-start items-center"> 
            {/* Button Toggle mobile */}
            <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar"
              className="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 ">
              <svg class="w-[18px] h-[18px]" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 17 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M1 1h15M1 7h15M1 13h15" />
              </svg>
              <span class="sr-only">Toggle sidebar</span>
            </button>

            {/* 2. Logo & Nama Website */}
            <Link to="/dashboard" className="flex mr-4 items-center">
              <img
                src="/interexam-logo.svg" 
                className="mr-3 h-8 w-8"
                alt="InterExam Logo"/>
              <span className="self-center text-xl font-semibold whitespace-nowrap font-sora">
                Inter<span className="text-secondary">E</span>xam
              </span>
            </Link>

             {/* Button Toggle desktop */}
            <button id="toggleSidebar" 
              onClick={toggleDesktopSidebar}  
              aria-expanded="true" 
              aria-controls="default-sidebar" 
              className="hidden p-2 mr-3 text-gray-600 rounded-full cursor-pointer lg:flex hover:text-gray-900 hover:bg-gray-100 ">
              <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 16 12">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M1 1h14M1 6h14M1 11h7" />
              </svg>
            </button>
          </div>

          <div className="flex items-center lg:order-2">
            
            {/* tombol notifikasi */}
            <button type="button" data-dropdown-toggle="notification-dropdown"
              className="p-2 mr-1 text-gray-900 border-gray-300 rounded-4xl hover:text-gray-900 hover:bg-gray-100 border-1 ">
              <span className="sr-only">Lihat Notifikasi</span>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.35419 21C10.0593 21.6224 10.9856 22 12 22C13.0145 22 13.9407 21.6224 14.6458 21M18 8C18 6.4087 17.3679 4.88258 16.2427 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.8826 2.63214 7.75738 3.75736C6.63216 4.88258 6.00002 6.4087 6.00002 8C6.00002 11.0902 5.22049 13.206 4.34968 14.6054C3.61515 15.7859 3.24788 16.3761 3.26134 16.5408C3.27626 16.7231 3.31488 16.7926 3.46179 16.9016C3.59448 17 4.19261 17 5.38887 17H18.6112C19.8074 17 20.4056 17 20.5382 16.9016C20.6852 16.7926 20.7238 16.7231 20.7387 16.5408C20.7522 16.3761 20.3849 15.7859 19.6504 14.6054C18.7795 13.206 18 11.0902 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            {/* menu seting profil user */}
            <div className="flex items-center lg:order-2">
            <button
              type="button"
              className="flex items-center mx-3 text-sm md:mr-0 rounded-full"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="dropdown">
              <span className="sr-only">Open user menu</span>
              <img className="w-10 h-10 rounded-full object-cover" src="/profile-default.png" alt="user photo" />
              <span className="hidden md:block ml-2 text-gray-900 font-se font-medium">
                {user.username}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="hidden z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow " id="dropdown">
              <div className="py-3 px-4">
                <span className="block text-sm font-noto-sans font-semibold text-gray-900 ">{user.username}</span>
                <span className="block text-sm text-gray-500 truncate  font-noto-sans">{user.email}</span>
              </div>
              <ul className="py-1 text-gray-700 " aria-labelledby="user-menu-button">
                <li>
                  <Link to="#" className="flex items-center py-2 px-4 text-sm gap-2 hover:bg-primary/10 font-noto-sans ">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5.3163 19.4384C5.92462 18.0052 7.34492 17 9 17H15C16.6551 17 18.0754 18.0052 18.6837 19.4384M16 9.5C16 11.7091 14.2091 13.5 12 13.5C9.79086 13.5 8 11.7091 8 9.5C8 7.29086 9.79086 5.5 12 5.5C14.2091 5.5 16 7.29086 16 9.5ZM22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Edit profile
                  </Link>
                </li>
                <li className="border-t border-gray-100 pt-1">
                  <Link to="/logout" className="flex items-center py-2 px-4 text-sm gap-2 font-noto-sans hover:bg-primary/10  text-red-600 ">
                    <svg className="w-5 h-5 borde" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 17L21 12M21 12L16 7M21 12H9M9 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V16.2C3 17.8802 3 18.7202 3.32698 19.362C3.6146 19.9265 4.07354 20.3854 4.63803 20.673C5.27976 21 6.11984 21 7.8 21H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    Keluar
                  </Link>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </div>
      </nav>
    </header>
  );
}