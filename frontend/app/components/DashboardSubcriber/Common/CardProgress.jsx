import { Link } from "react-router";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function CardProgress({
  label = "paket soal",
  path = "#",
  image = "/person.jpg",
  progress,
}) {
  const formatAlt = image.split("/").pop().split(".")[0];
  return (
    <Card className="w-full">
      <Link to={path} className=" h-[200px] flex flex-col">
        <div className="w-full h-[150px] overflow-hidden">
          <img src={image} alt={formatAlt} className="w-full" />
        </div>
        <div className="p-5">
          <h2>{label}</h2>
          <ProgressBar value={progress} />
        </div>
      </Link>
    </Card>
  );
}

export default CardProgress;
