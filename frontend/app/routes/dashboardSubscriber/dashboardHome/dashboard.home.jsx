import React from "react";
import CourseGrid from "../../../components/DashboardSubcriber/Features/Dashboard/CourseGrid";
import InformationGrid from "../../../components/DashboardSubcriber/Features/Dashboard/InformationGrid";
import RecentActivityList from "../../../components/DashboardSubcriber/Features/Dashboard/RecentActivityList";
export function meta() {
  return [
    { title: "InterExam" },
    { name: "description", content: "Welcome to InterExam" },
  ];
}

export default function DashboardHome() {
  return (
    <div className=" w-full">
      <div className="">
        <h1 className="text-heading-4 font-bold mb-2.5">Dashboard</h1>
        <div className="w-full h-full flex flex-col gap-5">
          <InformationGrid />
          <CourseGrid />
          <RecentActivityList />
        </div>
      </div>
    </div>
  );
}
