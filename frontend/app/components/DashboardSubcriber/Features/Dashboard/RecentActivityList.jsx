import React from "react";
import Card from "../../Common/Card";
import { Flame } from "lucide-react";
import CircularProgress from "../../Common/CircularProgress";

function RecentActivityList({ value }) {
  return (
    <div className="flex ">
      {/* rekor */}
      <Card className=" w-full flex justify-between items-center">
        <div>
          <h1 className="text-heading-4">Ritme Belajar Mingguan</h1>
          <p className="text-body-xs-regular text-gray-300">
            Pertahankan rekor belajarmu agar tetap menyala!
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <span className="text-heading-2">{value}</span>
            <p className="text-body-xs-regular text-gray-300">Rekor saat ini</p>
          </div>
          <Flame size={45} />
        </div>
      </Card>
      {/* Target */}
      <Card className="flex w-full justify-between items-center">
        <div>
          <h1 className="text-heading-4">Ritme Belajar Mingguan</h1>
          <p className="text-body-xs-regular text-gray-300">
            Pertahankan rekor belajarmu agar tetap menyala!
          </p>
        </div>
        <div className="flex justify-center items-center">
          <div>
            <span className="text-heading-2">{value}</span>
            <p className="text-body-xs-regular text-gray-300">Rekor saat ini</p>
          </div>
          <CircularProgress value={7} maxValue={10} />
        </div>
      </Card>
    </div>
  );
}

export default RecentActivityList;
