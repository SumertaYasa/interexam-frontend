import EditUser from "../../../components/dashboard/users/EditUser";

export function meta() {
  return [{ title: "Edit User - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">

      <EditUser />
    </div>
  );
}