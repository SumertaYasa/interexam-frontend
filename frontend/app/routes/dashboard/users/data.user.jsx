import UserPage from "../../../components/dashboard/users/UserPage";

export function meta() {
  return [{ title: "Manajemen User - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <UserPage />
    </div>
  );
}