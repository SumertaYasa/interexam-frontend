import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

// Import Service
import { bankSoalService } from "../../../services/bankSoalService";

// Import Components
import PageHeader from "../common/PageHeader";
import SearchInput from "../common/SearchInput";
import ButtonAdd from "../common/ButtonAdd"; 
import DynamicTable from "../common/DynamicTable";
import StatCard from "../common/StatCard";

export default function BankTable() {
  const navigate = useNavigate();
  
  // State
  const [dataSoal, setDataSoal] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State Statistik
  const [stats, setStats] = useState({
    total: 0,
    disetujui: 0,
    ditolak: 0,
    need_verif: 0
  });

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Role default validator
      const response = await bankSoalService.getBankSoal('validator');
      
      if (response.status === 'success') {
        const fetchedData = response.data;
        setDataSoal(fetchedData);

        // Hitung Statistik
        const counts = fetchedData.reduce((acc, item) => {
          acc.total++;
          const st = (item.status || "").toLowerCase();
          
          if (st === 'disetujui') acc.disetujui++;
          else if (st === 'ditolak') acc.ditolak++;
          else if (st === 'need verification' || st === 'menunggu' || st === 'need_verification') acc.need_verif++;
          
          return acc;
        }, { total: 0, disetujui: 0, ditolak: 0, need_verif: 0 });

        setStats(counts);
      }
    } catch (error) {
      console.error("Gagal load data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. LOGIKA AKSI ---

  // A. Klik Baris (Navigasi ke Detail Validasi)
  const handleRowClick = (row) => {
    const st = (row.status || "").toLowerCase();
    if (st === 'need verification' || st === 'need_verification' || st === 'menunggu') {
      navigate(`detail/${row.id_soal}`);
    }
  };

  // B. Quick Verify
  const handleQuickVerify = async (id) => {
    if(confirm("Apakah Anda yakin ingin menyetujui soal ini secara langsung?")) {
        try {
            await bankSoalService.updateSoal(id, { status: 'Disetujui' });
            alert("Soal berhasil disetujui!");
            fetchData(); // Refresh data
        } catch (error) {
            alert("Gagal memverifikasi soal.");
        }
    }
  };

  // C. Delete Permanen
  const handleDelete = async (id) => {
    if(confirm("Yakin hapus soal ini secara permanen?")) {
        try {
            await bankSoalService.deleteSoal(id);
            setDataSoal(prev => prev.filter(item => item.id_soal !== id));
            // Update stats manual agar responsif
            setStats(prev => ({...prev, total: prev.total - 1})); 
            alert("Data berhasil dihapus");
        } catch (error) {
            alert("Gagal menghapus data.");
        }
    }
  };

  // --- 3. FILTERING & FORMATTING ---
  const formatTipeSoal = (tipe) => {
      if (!tipe) return "-";
      if (tipe === 'multiple_choice' || tipe === 'pilihan_ganda') return 'Pilihan Ganda';
      if (tipe === 'multiple_answer' || tipe === 'multi_jawaban') return 'Multi Jawaban';
      return tipe;
  };

  const filteredData = dataSoal.filter(item => 
    (item.text_soal || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.mata_pelajaran || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- 4. KOLOM TABEL ---
  const columns = [
    { 
        header: "SOAL", 
        accessor: "text_soal",
        render: (text) => (
            <div className="max-w-[250px] truncate" title={text}>
                {text ? text.replace(/<[^>]+>/g, '') : '-'}
            </div>
        )
    },
    { header: "MATA PELAJARAN", accessor: "mata_pelajaran" },
    { 
        header: "TIPE SOAL", 
        accessor: "tipe_soal",
        render: (val) => formatTipeSoal(val)
    },
    { 
        header: "LEVEL KESULITAN", 
        accessor: "level_kesulitan",
        render: (val) => val ? val.charAt(0).toUpperCase() + val.slice(1) : '-'
    },
    {
      header: "STATUS",
      accessor: "status",
      render: (statusRaw) => {
        let badgeClass = "bg-gray-100 text-gray-600";
        let text = statusRaw || "-";
        const st = (statusRaw || "").toLowerCase();

        if (st === "disetujui") {
            badgeClass = "bg-green-100 text-green-600";
            text = "Disetujui";
        } else if (st === "need verification" || st === "need_verification" || st === "menunggu") {
            badgeClass = "bg-orange-100 text-orange-600";
            text = "Need Verification";
        } else if (st === "ditolak") {
            badgeClass = "bg-red-100 text-red-600";
            text = "Ditolak";
        }

        return (
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClass}`}>
            {text}
          </span>
        );
      },
    },
    {
      header: "AKSI",
      accessor: "id_soal", 
      render: (_, row) => {
        const stopProp = (e) => e.stopPropagation();
        const st = (row.status || "").toLowerCase();

        // KASUS A: Need Verification
        if (st === "need verification" || st === "need_verification" || st === "menunggu") {
          return (
            <div className="flex gap-2">
              <button 
                onClick={(e) => { stopProp(e); handleQuickVerify(row.id_soal); }}
                className="flex items-center justify-center text-white bg-green-600 h-8 w-8 rounded-base transition-colors hover:bg-green-700"
                title="Verifikasi Langsung"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 12L10.5 15L16.5 9M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <button 
                  onClick={(e) => { stopProp(e); navigate(`detail/${row.id_soal}`); }}
                  className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                  title="Lihat Detail & Tolak"
              >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.93 4.93L19.07 19.07M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          );
        }

        // KASUS B: Disetujui
        if (st === "disetujui") {
          return (
            <div className="flex gap-2">
              <Link 
                to={`edit/${row.id_soal}`}
                onClick={stopProp}
                className="flex items-center justify-center text-neu-900 bg-amber-300 hover:bg-amber-400 rounded-base h-8 w-8 transition-colors"
                title="Edit / Masukkan ke Paket"
              >
                  <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z" /></svg>
              </Link>
              <button 
                  type="button" 
                  onClick={(e) => { stopProp(e); handleDelete(row.id_soal); }} 
                  className="flex items-center justify-center text-white bg-red-700 hover:bg-red-800 h-8 w-8 rounded-base transition-colors"
                  title="Hapus"
              >
                  <svg className="w-5 h-5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z" /></svg>
              </button>
            </div>
          );
        }

        return null;
      },
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 w-full max-w-9xl mx-auto h-auto">
      <PageHeader
        title="Bank Soal"
        breadcrumbs={[
          { label: "Dashboard", link: "/dashboard" },
          { label: "Bank Soal", link: null },
        ]}
      />

      {/* STATISTIK CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        
        {/* Card 1: Total Soal */}
        <StatCard
          title="Total soal"
          count={stats.total}
          iconWrapperClass="bg-blue-100 text-primary"
          icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 20H5.2C4.07989 20 3.51984 20 3.09202 19.782C2.71569 19.5903 2.40973 19.2843 2.21799 18.908C2 18.4802 2 17.9201 2 16.8V7.2C2 6.07989 2 5.51984 2.21799 5.09202C2.40973 4.71569 2.71569 4.40973 3.09202 4.21799C3.51984 4 4.07989 4 5.2 4H5.6C7.84021 4 8.96031 4 9.81596 4.43597C10.5686 4.81947 11.1805 5.43139 11.564 6.18404C12 7.03968 12 8.15979 12 10.4M12 20V10.4M12 20H18.8C19.9201 20 20.4802 20 20.908 19.782C21.2843 19.5903 21.5903 19.2843 21.782 18.908C22 18.4802 22 17.9201 22 16.8V7.2C22 6.07989 22 5.51984 21.782 5.09202C21.5903 4.71569 21.2843 4.40973 20.908 4.21799C20.4802 4 19.9201 4 18.8 4H18.4C16.1598 4 15.0397 4 14.184 4.43597C13.4314 4.81947 12.8195 5.43139 12.436 6.18404C12 7.03968 12 8.15979 12 10.4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          badgeClass="bg-green-100 text-green-700"
          badgeContent={`Total ${stats.total} Soal`}
        />

        {/* Card 2: DISETUJUI (Dengan Badge 'Belum Validasi') */}
        <StatCard
          title="Total soal Disetujui"
          count={stats.disetujui} // Angka Utama: Jumlah Disetujui
          iconWrapperClass="bg-green-100 text-green-600"
          icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          badgeClass="bg-yellow-100 text-yellow-700" // Warna Kuning
          badgeContent={`${stats.need_verif} soal belum tervalidasi`} // Badge: Jumlah Pending
        />

        {/* Card 3: DITOLAK */}
        <StatCard
          title="Total soal ditolak"
          count={stats.ditolak}
          iconWrapperClass="bg-red-100 text-red-600"
          icon={<svg className="w-6 h-6 min-w-[24px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          badgeClass="bg-red-200 text-red-700"
          badgeContent={`${stats.ditolak} soal ditolak`}
        />
      </div>

      {/* TABLE SECTION */}
      <div className="mx-auto p-4 bg-white rounded-2xl shadow-xl">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-auto flex flex-row items-center gap-4">
            <SearchInput
              placeholder="Cari Soal..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-10 h-10 ring-1 sm-start ring-gray-300 rounded-xl text-gray-700 p-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8L15 8M15 8C15 9.65686 16.3431 11 18 11C19.6569 11 21 9.65685 21 8C21 6.34315 19.6569 5 18 5C16.3431 5 15 6.34315 15 8ZM9 16L21 16M9 16C9 17.6569 7.65685 19 6 19C4.34315 19 3 17.6569 3 16C3 14.3431 4.34315 13 6 13C7.65685 13 9 14.3431 9 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Dynamic Table */}
        <DynamicTable
          columns={columns}
          data={filteredData}
          isLoading={isLoading}
          onRowClick={handleRowClick}
        />
      </div>
    </div>
  );
}