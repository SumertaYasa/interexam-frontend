import React from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import Card from "./Card";

function CardPackage({
  label = "Paket Soal",
  path = "#",
  image = "/person.jpg",
  rating = 3,
  totalQuestion = 50,
  totalTaken = 5430,
  category = "Umum",
}) {
  const formatAlt = image.split("/").pop().split(".")[0];
  const classInformation = "flex items-center justify-center gap-2.5";

  return (
    <Card className={"overflow-hidden w-[400px] h-[350px]"}>
      <Link to={path} className="w-full h-full">
        <div>
          <img src={image} alt={formatAlt} className="w-full" />
        </div>
        <div className="px-[20px] py-[25px]">
          <span>{label}</span>
          <div className="flex flex-wrap gap-4">
            {/* rating */}
            <div className={classInformation}>
              <Star />
              <span>{rating}</span>
            </div>
            {/* total soal */}
            <div className={classInformation}>
              <span>{totalQuestion}</span>
              <span>soal</span>
            </div>
            {/* total mengerjakan */}
            <div className={classInformation}>
              <span>{totalTaken}</span>
              <span>yan mengerjakan</span>
            </div>
            {/* kategori paket */}
            <div className={classInformation}>
              <span>{category}</span>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default CardPackage;
