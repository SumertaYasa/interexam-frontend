import ResetPassword from "../../../components/dashboard/users/ResetPassword";

export function meta() {
  return [{ title: "Reset Password - InterExam" }];
}

export default function ResetPasswordPage() {
  return (
    <div className="">

      <ResetPassword />
    </div>
  );
}