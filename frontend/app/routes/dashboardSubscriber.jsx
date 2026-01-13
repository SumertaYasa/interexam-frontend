import { Outlet } from "react-router";
import DashboardLayout from "../components/DashboardSubcriber/Layout/DashboardLayout.jsx";
import ProtectedRoute from "../components/Common/ProtectedRoute.tsx";

export function meta() {
  return [
    {
      title: "Dashboard Subscriber - InterExam",
      description: "Halaman dashboard utama peserta.",
    },
  ];
}

export default function Dashboard() {
  return (
    <ProtectedRoute allowedRoles={["subscriber"]}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
