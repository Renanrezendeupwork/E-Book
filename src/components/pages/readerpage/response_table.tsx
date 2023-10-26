import React from "react";
import { Link } from "react-router-dom";
import { toDate } from "../../../middleware/dates";
import { HistoryItem } from "../../../models/student";
import ChapterRetakeBtn from "../grades/chapterRetakeBtn";

import { ResponseTableProps } from "./models";
import { UserSettings } from "../../../models/user";

const ResponseTable: React.FC<ResponseTableProps> = ({
  questions,
  student,
  requestRetake,
  allow_retake,
  refetch,
  loading,
  book_url,
  book_id,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const settings: UserSettings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );
  const history: HistoryItem | false =
    student && student.history.length > 0 ? student.history[0] : false;
  return (
    <div className="card my-4">
      <div className="card-header text-center">
        {user.is_teacher
          ? allow_retake
            ? student
              ? `${student.name} Responses `
              : "Student Responses"
            : "My Responses"
          : "Book Quiz"}
      </div>
      <table className="table bg-light ">
        <tbody>
          <tr>
            <th>Chapter</th>
            <th>Responses</th>
            <th>{allow_retake ? "Grade" : "Date"}</th>
          </tr>
          {questions.map((question, key) => {
            let disable_allow = true;
            let correct_answers = 0;
            return (
              <tr key={`question_tr_${key}`}>
                <td className="text-center">{question.chapter}</td>
                <td>
                  {question.responses!.map((response, key_2) => {
                    if (
                      disable_allow === true &&
                      typeof response.correct == "boolean"
                    ) {
                      disable_allow = false;
                    }
                    if (response.correct) {
                      correct_answers++;
                    }

                    return (
                      <i
                        key={`response_li_option_${key}_${key_2}`}
                        className={`m-1 fa-fw ${
                          response.correct
                            ? "fa fa-check text-success"
                            : response.correct === false
                            ? "fa fa-times text-danger"
                            : "fa fa-minus text-muted opacity_5"
                        }`}
                        aria-hidden="true"
                      ></i>
                    );
                  })}
                </td>
                {allow_retake && student ? (
                  <td className="text-left position-relative">
                    {" "}
                    <ChapterRetakeBtn
                      grade={correct_answers}
                      question_num={question.responses?.length || 0}
                      disabled={disable_allow}
                      requested_retake={question.requested_retake}
                      chapter={question.chapter}
                      book_id={book_id}
                      student_id={student.id}
                      refetch={refetch}
                    />
                  </td>
                ) : (
                  <td>{toDate(question.updated)}</td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {history && history.score ? (
        history.request_retake === null || settings.allow_retakes ? (
          <div className="card-footer text-right">
            <button
              className="btn btn-danger"
              onClick={requestRetake}
              disabled={loading}
            >
              {loading
                ? "Requesting..."
                : settings.allow_retakes
                ? "Reset All"
                : "Request Retake"}
            </button>

            <small className="d-block">
              <i className="fal fa-info-circle mr-1"></i>
              {settings.allow_retakes
                ? "Resetting will remove your previous score and responses"
                : "Your teacher will allow or deny your retake request"}
            </small>
          </div>
        ) : history.allow_retake ? (
          <div className="card-footer text-right">
            <Link className="btn btn-primary" to={book_url}>
              Retake Quiz
            </Link>
          </div>
        ) : (
          <div className="card-footer text-right">
            {user.is_teacher ? (
              <small className=" ">
                <i className="fal fa-info-circle"></i> Allow retakes by chapter
                by clicking on the chapter score
              </small>
            ) : (
              <p className="text-muted">
                Retake Requested on {toDate(history.request_retake)} <br />
                Waiting for your teacher response
              </p>
            )}
          </div>
        )
      ) : user.is_teacher ? (
        <div className="card-footer text-right">
          <small className=" ">
            <i className="fal fa-info-circle"></i> Allow retakes by chapter by
            clicking on the chapter score
          </small>
        </div>
      ) : null}
    </div>
  );
};

export default ResponseTable;
