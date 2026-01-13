import { Outlet } from "react-router";
import ProtectedRoute from "../../Common/ProtectedRoute";

export default function FullViewLayout() {
  return (
    <ProtectedRoute allowedRoles={["subscriber"]}>
      <Outlet />
    </ProtectedRoute>
  );
}
