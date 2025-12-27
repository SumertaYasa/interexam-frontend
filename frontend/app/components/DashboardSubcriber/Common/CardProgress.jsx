import { Link } from "react-router";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function CardProgress({
  label = "paket soal",
  path = ":id",
  linkState = null,
  image = "/person.jpg",
  progress,
}) {
  const formatAlt = image.split("/").pop().split(".")[0];
  const toProp =
    typeof path === "string"
      ? linkState
        ? { pathname: path, state: linkState }
        : path
      : path;

  return (
    <Card className="w-[320px]">
      <Link to={toProp} className=" h-[200px] flex flex-col">
        <div className="w-full h-[150px] overflow-hidden rounded-[9px_9px_0_0]">
          <img src={image} alt={formatAlt} className="w-full" />
        </div>
        <div className="p-5 flex flex-col gap-2.5">
          <h2 className="font-semibold line-clamp-1">{label}</h2>
          {(() => {
            // progress can be a number (percent) or an object { answered, totalSoal|total }
            const pbProps = {};
            if (progress && typeof progress === "object") {
              const answered = progress.answered ?? progress.answeredCount ?? 0;
              const total =
                progress.total ??
                progress.totalSoal ??
                progress.totalQuestions ??
                0;
              pbProps.answered = answered;
              pbProps.total = total;
            } else {
              pbProps.value = Number(progress) || 0;
            }
            return <ProgressBar {...pbProps} />;
          })()}
        </div>
      </Link>
    </Card>
  );
}

export default CardProgress;
