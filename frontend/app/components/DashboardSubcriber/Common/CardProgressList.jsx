import { Link } from "react-router";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function CardProgressList({
  label = "paket soal",
  path = "#",
  image = "/person.jpg",
  progress,
}) {
  const formatAlt = image.split("/").pop().split(".")[0];
  return (
    <Card className="w-full">
      <Link to={path} className=" p-5 flex justify-between items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="w-[50px] h-[50px] overflow-hidden rounded-[4px]">
            <img src={image} alt={formatAlt} className="w-full" />
          </div>
          <h2 className="font-semibold line-clamp-1">{label}</h2>
        </div>

        <ProgressBar value={progress} />
      </Link>
    </Card>
  );
}

export default CardProgressList;
