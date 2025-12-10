import { Link } from "react-router";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function CardProgress({
  label = "paket soal",
  path = ":id",
  image = "/person.jpg",
  progress,
}) {
  const formatAlt = image.split("/").pop().split(".")[0];
  return (
    <Card className="w-[320px]">
      <Link to={path} className=" h-[200px] flex flex-col">
        <div className="w-full h-[150px] overflow-hidden rounded-[9px_9px_0_0]">
          <img src={image} alt={formatAlt} className="w-full" />
        </div>
        <div className="p-5 flex flex-col gap-2.5">
          <h2 className="font-semibold line-clamp-1">{label}</h2>
          <ProgressBar value={progress} />
        </div>
      </Link>
    </Card>
  );
}

export default CardProgress;
