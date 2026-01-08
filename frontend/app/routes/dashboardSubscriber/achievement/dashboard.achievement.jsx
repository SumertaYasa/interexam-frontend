import React from "react";
import AchievementContainer from "../../../components/DashboardSubcriber/Features/Achievement/AchievmentContainer";
export function meta() {
  return [
    { title: "InterExam" },
    { name: "description", content: "Welcome to InterExam" },
  ];
}

export default function Achievement() {
  return (
    <div className="w-full pb-7-5">
      <div className="">
        <h1 className="text-heading-4 font-bold mb-2.5">Latihan</h1>
        <div className="w-full h-full flex flex-col gap-5">
          <AchievementContainer />
        </div>
      </div>
    </div>
  );
}
