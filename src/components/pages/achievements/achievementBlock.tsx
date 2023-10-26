import React from "react";
import { Grade, Achievement } from "../../../models/achievements";
import { toDate } from "../../../middleware/dates";

type AchievementBlockProps = {
  item: Achievement;
};
const AchievementBlock: React.FC<AchievementBlockProps> = ({ item }) => (
  <div className={`achievement_block`}>
    <img
      src={`${process.env.REACT_APP_IMAGES_URL}/${
        item.completed ? item.badge : item.badge_fade
      }`}
      alt={item.title}
    />
    <h6>
      <Trophy grade={item.grade} />
      {item.title}
    </h6>
    <p>
      {item.desc}
      <br />
      {item.completed ? <small>{toDate(item.completed_at)}</small> : null}
    </p>
  </div>
);

type TrophyProps = {
  grade: Grade;
};
const Trophy: React.FC<TrophyProps> = ({ grade }) => {
  switch (grade) {
    case "bronze":
      return <i className="mr-2 text_bronze fas fa-trophy"></i>;
    case "silver":
      return <i className="mr-2 text_silver fad fa-trophy"></i>;
    case "gold":
      return <i className="mr-2 text_gold fas fa-trophy-alt "></i>;
    case "platinum":
      return <i className="mr-2 text_platinum fad fa-trophy-alt"></i>;

    default:
      return <i className="mr-2 fas fa-trophy"></i>;
  }
};

export default AchievementBlock;
