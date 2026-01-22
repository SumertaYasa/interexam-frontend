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

    const handleDelete = async (id, isReject = false) => {
        const message = isReject 
            ? "Yakin ingin MENOLAK pendaftaran user ini? Data akan dihapus permanen." 
            : "Yakin ingin menghapus user ini?";

        if (confirm(message)) {
            try {
                await userService.deleteUser(id);
                setUsers(users.filter(user => user.id_user !== id));
                alert(isReject ? "Pendaftaran ditolak." : "User berhasil dihapus");
            } catch (error) {
                alert("Gagal menghapus user");
            }
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        let confirmMsg = "";
        let reason = "";

        if (newStatus === 'Verified') confirmMsg = "Verifikasi user ini?";
        if (newStatus === 'Suspend') {
            confirmMsg = "Yakin ingin MEN-SUSPEND user ini?";
            reason = prompt("Masukkan alasan suspend (opsional):") || "Pelanggaran aturan";
        }
        if (newStatus === 'Unverified') confirmMsg = "Kembalikan ke status Unverified?"; 
        
        // Logika Aktifkan Kembali (Dari Suspend ke Verified)
        if (newStatus === 'Reactivate') {
            confirmMsg = "Aktifkan kembali user ini?";
            newStatus = 'Verified'; 
            reason = "Pengaktifan kembali akun";
        }

        if (confirm(confirmMsg)) {
            try {
                await userService.changeStatus(id, newStatus, reason);
                
                setUsers(users.map(user => 
                    user.id_user === id ? { ...user, status: newStatus } : user
                ));
                
                alert(`Status user berhasil diubah menjadi ${newStatus}`);
            } catch (error) {
                console.error(error);
                alert(error.message || "Gagal mengubah status user");
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
            header: "STATUS",
            render: (row) => {
                let badgeClass = "bg-gray-100 text-gray-800";
                if (row.status === 'Verified') badgeClass = "bg-green-100 text-green-800 border-green-200";
                if (row.status === 'Unverified') badgeClass = "bg-yellow-100 text-yellow-800 border-yellow-200";
                if (row.status === 'Suspend') badgeClass = "bg-red-100 text-red-800 border-red-200";

                return (
                    <span className={`px-2 py-1 text-xs font-bold rounded-full border ${badgeClass}`}>
                        {row.status || 'Unverified'}
                    </span>
                );
            }
        },
        {
            header: "AKSI",
            render: (row) => {
                const currentStatus = row.status || 'Unverified';
                return (
                <div className="flex gap-2 items-center">

                    {/* KONDISI : User Baru / Unverified */}
                        {currentStatus === 'Unverified' && (
                            <>
                                {/* Tombol Verifikasi (Checklist) */}
                                <button 
                                    onClick={() => handleStatusChange(row.id_user, 'Verified')}
                                    className="flex items-center justify-center text-white bg-green-600 hover:bg-green-700 rounded-lg h-8 w-8 transition-colors shadow-sm"
                                    title="Verifikasi User">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className="lucide lucide-check-icon lucide-check w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 6 9 17l-5-5"/>
                                    </svg>
                                </button>

                                {/* Tombol Tolak (Silang Merah) - Hapus User */}
                                <button 
                                    onClick={() => handleDelete(row.id_user, true)}
                                    className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 rounded-lg h-8 w-8 transition-colors shadow-sm"
                                    title="Tolak User">
                                    <svg xmlns="http://www.w3.org/2000/svg" 
                                        className="w-5 h-5 lucide lucide-x-icon lucide-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                </button>
                            </>
                        )}

                        {/* KONDISI : User Verified (Bisa di-Suspend) */}
                        {currentStatus === 'Verified' && (
                            <button 
                                onClick={() => handleStatusChange(row.id_user, 'Suspend')}
                                className="flex items-center justify-center text-white bg-rose-600 hover:bg-rose-700 rounded-lg h-8 w-8 transition-colors shadow-sm"
                                title="Suspend User">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                            </button>
                        )}

                        {/* KONDISI : User Suspend (Bisa Diaktifkan Kembali) */}
                        {currentStatus === 'Suspend' && (
                            <button 
                                onClick={() => handleStatusChange(row.id_user, 'Reactivate')}
                                className="flex items-center justify-center text-white bg-primary hover:bg-primary/90 rounded-lg h-8 w-8 transition-colors shadow-sm"
                                title="Aktifkan Kembali">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        )}

                        <div className="w-px h-6 bg-gray-300 mx-1"></div>
                        
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
                    
                </div>
                );
            }
            
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