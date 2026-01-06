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
      icon: TrendingUp,
      label: "rata-rata skor",
      value: "84%",
      messageInformation: "+5% dari minggu lalu",
      messageAlert: "Fokus dan presisi terus meningkat.",
    },
    {
      id: 3,
      icon: Clock,
      label: "waktu belajar aktif",
      value: "5j 20m",
      messageInformation: "+20m dari minggu lalu",
      messageAlert: "Konsistensi adalah kunci kemajuanmu",
    },
  ];

  const slideSpeeds = {
    1: "slide-in-from-bottom-[2%]",
    2: "slide-in-from-bottom-[4%]",
    3: "slide-in-from-bottom-[6%]",
  };
  return (
    <div className="w-full flex  items-center gap-5 ">
      {dataCardInformation.map((card) => (
        <CardInformation
          key={card.id}
          icon={card.icon}
          label={card.label}
          value={card.value}
          messageInformation={card.messageInformation}
          messageAlert={card.messageAlert}
          className={`animate-in fade-in duration-500 ${slideSpeeds[card.id] || ""}`}
        />
      ))}
    </div>
  );
}

export default InformationGrid;
