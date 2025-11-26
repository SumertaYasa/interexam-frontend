import { Link } from "react-router";

export default function UserTable() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

      {/* Navigasi Head */}
        <div className="pb-6">
          <div className="sm:flex sm:justify-between sm:items-center mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl md:text-3xl text-dark-primary font-bold font-sora">Data User</h1>
            </div>

            <div className="mb-4 sm:mb-0">
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                  <li className="inline-flex items-center">
                      <Link to="/dashboard" className="inline-flex items-center font-noto-sans text-sm font-medium text-gray-500">Dashboard</Link>
                  </li>
                  <li className="inline-flex items-center">
                    <svg className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/></svg>
                    <Link to="" className="inline-flex items-center text-sm font-noto-sans font-medium text-dark-primary hover:text-primary-hover">
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
                      {/* <span className="ms-1 text-sm font-medium text-dark-secondary font-noto-sans md:ms-2 dark:text-gray-400">Add Content</span> */}
                    </div>
                  </li>

                </ol>
              </nav>
            </div>

          </div>
        </div>


        <div className="container mx-auto p-4 bg-white rounded-2xl shadow-xl">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="relative w-full sm:w-auto flex  flex-row items-center gap-4">
              <form method="GET" action="#" className="relative w-full sm:w-auto">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center ">
                  <svg className="h-5 w-5 text-gray-400 " viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
                  </svg>
                </span>
                <input className="font-noto-sans block w-full sm:w-64 md:w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-3xl h-10 leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-pr-900 focus:border-pr-900 sm:text-sm"
                type="search" name="q"  placeholder="Cari user..." />
              </form>
                <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            
            <Link to="add" className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-2xl h-10 shadow-sm text-white bg-primary hover:bg-pr-900  ">
              <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                aria-hidden="true">
                <path fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v4h4a1 1 0 110 2h-4v4a1 1 0 11-2 0v-4H5a1 1 0 110-2h4V4a1 1 0 011-1z"
                    clip-rule="evenodd" />
            </svg>
            Add User
            </Link>
          </div>


          {/* Tabel  User */}
          <div className="bg-white  shadow-md rounded-lg overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 ">
              <thead className="bg-gray-100 ">
                <tr>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          NO
                      </th>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          GAMBAR
                      </th>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          NAMA
                      </th>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900  tracking-wider">
                          EMAIL
                      </th>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900  tracking-wider">
                          NO HP
                      </th>
                      <th scope="col"
                          className="px-6 py-3  text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                          JABATAN
                      </th>
                      <th scope="col"
                          className="px-6 py-3 font-noto-sans text-left text-xs font-semibold text-gray-900  uppercase tracking-wider">
                          Action
                      </th>
                  </tr>
              </thead>

              <tbody className="bg-white  divide-y divide-gray-200 ">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 ">
                    1
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap" alt="Foto Profile">
                    <img src="/profile.jpg" className="rounded-full h-12 w-12"/>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 ">
                    I Komang Adi Wirata
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 ">
                    mangaidi@gmail.com
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 ">
                    08237523
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium font-noto-sans text-gray-900 truncate w-10">
                    Admin
                  </td>

                  <td className="px-6 py-4 mt-2 whitespace-nowrap  text-sm font-medium font-noto-sans text-gray-900 ">
                    
                    <div className="flex gap-2 items-center">

                    <Link to="#"
                      className="flex items-center justify-center text-neu-900 bg-amber-300 rounded-base h-8 w-8  ">
                        <svg className="w-6 h-6  text-gray-800  " aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                          </svg>
                    </Link>

                    <button type="button" className="text-red-500 hover:text-red-700 bg-red-700 h-8 w-8 rounded-base" onclick="confirmUserDelete">
                        <svg className="w-6 h-6 text-center mx-auto text-white dark:text-white bg-red-700"
                          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                          viewBox="0 0 24 24">
                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                          stroke-width="2"
                            d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                      </button>

                    <button type="button" className="text-white  bg-red-700 h-8 w-8 rounded-base">
                      <svg className="w-6 h-6 text-center mx-auto text-white dark:text-white bg-red-700" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>



    </div>
    
  );
}
