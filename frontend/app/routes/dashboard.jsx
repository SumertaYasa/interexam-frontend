import { Outlet } from "react-router";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";
import ProtectedRoute from "../components/Common/ProtectedRoute.tsx";

export function meta() {
  return [{ title: "Dashboard - InterExam" }];
}

export default function DashboardParent() {
  return (
    <ProtectedRoute allowedRoles={["admin", "contributor", "validator"]}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
