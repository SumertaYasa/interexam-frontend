import UserPage from "../../../components/dashboard/users/UserPage";

export function meta() {
  return [{ title: "Manajemen User - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">

      <UserPage />
    </div>
  );
}