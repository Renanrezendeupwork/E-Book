import React from "react";
import { Leaderboard } from "../../../models/achievements";
import { IconJumbotron } from "../../common/icons";

type ClassLeaderboardProps = {
  leaderboard: Leaderboard[];
  user_id: string;
  is_teacher: boolean;
  class_selected?: string;
};

const ClassLeaderboard: React.FC<ClassLeaderboardProps> = ({
  leaderboard,
  user_id,
  is_teacher,
  class_selected,
}) => {
  const leaderboard_data = leaderboard.filter(
    (leader) => !class_selected || leader.student.class.id === class_selected
  );
  if (leaderboard_data.length === 0) {
    return (
      <IconJumbotron txt="No one's here" icon="fad fa-crown" classes="py-3" />
    );
  }
  return (
    <table className="table bg-light">
      <thead>
        <tr>
          <th>Place </th>
          <th> Name </th>
          {is_teacher ? <th>Class</th> : null}
          <th> Badges </th>
        </tr>
      </thead>
      <tbody>
        {leaderboard_data.map((leader, index) => (
          <tr
            key={`leaderboard_${index}`}
            className={`${
              leader.student.id === user_id
                ? "text-success"
                : leader.points === 0
                ? "text-muted"
                : ""
            } ${index === 0 && leader.points > 0 ? "p-4" : ""}`}
          >
            {leader.points ? (
              <td>
                #{index + 1}
                {index === 0 && leader.points > 0 ? (
                  <i className="text_gold fad fa-crown ml-2"></i>
                ) : null}
              </td>
            ) : (
              <td></td>
            )}
            <td>{leader.student.name}</td>
            {is_teacher ? <td>{leader.student.class.name}</td> : null}
            <td className="text-center">
              {leader.points || <span className="text-muted">-</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClassLeaderboard;
