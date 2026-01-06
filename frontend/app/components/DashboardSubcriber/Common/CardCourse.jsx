import React from "react";
import { Link } from "react-router";
import { Star } from "lucide-react";
import Card from "./Card";

function SmallBadge({ children }) {
  return (
    <span className="text-[13px] font-bold py-1 px-2 rounded-full border flex items-center gap-1 border-gray-200 bg-white text-gray-700 tracking-tight leading-none">
      {children}
    </span>
  );
}

function CardCourse({
  id,
  title = "Judul Paket Soal",
  image = "/person.jpg",
  rating = 4.8,
  totalSoal = 50,
  participants = 1234,
  category = "Bahasa Inggris",
  path = "#",
  linkState = null,
}) {
  const formatAlt = image.split("/").pop().split(".")[0];

  const toProp =
    typeof path === "string"
      ? linkState
        ? { pathname: path, state: linkState }
        : path
      : path;

  return (
    <Card className={"overflow-hidden w-[400px] h-[350px]"}>
      <Link to={toProp} className="w-full h-full">
        <div className="w-full h-[150px] overflow-hidden">
          <img src={image} alt={formatAlt} className="w-full" />
        </div>
        <div className="px-5 py-4">
          <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-tight line-clamp-1 mb-2">
            {title}
          </h3>
          <div className="flex items-center flex-wrap gap-2">
            <SmallBadge>
              <Star size={14} color="#F19E04" fill="#F19E04" />
              <span className="ml-0.5">{rating}</span>
            </SmallBadge>
            <SmallBadge>{totalSoal} Soal</SmallBadge>
            <SmallBadge>
              {participants.toLocaleString("id-ID")} orang yang mengerjakan
            </SmallBadge>
            <SmallBadge>{category}</SmallBadge>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default CardCourse;
