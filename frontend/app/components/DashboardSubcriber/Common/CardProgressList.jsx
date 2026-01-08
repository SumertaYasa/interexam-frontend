import { Link } from "react-router";
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function CardProgressList({
  label = "paket soal",
  path = "#",
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
    <Card className="w-full">
      <Link to={toProp} className="p-5 flex justify-between items-center">
        <div className="flex items-center gap-4 w-full">
          <div className="w-[50px] h-[50px] overflow-hidden rounded-[4px]">
            <img src={image} alt={formatAlt} className="w-full" />
          </div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight leading-none line-clamp-1">
            {label}
          </h2>
        </div>

        {(() => {
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
      </Link>
    </Card>
  );
}

export default CardProgressList;
