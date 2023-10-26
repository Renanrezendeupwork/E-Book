import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sortArray, SortBy } from "../../../hooks/useSort";
import { toDate } from "../../../middleware/dates";
import { AssignmentHistory } from "../../../models/assignment";
import { ClassItem } from "../../../models/classes";
import { IconJumbotron } from "../../common/icons";
import { RenderScores } from "../../common/score-elements";
import { ThSort } from "../../common/ui_elements";

type TableProps = {
  history: AssignmentHistory[];
  book_chapters: number;
  group?: ClassItem;
  handle_sort: any;
  sort_by: SortBy;
  refetch: () => void;
};
const Table: React.FC<TableProps> = ({
  history,
  book_chapters,
  group,
  handle_sort,
  sort_by,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  if (history.length < 1) {
    return (
      <div className="my-5">
        <IconJumbotron
          txt="No Data"
          classes="py-3"
          help_text={`None of your students ${
            group ? `in ${group.name}` : ""
          } has started this assignment`}
          icon="fad fa-calendar"
          cta={{
            txt: "Back to assignments",
            classes: "btn btn-primary green_contain_green",
            link: group ? `/assignments/${group.value}` : `/assignments/`,
          }}
        />
      </div>
    );
  }
  const data: AssignmentHistory[] = sortArray(
    history,
    sort_by.by,
    sort_by.sort
  );

  const handleRefetch = () => {
    refetch();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="container mt-3 mb-5">
      <div className="card">
        <div className="card-body">
          <div className="card-title d-flex justify-content-between">
            Assignment Data
            <button onClick={handleRefetch} className="btn ">
              <i className={`fas fa-sync-alt  ${loading ? "fa-spin" : ""}`}></i>
            </button>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <ThSort
                  type={
                    sort_by.by === "student.last_name"
                      ? sort_by.sort
                      : undefined
                  }
                  id="student.last_name"
                  handle_sort={handle_sort}
                  title="Student"
                />
                <ThSort
                  type={sort_by.by === "start_time" ? sort_by.sort : undefined}
                  id="start_time"
                  className="xs_hidden"
                  handle_sort={handle_sort}
                  title="Date Start"
                />
                <ThSort
                  type={sort_by.by === "last_time" ? sort_by.sort : undefined}
                  id="last_time"
                  className="xs_hidden"
                  handle_sort={handle_sort}
                  title="Last Viewed"
                />
                <ThSort
                  type={
                    sort_by.by === "chapter_last" ? sort_by.sort : undefined
                  }
                  id="chapter_last"
                  handle_sort={handle_sort}
                  title="Read Chapters "
                />
                <ThSort
                  type={sort_by.by === "read_time" ? sort_by.sort : undefined}
                  id="read_time"
                  handle_sort={handle_sort}
                  title="Total Time "
                />
                <ThSort
                  type={sort_by.by === "score" ? sort_by.sort : undefined}
                  id="score"
                  handle_sort={handle_sort}
                  title="Score "
                />
              </tr>
            </thead>
            <tbody>
              {data.map((history_data, key) => (
                <TableRow
                  key={`TableRow_${history_data.student.id}_${key}`}
                  history_data={history_data}
                  book_chapters={book_chapters}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type TableRowProps = {
  history_data: AssignmentHistory;
  book_chapters: number;
};
const TableRow: React.FC<TableRowProps> = ({ history_data, book_chapters }) => {
  const { chapter_last, chapter, score, allow_retake } = history_data;
  const last_chapter = chapter_last || chapter;
  const percentage = Math.floor((last_chapter * 100) / book_chapters);
  return (
    <tr className={`${percentage === 0 ? "opacity_8" : ""}`}>
      <td>
        <Link className="text-dark" to={`/student/${history_data.student.id}`}>
          {history_data.student.last_name} {history_data.student.first_name}
        </Link>{" "}
      </td>
      <td className="xs_hidden">
        {" "}
        {history_data.start_time ? toDate(history_data.start_time) : "-"}{" "}
      </td>
      <td className="xs_hidden">
        {" "}
        {history_data.last_time ? toDate(history_data.last_time) : "-"}{" "}
      </td>
      <td>
        {percentage === 0 ? (
          "-"
        ) : (
          <div className="progress_cont tiny">
            <div className="progress_cont_tiny">
              <div
                className="progress"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <span>
              {" "}
              {last_chapter}/{book_chapters} <small>({percentage}%)</small>
            </span>
          </div>
        )}
      </td>
      <td> {history_data.read_time === "0" ? "-" : history_data.read_time} </td>
      <td className={`text-center text-truncate ${score ? "hovered" : ""}`}>
        {score ? <RenderScores score={score} /> : "-"} <br />
        {allow_retake ? (
          <small className="text-muted">Retake Allowed</small>
        ) : null}
      </td>
    </tr>
  );
};

export default Table;
