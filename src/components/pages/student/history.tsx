import React from "react";
import { Link } from "react-router-dom";
import { RenderScores } from "../../common/score-elements";
import { toDate } from "../../../middleware/dates";
import { HistoryItem as HistoryItemProps } from "../../../models/student";
import { IconJumbotron, RatingStars } from "../../common/icons";
import { UserItem } from "../../../models/user";

const History: React.FC<{
  data: HistoryItemProps[];
  handleSelectBook: any;
  student_name: string;
  hide_score?: boolean;
}> = ({ data, handleSelectBook, student_name, hide_score }) => (
  <div className="card card-default">
    <div className="card-body">
      <div className="card-title">Reading History</div>
      {data.length > 0 ? (
        <TableHistory
          handleSelectBook={handleSelectBook}
          history={data}
          hide_score={hide_score}
        />
      ) : (
        <IconJumbotron
          icon="fas fa-book"
          txt={`${student_name} has not read any books yet`}
          txt_classes="text-dark mt-2"
        />
      )}
    </div>
  </div>
);

const TableHistory: React.FC<{
  history: HistoryItemProps[];
  handleSelectBook: any;
  hide_score?: boolean;
}> = ({ history, handleSelectBook, hide_score }) => (
  <table className="table table-striped">
    <thead>
      <tr>
        <th>Book</th>
        <th className="xs_hidden">Date Start</th>
        <th className="xs_hidden">Last Viewed</th>
        <th>Read Chapters </th>
        <th>Total Time </th>
        <th>Rating </th>
        {hide_score ? null : <th>Score </th>}
      </tr>
    </thead>
    <tbody>
      {history.map((item, key) => (
        <HistoryItem
          data={item}
          key={`history_item_${key}`}
          handleSelectBook={handleSelectBook}
          hide_score={hide_score}
        />
      ))}
    </tbody>
  </table>
);

const HistoryItem: React.FC<{
  data: HistoryItemProps;
  handleSelectBook: any;
  hide_score?: boolean;
}> = ({ data, handleSelectBook, hide_score }) => {
  const { book, chapter_last, chapter, score, allow_retake } = data;
  const last_chapter = chapter_last || chapter;
  const percentage = Math.floor((last_chapter * 100) / book.chapters);
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <tr>
      <td>
        <Link className="text-dark" to={`/bookdetails/${book.url}/${book.id}`}>
          {book.title}
        </Link>{" "}
      </td>
      <td className="xs_hidden">
        {" "}
        {data.start_time ? toDate(data.start_time) : "-"}{" "}
      </td>
      <td className="xs_hidden">
        {" "}
        {data.last_time ? toDate(data.last_time) : "-"}{" "}
      </td>
      <td>
        <div className="progress_cont tiny">
          <div className="progress_cont_tiny">
            <div className="progress" style={{ width: `${percentage}%` }}></div>
          </div>
          <span>
            {" "}
            {last_chapter}/{book.chapters} <small>({percentage}%)</small>
          </span>
        </div>
      </td>
      <td> {data.read_time} </td>
      <td className="xs_hidden text-truncate">
        {data.rating && data.rating.value ? (
          <RatingStars
            value={data.rating.value}
            id={`rating_Starts_${book.id}`}
          />
        ) : (
          "-"
        )}{" "}
      </td>
      {hide_score === true ? null : (
        <td className={`text-center text-truncate ${score ? "hovered" : ""}`}>
          {user.is_teacher ? (
            <button
              className={`btn   ${
                score ? "btn-outline-dark green_outline_gray" : "btn-outline-success  btn-sm"
              }`}
              onClick={handleSelectBook}
              data-book_id={book.id}
            >
              {score ? <RenderScores score={score} /> : "View Quiz"}{" "}
            </button>
          ) : (
            <RenderScores score={score || null} />
          )}
          <br />
          {allow_retake ? (
            <small className="text-muted">Retake Allowed</small>
          ) : null}
        </td>
      )}
    </tr>
  );
};

export default History;
