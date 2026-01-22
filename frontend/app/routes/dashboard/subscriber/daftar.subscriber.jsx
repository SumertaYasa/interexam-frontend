import DaftarSubscriber from "../../../components/dashboard/subscription/daftar-subscription/DataSubscriber";


export function meta() {
  return [{ title: "Daftar Subscriber  - InterExam" }];
}

export default function DataSubscriber() {
  return (
    <div className="">
 
      <DaftarSubscriber />
    </div>
  );
}