import React from "react";
import SelectSearch from "react-select-search";
import { Link } from "react-router-dom";

import { ButtonTootip } from "../../common/buttons";
import { IconJumbotron } from "../../common/icons";
import { RenderScores } from "../../common/score-elements";
import { ListFiltersProps, QuizTableProps, ResponseRowProps } from "./models";
import { RetakeRender } from "../../common/retakes";

const QuizTable: React.FC<QuizTableProps> = ({
  students,
  filterStudents,
  filter,
  book_id,
  handleSelectClass,
  refetch,
  class_selected,
  filterOptions,
  classGroups,
}) => (
  <div className="card my-4">
    <div className="card-header ">
      <div className="d-flex justify-content-between align-items-center">
        Students Quiz Results{" "}
        <ListFilters filterStudents={filterStudents} filter={filter} />{" "}
      </div>
      <div className="mt-2">
        <SelectSearch
          search
          onChange={handleSelectClass}
          value={class_selected?.value}
          emptyMessage="Class not found"
          filterOptions={filterOptions}
          options={classGroups}
          placeholder="Filter by Class Group"
        />
      </div>
    </div>
    {students.length > 0 ? (
      <table className="table bg-light ">
        <tbody>
          <tr className="text-center">
            <th>Student</th>
            <th>Class</th>
            <th>Score</th>
            <th>Actions</th>
          </tr>
          {students.map((student) => (
            <ResponseRow
              key={`student_key_${student.id}`}
              student={student}
              book_id={book_id}
              refetch={refetch}
            />
          ))}
        </tbody>
      </table>
    ) : (
      <IconJumbotron
        txt="No students"
        help_text="match this filter"
        icon="far fa-user"
        classes="my-5"
        txt_classes="m-0 text-dark"
        help_txt_classes="m-0 text-dark"
      />
    )}
  </div>
);

const ListFilters: React.FC<ListFiltersProps> = ({
  filterStudents,
  filter,
}) => (
  <div>
    <span className="badge badge-light mr-2">Filters:</span>
    <ButtonTootip
      id="only_respondeds"
      tooltip_txt="Show passed only "
      onClick={filterStudents}
      data_value="passed"
      type="link"
      className={`${
        filter === "passed" ? "text-success" : "text-muted"
      } p-0 m-0 no_focus`}
    >
      <span className="fa-stack small">
        <i className="far fa-square fa-stack-2x"></i>
        <i className="fa fa-check fa-stack-1x "></i>
      </span>
    </ButtonTootip>
    <ButtonTootip
      id="only_missing"
      tooltip_txt="Show missing only "
      onClick={filterStudents}
      data_value="missing"
      type="link"
      className={`${
        filter === "missing" ? "text-success" : "text-muted"
      } p-0 m-0 no_focus`}
    >
      <span className="fa-stack small">
        <i className="far fa-square fa-stack-2x"></i>
        <i className="fa fa-minus fa-stack-1x "></i>
      </span>
    </ButtonTootip>
    <ButtonTootip
      id="only_failed"
      tooltip_txt="Show failed only "
      onClick={filterStudents}
      data_value="failed"
      type="link"
      className={`${
        filter === "failed" ? "text-success" : "text-muted"
      } p-0 m-0 no_focus`}
    >
      <span className="fa-stack small">
        <i className="far fa-square fa-stack-2x"></i>
        <i className="fas fas fa-times fa-stack-1x "></i>
      </span>
    </ButtonTootip>
    <ButtonTootip
      id="only_requested"
      tooltip_txt="Show Retake Requested Only"
      onClick={filterStudents}
      data_value="requested"
      type="link"
      className={`${
        filter === "requested" ? "text-success" : "text-muted"
      } p-0 m-0 no_focus`}
    >
      <span className="fa-stack small">
        <i className="far fa-square fa-stack-2x"></i>
        <i className="fas fa-user-clock fa-stack-1x "></i>
      </span>
    </ButtonTootip>
  </div>
);

const ResponseRow: React.FC<ResponseRowProps> = ({
  student,
  book_id,
  refetch,
}) => {
  const history =
    student.history && student.history.length > 0
      ? student.history[0]
      : { score: 0, allow_retake: null, request_retake: null };
  return (
    <tr>
      <td>
        <Link to={`/student/${student.id}`} className="text-dark">
          {student.name}
        </Link>
      </td>
      <td className="text-center">{student.class.name}</td>
      <td className="text-center">
        {" "}
        <RenderScores score={history.score || null} />
      </td>
      <td className="text-right">
        <RetakeRender refetch={refetch} student={student} history={history} />
        <ButtonTootip
          id={`view_result_${student.id}`}
          tooltip_txt="View Responses"
          link={`/student/${student.id}/responses/${book_id}`}
          type="link"
          className="mx-1 text-muted"
          disabled={!history.score}
        >
          <i className="far fa-eye"></i>
        </ButtonTootip>
        <ButtonTootip
          id={`view_student_${student.id}`}
          tooltip_txt="View Student"
          type="link"
          link={`/student/${student.id}`}
          className="mx-1 text-muted"
        >
          <i className="far fa-user"></i>
        </ButtonTootip>
      </td>
    </tr>
  );
};

export default QuizTable;
