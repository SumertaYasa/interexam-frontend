import IndexPage from "../../components/dashboard";

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