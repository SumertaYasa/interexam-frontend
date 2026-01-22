import EditJenjang from "../../../components/dashboard/kategori/jenjang/EditJenjang";

export function meta() {
  return [{ title: "Add Jenjang - InterExam" }];
}

export default function JenjangTablePage() {
  return (
    <div className="">

      <EditJenjang/>
    </div>
  );
}