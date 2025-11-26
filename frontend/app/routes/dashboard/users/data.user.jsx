import UserTable from "../../../components/dashboard/users/UserTable";

export function meta() {
  return [{ title: "Manajemen User - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-4">Manajemen User</h1> */}
      
      {/* Panggil komponen tabel di sini */}
      <UserTable />
    </div>
  );
}