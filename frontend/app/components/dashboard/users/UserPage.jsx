import { Link } from "react-router";
import { useState, useEffect } from "react";

import { userService } from "../../../services/userService";
import { getPhotoUrl } from "../../../utils/urlHelper";

import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import ButtonAdd from "../common/ButtonAdd";
import DynamicTable from "../common/DynamicTable";

export default function UserPage() {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            alert("Gagal memuat data user.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (confirm("Yakin ingin menghapus user ini?")) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user.id_user !== id));
                alert("User berhasil dihapus");
            } catch (error) {
                alert("Gagal menghapus user");
            }
        }
    };

    const handleSuspend = async (id) => {
        if (confirm("Yakin ingin men-suspend user ini?")) {
            try {
                alert("Fitur Suspend berhasil (Simulasi)");
            } catch (error) {
                alert("Gagal suspend user");
            }
        }
    };

    const userColumns = [
        {
            header: "GAMBAR",
            render: (row) => (
                <img 
                    src={getPhotoUrl(row.foto)} 
                    alt="Profile" 
                    className="rounded-full h-12 w-12 object-cover border border-gray-200"
                />
            )
        },
        { header: "NAMA", accessor: "nama_user" },
        { header: "EMAIL", accessor: "email_user" },
        { 
            header: "NO HP",
            render: (row) => {
                const noHp = row.phone || row.no_hp || row.phoneNumber || row.telephone || row.hp;
                
                return <span className="text-gray-700">{noHp || "-"}</span>;
            }
        },
        { 
            header: "JABATAN", 
            render: (row) => (
                <span className="px-2 py-1 text-xs font-semibold leading-tight text-gray-900 bg-gray-100 rounded-full">
                    {row.role}
                </span>
            )
        },
        {
            header: "AKSI",
            render: (row) => (
                <div className="flex gap-2 items-center">
                    {/* Tombol Edit */}
                    <Link 
                        to={`edit/${row.id_user}`} 
                        className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                        title="Edit User"
                    >
                        <svg className="w-5 h-5 text-gray-800" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" />
                        </svg>
                    </Link>

                    {/* Tombol Delete */}
                    <button 
                        onClick={() => handleDelete(row.id_user)}
                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                        title="Hapus User"
                    >
                        <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" />
                        </svg>
                    </button>

                    {/* Tombol Suspend */}
                    <button 
                        onClick={() => handleSuspend(row.id_user)}
                        className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                        title="Suspend User">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    
                </div>
            )
        }
    ];

    const filteredData = users.filter(user => 
        (user.nama_user && user.nama_user.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email_user && user.email_user.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">

            <PageHeader 
                title="Data User"
                breadcrumbs={[
                    { label: "Dashboard", link: "/dashboard" },
                    { label: "Data User", link: null }
                ]}
            />

            <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
                        <SearchInput 
                            placeholder="Cari user..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <ButtonAdd to="add" text="Add User" />
                </div>

                <DynamicTable 
                    columns={userColumns} 
                    data={filteredData} 
                    isLoading={isLoading} 
                />
            </div>
        </div>
    );
}