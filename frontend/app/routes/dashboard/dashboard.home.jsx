export function meta() {
  return [{ title: "Dashboard Overview - InterExam" }];
}

export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Selamat Datang, Admin!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Contoh Widget Sederhana */}
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Total Subscriber</h5>
            <p className="font-normal text-gray-700">1,204 User</p>
        </div>
        <div className="p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">Pendapatan</h5>
            <p className="font-normal text-gray-700">Rp 50.000.000</p>
        </div>
      </div>
    </div>
  );
}