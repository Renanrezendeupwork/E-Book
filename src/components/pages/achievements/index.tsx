import { useQuery } from "@apollo/client";
import SelectSearch from "react-select-search";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useHistory } from "react-router-dom";

import { Achievement, Leaderboard } from "../../../models/achievements";
import { filterOptions } from "../../../middleware/common-functions";
import { IconJumbotron } from "../../common/icons";
import AchievementBlock from "./achievementBlock";
import ClassLeaderboard from "./leaderboard";
import { GETACHIEVEMENTS } from "./queries";
import { ClassItem } from "../../../models/classes";
import { SelectSearchItem } from "../../../models/filters";
import StudentStats from "./studentStats";
import { StudentItem } from "../../../models/student";
import { StatsItem } from "../../../models/stats";
import LockedAchievements from "./locekdAchievements";

const AchievementsPage: React.FC = () => {
  const history = useHistory();
  const { class_id } = useParams<{ class_id?: string }>();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [class_selected, setClassSelected] = useState<ClassItem | null>();
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);
  const [students, setStudents] = useState<StudentItem[]>([]);
  const { data } = useQuery<{
    achievements: Achievement[];
    leaderboard: Leaderboard[];
    classes: ClassItem[];
    students: StudentItem[];
    stats: StatsItem[];
  }>(GETACHIEVEMENTS, {
    fetchPolicy: "no-cache",
  });
  const [achievements, setAchievements] = useState<{
    completed: Achievement[];
    locked: Achievement[];
    points: false | number;
  }>({ completed: [], locked: [], points: false });

  useEffect(() => {
    if (data && data.achievements) {
      let points = 0;
      const completed = data.achievements.filter((a) => {
        if (a.completed) {
          points += a.points;
        }
        return a.completed;
      });
      const locked = data.achievements.filter((a) => !a.completed);
      setAchievements({
        completed,
        locked,
        points,
      });
    }
    if (data?.classes) {
      setClasses();
      selectClass(class_id);
    }
    if (data?.students) {
      setStudents(data?.students);
    }
    //eslint-disable-next-line
  }, [data, class_id]);

  const setClasses = () => {
    if (!data?.classes) return;
    const groups: SelectSearchItem[] = data.classes.map((item: ClassItem) => {
      return { name: item.txt, value: item.value };
    });
    groups.push({ name: "- See All", value: "0" });
    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };

  const selectClass = (selected_id: any) => {
    if (!selected_id || selected_id === "0") {
      setClassSelected(null);
    } else {
      if (!data?.classes) return;
      const set_selected = data.classes.find(
        (g: ClassItem) => g.value === selected_id
      );
      setClassSelected(set_selected);
    }
  };

  const handleSelectClass = (selected_id: any) => {
    history.replace({
      pathname: `/achievements${
        selected_id && selected_id !== "0" ? `/${selected_id}` : ""
      }`,
    });
  };

  return (
    <main>
      <Helmet title="Your Achievements" />
      <div className="achievements_page container first-container py-3">
        <div className="row mt-3">
          <div className="col-md-8">
            <StudentStats
              selected_class={class_selected}
              students={students}
              stats={data?.stats || []}
            />
            <div className="heading ">
              <h1>Your Achievements</h1>
              {achievements.points > 0 ? (
                <div className="points green_dark">
                  {achievements.points.toLocaleString()}
                </div>
              ) : null}
            </div>

            {achievements.completed.length ? (
              <div className="achievements_cont">
                {achievements.completed.map((item, key) => (
                  <AchievementBlock
                    item={item}
                    key={`AchievementBlock${item.id}${key}`}
                  />
                ))}
              </div>
            ) : (
              <IconJumbotron
                txt="You don't have any badge unlocked"
                help_text="Keep going"
                icon="far fa-trophy-alt"
              />
            )}
            <h1>Locked Badges</h1>

            <LockedAchievements achievements={achievements.locked} />
          </div>
          <div className="col-md-4">
            <h3>{user.is_teacher ? "Students" : "Class"} Leaderboard</h3>
            {user.is_teacher ? (
              <div className="mb-3">
                {" "}
                <SelectSearch
                  search
                  onChange={handleSelectClass}
                  value={class_selected?.value}
                  emptyMessage="Class not found"
                  filterOptions={filterOptions}
                  options={classGroups}
                  placeholder="Select a Class Group"
                />
              </div>
            ) : null}
            {data && data.leaderboard && data.leaderboard.length > 0 ? (
              <ClassLeaderboard
                leaderboard={data.leaderboard}
                class_selected={class_selected?.value}
                user_id={user.id}
                is_teacher={user.is_teacher}
              />
            ) : (
              <IconJumbotron
                txt="No one's here"
                icon="fad fa-crown"
                classes="py-3"
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AchievementsPage;
