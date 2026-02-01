import EditUser from "../../../components/dashboard/users/EditUser";

export function meta() {
  return [{ title: "Edit User - InterExam" }];
}

export default function EditUserPage() {
  return (
    <div className="">

      <EditUser />
    </div>
  );
}