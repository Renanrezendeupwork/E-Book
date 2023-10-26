import React from "react";
import { mins_to_hours } from "../../../middleware/common-functions";

type StudentTimerProps = {
  read_time: number;
  active_reading: boolean;
};
const StudentTimer: React.FC<StudentTimerProps> = ({
  read_time,
  active_reading,
}) => {
  if (read_time === 0) {
    return null;
  }
  const show_time = mins_to_hours(read_time);
  return (
    <div className={`mr-2 ${active_reading ? "" : "opacity_5"}`}>
      <i
        className={`${
          active_reading ? "far fa-stopwatch" : "far fa-pause-circle"
        }  mr-1`}
      ></i>
      {show_time}
    </div>
  );
};

export default StudentTimer;
