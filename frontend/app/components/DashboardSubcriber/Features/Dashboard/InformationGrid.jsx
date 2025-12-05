import React from "react";
import { CircleCheckBig, TrendingUp, Clock } from "lucide-react";
import CardInformation from "../../Common/CardInformation";

export function InformationGrid() {
  const dataCardInformation = [
    {
      id: 1,
      icon: CircleCheckBig,
      label: "total ujian diselesaikan",
      value: 20,
      messageInformation: "+2 dari minggu lalu",
      messageAlert: "Pertahankan ritmemu minggu ini.",
    },
    {
      id: 2,
      icon: CircleCheckBig,
      label: "total ujian diselesaikan",
      value: 20,
      messageInformation: "+2 dari minggu lalu",
      messageAlert: "Pertahankan ritmemu minggu ini.",
    },
    {
      id: 3,
      icon: CircleCheckBig,
      label: "total ujian diselesaikan",
      value: 20,
      messageInformation: "+2 dari minggu lalu",
      messageAlert: "Pertahankan ritmemu minggu ini.",
    },
  ];
  return (
    <div className="w-full flex  items-center gap-5">
      {dataCardInformation.map((card) => (
        <CardInformation
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.value}
          messageInformation={card.messageInformation}
          messageAlert={card.messageAlert}
          className=""
        />
      ))}
    </div>
  );
}

export default InformationGrid;
