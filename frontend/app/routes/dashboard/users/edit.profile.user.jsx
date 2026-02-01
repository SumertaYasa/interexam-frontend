import EditProfile from "../../../components/dashboard/users/EditProfile";

export function meta() {
  return [{ title: "Edit Profile - InterExam" }];
}

export default function EditProfilePage() {
  return (
    <div className="">

      <EditProfile />
    </div>
  );
}