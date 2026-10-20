import IndexPage from "../../components/dashboard/Index";

export function meta() {
  return [{ title: "Dashboard - InterExam" }];
}

export default function DashboardHome() {
  return (
    <div className="">

      <IndexPage />
    </div>
  );
}