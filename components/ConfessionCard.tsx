import { PropsWithChildren } from "react";
import { Confession } from "../app/types";

export const ConfessionCardWrapper = ({
  children,
  onHomePage = false,
}: PropsWithChildren<{ onHomePage?: boolean }>) => {
  return (
    <div
      className={`card ${
        onHomePage && "w-96 h-64"
      } bg-base-100 shadow-lg text-ellipsis`}
    >
      <div className="card-body">{children}</div>
    </div>
  );
};

const ConfessionCard = ({
  confession,
  onHomePage,
}: {
  confession: Confession;
  onHomePage: boolean;
}) => {
  const confessionDate = new Date(confession.time);
  const confessionNumber = confession.post_text.split(" ")[0];

  return (
    <ConfessionCardWrapper onHomePage={onHomePage}>
      <div className="flex flex-row">
        <h2 className="card-title">{confessionNumber}</h2>
        <span className="ml-auto">
          {confessionDate.toLocaleDateString([], {
            day: "numeric",
            month: "numeric",
            year: "2-digit",
          })}
          ,&nbsp;
          {confessionDate.toLocaleTimeString([], {
            hour: "numeric",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p
        className={`block ${
          onHomePage && "h-32"
        } overflow-auto whitespace-pre-wrap`}
      >
        {confession.post_text}
      </p>
      <p>
        <a className="link" href={confession.post_url}>
          View on Facebook
        </a>
      </p>
    </ConfessionCardWrapper>
  );
};

export default ConfessionCard;