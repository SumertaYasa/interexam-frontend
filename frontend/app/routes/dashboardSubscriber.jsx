import { Outlet } from "react-router";
import DashboardLayout from "../components/DashboardSubcriber/Layout/DashboardLayout.jsx";

export function loader() {
  const userData = {
    name: "Fahmi",
    role: "Subscriber",
  };

  return { user: userData };
}

export function meta({ data }) {
  const name = data?.user?.name;

  return [
    { title: `Dashboard - ${name}`, description: "Dashboard Subscriber" },
  ];
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}
