import React from "react";
import { Link } from "react-router-dom";
import { NumericType, StringType, toDate } from "../../../middleware/dates";
import { AssignmentItem } from "../../../models/assignment";

type AssigmentProps = {
  assignment: AssignmentItem;
};
const Assigment: React.FC<AssigmentProps> = ({ assignment }) => (
  <div
    className="assignment_cont"
    style={{ backgroundImage: `url(${assignment.book!.images?.cover})` }}
  >
    <div className="container_info">
      <h2>{assignment.book!.title}</h2>
      <h3>{assignment.title}</h3>
      <p>{assignment.message}</p>
      <div className="div">
        {assignment.class ? (
          <span className="badge badge-danger mr-3">
            Class: {assignment.class.name}
          </span>
        ) : null}
        <span className="badge badge-danger">
          Due:{" "}
          {toDate(assignment.end_time, {
            day: NumericType.Digit,
            month: StringType.Long,
          })}
        </span>
      </div>
      <div className="ctas">
        <Link
          to={`/bookdetails/${assignment.book!.url}/${assignment.book!.id}`}
          className="btn btn-outline-light btn_round mt-3 green_outline_gray"
        >
          Go to Reader
        </Link>
      </div>
    </div>
  </div>
);

export default Assigment;
