import React from "react";
import Card from "../../Common/Card";
import { Flame } from "lucide-react";
import CircularProgress from "../../Common/CircularProgress";

function RecentActivityList({ value }) {
  return (
    <div className="flex items-center gap-5">
      {/* rekor */}
      <Card className=" w-full flex justify-between px-5 items-center h-[150px]">
        <div className="">
          <h1 className="text-heading-4">Ritme Belajar Mingguan</h1>
          <p className="text-body-xs-regular text-gray-500">
            Pertahankan rekor belajarmu agar tetap menyala!
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div className="text-right">
            <span className="text-heading-2 text-[#F19E04] font-semibold">
              10
            </span>
            <p className="text-body-xs-regular text-gray-500">Rekor saat ini</p>
          </div>
          <Flame size={100} className="text-[#F19E04]" />
        </div>
      </Card>
      {/* Target */}
      <Card className="w-full flex justify-between px-5 items-center h-[150px]">
        <div>
          <h1 className="text-heading-4">Ritme Belajar Mingguan</h1>
          <p className="text-body-xs-regular text-gray-500">
            Pertahankan rekor belajarmu agar tetap menyala!
          </p>
        </div>
        <div className="flex justify-center items-center gap-2.5">
          <div className="text-right">
            <span className="text-heading-2 text-success font-semibold">7</span>
            <p className="text-body-xs-regular text-gray-500">
              jumlah tes selesai
            </p>
          </div>
          <CircularProgress value={7} maxValue={10} />
        </div>
      </Card>
    </div>
  );
}

export default RecentActivityList;
