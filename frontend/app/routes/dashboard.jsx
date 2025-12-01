import { Outlet } from "react-router";
// Import Layout yang sudah kamu buat (sesuaikan path foldernya)
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

export function meta() {
  return [
    { title: "Dashboard - InterExam" }
  ];
}

export default function DashboardParent() {
  return (
    // Kita bungkus Outlet dengan Layout Dashboard kamu
    <DashboardLayout>
      <Outlet /> 
    </DashboardLayout>
  );
}