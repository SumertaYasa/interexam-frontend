import AddUser from "../../../components/dashboard/users/AddUser";

export function meta() {
  return [{ title: "Add User - InterExam" }];
}

export default function AddUsersPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}

      <AddUser />
    </div>
  );
}