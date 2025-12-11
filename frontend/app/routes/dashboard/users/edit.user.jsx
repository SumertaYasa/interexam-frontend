import EditUser from "../../../components/dashboard/users/EditUser";

export function meta() {
  return [{ title: "Edit User - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <EditUser />
    </div>
  );
}