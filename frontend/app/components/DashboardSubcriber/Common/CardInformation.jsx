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
          <Icon />
          <span>{label}</span>
        </div>
        <div className="flex justify-center items-center gap-5">
          <span className="text-heading-2">{value}</span>
          <div className="flex flex-col gap-2.5">
            <p>{messageInformation}</p>
            <p>{messageAlert}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default CardInformation;
