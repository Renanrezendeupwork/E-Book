import React from "react";

type RenderScoresProps = { score: number | null };

export const RenderScores: React.FC<RenderScoresProps> = ({ score }) => {
  if (!score) return <i className={`ml-1  fa fa-minus`}></i>;
  const score_txt = `${score}/10`;
  const score_icon =
    score >= 7 ? "fa-check text-success" : "fa-times text-danger";
  return (
    <span>
      {score_txt} <i className={`ml-1 fas ${score_icon}`}></i>
    </span>
  );
};
