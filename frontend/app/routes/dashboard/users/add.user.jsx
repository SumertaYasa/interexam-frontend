import AddUser from "../../../components/dashboard/users/AddUser";

export function meta() {
  return [{ title: "Add User - InterExam" }];
}

export default function AddUsersPage() {
  return (
    <div className="">

      <AddUser />
    </div>
  );
}