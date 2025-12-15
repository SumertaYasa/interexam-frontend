import { Outlet } from "react-router";
import AuthLayout from "../../../components/Auth/internal/authLayout";

export function meta() {
  return [{ title: "login - InterExam" }];
}

export default function FormInternal() {
  return (
    <AuthLayout>
      <Outlet />
    </AuthLayout>
  );
}
