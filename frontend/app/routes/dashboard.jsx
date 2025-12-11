import { Outlet } from "react-router";
import DashboardLayout from "../components/dashboard/layout/DashboardLayout";

export function meta() {
  return [
    { title: "Dashboard - InterExam" }
  ];
}

export default function DashboardParent() {
  return (
    <DashboardLayout>
      <Outlet /> 
    </DashboardLayout>
  );
}