import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const isSubscriberRoute = location.pathname.includes("/dashboard-subscriber");
  const targetLogin = isSubscriberRoute ? "/login" : "/login-internal";

  if (!isAuthenticated) {
    if (location.pathname === targetLogin) return <>{children}</>;
    return <Navigate to={targetLogin} state={{ from: location }} replace />;
  }

  // VALIDASI ROLE
  if (allowedRoles && user) {
    const userRole = String(user.role || "")
      .trim()
      .toLowerCase();
    const allowed = allowedRoles.map((r) => r.trim().toLowerCase());

    if (!allowed.includes(userRole)) {
      console.warn(
        "Akses Ditolak! Role Kamu:",
        userRole,
        "Dibutuhkan:",
        allowed
      );
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
