import { Link } from "react-router";
import Card from "./Card";
import { Star } from "lucide-react";

function SmallBadge({ children }) {
  return (
    <span className="text-xs py-1 px-2 rounded-full border flex items-center gap-1 border-gray-200 bg-white text-gray-700">
      {children}
    </span>
  );
}

function CardCourseList({
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
    <Card className="w-full">
      <Link
        to={toProp}
        className="flex items-center gap-4 px-5 py-4 hover:shadow-sm transition-shadow duration-200"
      >
        <div className="w-[60px] h-[60px] flex-shrink-0 overflow-hidden rounded-[8px] bg-slate-100">
          <img
            src={image}
            alt={formatAlt}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-body-s-medium line-clamp-1">
            {title}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <SmallBadge>
            <Star size={18} color="#F19E04" /> <span>{rating} </span>
          </SmallBadge>
          <SmallBadge>{totalSoal} Soal</SmallBadge>
          <SmallBadge>
            {participants.toLocaleString("id-ID")} orang yang mengerjakan
          </SmallBadge>
          <SmallBadge>{category}</SmallBadge>
        </div>
      </Link>
    </Card>
  );
}

export default CardCourseList;
