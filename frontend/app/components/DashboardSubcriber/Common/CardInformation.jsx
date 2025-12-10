import React from "react";
import Card from "./Card";

function CardInformation({
  icon: Icon,
  label,
  value,
  messageInformation,
  messageAlert,
}) {
  return (
    <Card className="w-full">
      <div className="p-5 flex flex-col  items-start gap-4">
        <div className="flex justify-center items-center gap-2.5">
          <div className=" rounded p-1 bg-primary/80">
            <Icon className="text-white" />
          </div>
          <span>{label}</span>
        </div>
        <div className="flex justify-between items-center w-full ">
          <span className="text-heading-2 font-semibold ">{value}</span>
          <div className="flex flex-col gap-2.5">
            <p className="text-body-s-regular bg-green-400 w-fit px-1 py-0.5 text-white rounded-[2px]">
              {messageInformation}
            </p>
            <p className="text-body-xxs-demilight text-gray-500">
              {messageAlert}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CardInformation;
