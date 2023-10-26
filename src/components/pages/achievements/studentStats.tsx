import React, { useEffect, useState } from "react";
import { mins_to_hours } from "../../../middleware/common-functions";
import { ClassItem } from "../../../models/classes";
import { StatsItem } from "../../../models/stats";
import { StudentItem } from "../../../models/student";

type StudentStatsProps = {
  selected_class: ClassItem | null | undefined;
  students?: StudentItem[];
  stats?: StatsItem[];
};

const StudentStats: React.FC<StudentStatsProps> = ({
  selected_class,
  students,
  stats,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [allStats, setAllStats] = useState<StatsItem[]>([]);
  const [classStats, setClassStats] = useState<StatsItem[]>([]);
  useEffect(() => {
    setClassStats([]);
    if (stats) {
      const set_all_stats: StatsItem[] = [];
      stats.forEach((stat) => {
        if (set_all_stats.find((s) => s.id === stat.id)) {
          const index = set_all_stats.findIndex((s) => s.id === stat.id);
          set_all_stats[index].value += Number(stat.value);

          return;
        }

        set_all_stats.push({
          name: stat.name,
          value: stat.value,
          id: stat.id,
          icon: stat.icon,
          type: stat.type,
        });
      });
      setAllStats(set_all_stats);
      if (selected_class) {
        let set_class_stats = stats.filter(
          (item) => item.class_id === selected_class.value
        );
        if (set_class_stats.length === 0) {
          set_class_stats = [
            {
              name: "Total books all of your classes read",
              value: 0,
              id: "2",
              icon: "fas fa-books",
              type: "number",
              class_id: selected_class.value,
            },
            {
              name: "Total time all of your classes read",
              value: 0,
              id: "3",
              icon: "fas fa-stopwatch",
              type: "minutes",
              class_id: selected_class.value,
            },
          ];
        }
        setClassStats(set_class_stats);
      }
    }
  }, [stats, selected_class]);

  return (
    <div className="student_stats">
      <h1>Students Stats</h1>
      <div className="row">
        <div className="col-md-10">
          <table className="table bg-light">
            <tbody>
              {user.is_teacher ? (
                <Tr
                  title="Number of students:"
                  value={students?.length || "0"}
                  icon="fas fa-users-class"
                />
              ) : null}
              {allStats.map((item) => (
                <Tr
                  key={`${item.name}-${item.value}`}
                  title={item.name}
                  value={
                    item.type === "minutes"
                      ? mins_to_hours(item.value || 0)
                      : item.value || "0"
                  }
                  icon={item.icon}
                />
              ))}
              {classStats && selected_class
                ? classStats.map((item) => (
                    <Tr
                      key={`class_${item.name}-${item.value}`}
                      title={`${item.name} in class ${selected_class.txt}`}
                      value={
                        item.type === "minutes" && item.value
                          ? mins_to_hours(item.value || 0)
                          : item.value || "0"
                      }
                      icon={item.icon}
                    />
                  ))
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Tr: React.FC<{ title: string; icon: string; value: string | number }> = ({
  title,
  value,
  icon,
}) => (
  <tr>
    <td>
      <i className={`opacity_6 ${icon}`}></i>{" "}
    </td>
    <td className="font-weight-bold">{title}:</td>
    {/* <th scope="row">{title}:</th> */}
    <td>{value}</td>
  </tr>
);

export default StudentStats;
