import React from "react";
import CourseContainer from "../../../components/DashboardSubcriber/Features/Course/CourseContainer";
export function meta() {
  return [
    { title: "InterExam" },
    { name: "description", content: "Welcome to InterExam" },
  ];
}

export default function DashboardCourse() {
  return (
    <div className="w-full pb-7-5">
      <div className="">
        <h1 className="text-heading-4 font-bold mb-2.5">Latihan</h1>
        <div className="w-full h-full flex flex-col gap-5">
          <CourseContainer />
        </div>
      </div>
    </div>
  );
}
