import React from "react";
import Card from "./Card";
import { ArrowUpRight } from "lucide-react";

function CardInformation({
  icon: Icon,
  label,
  value,
  messageInformation,
  messageAlert,
  className,
}) {
  return (
    <Card className={`w-full ${className}`}>
      <div className=" p-6 ">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            {Icon && <Icon size={20} />}
          </div>
          <h3 className="text-sm font-bold text-slate-800">{label}</h3>
        </div>

        <div className="flex items-end gap-3 mb-2">
          <span className="text-4xl font-black text-slate-900 leading-none">
            {value}
          </span>
          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-md text-[10px] font-bold mb-1">
            <ArrowUpRight size={12} />
            <span>{messageInformation} dari minggu lalu</span>
          </div>
        </div>
        <p className="text-xs text-slate-400 font-medium">{messageAlert}</p>
      </div>
    </Card>
  );
}

export default CardInformation;
