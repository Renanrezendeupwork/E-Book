import React, { useEffect, useState } from "react";
import { Achievement } from "../../../models/achievements";
import { IconJumbotron } from "../../common/icons";
import AchievementBlock from "./achievementBlock";

type Props = {
  achievements: Achievement[];
};

const LockedAchievements: React.FC<Props> = ({ achievements }) => {
  const [groups, setGroups] = useState<
    { [key: string]: Achievement[] } | false
  >(false);
  useEffect(() => {
    const set_groups: { [key: string]: Achievement[] } = {};
    achievements.forEach((a) => {
      if (!set_groups[a.group]) {
        set_groups[a.group] = [];
      }
      set_groups[a.group].push(a);
      set_groups[a.group].sort((a, b) => (a.badge < b.badge ? -1 : 1));
    });
    setGroups(set_groups);
  }, [achievements]);

  return (
    <div className="">
      {groups ? (
        Object.keys(groups).map((key) => {
          const achieve = groups[key];
          return (
            <div className="achievements_cont">
              {achieve.map((item) => (
                <AchievementBlock
                  item={item}
                  key={`AchievementBlock_${item.id}`}
                />
              ))}
            </div>
          );
        })
      ) : (
        <IconJumbotron
          icon="far fa-trophy-alt"
          txt="Wow!"
          classes="text-success my-3"
          help_text="You have completed all the achievements 🎉"
        />
      )}
    </div>
  );
};

export default LockedAchievements;
