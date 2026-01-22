import EditProfile from "../../../components/dashboard/users/EditProfile";

export function meta() {
  return [{ title: "Edit Profile - InterExam" }];
}

export default function UsersPage() {
  return (
    <div className="">

      <EditProfile />
    </div>
  );
}