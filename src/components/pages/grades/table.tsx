import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { sortArray, SortBy } from "../../../hooks/useSort";

import { Grades, GradeItem } from "../../../models/grades";
import { ReaderItem } from "../../../models/reader";
import { StudentItem } from "../../../models/student";
import { OverAllRender, RetakeRender } from "../../common/retakes";
import { ThSort } from "../../common/ui_elements";
import ChapterRetakeBtn from "./chapterRetakeBtn";

type GradesTableProps = {
  grades_data: Grades[];
  refetch: any;
  handleSelectBook?: any;
  handle_sort?: any;
  show_student: boolean;
  sort_by?: SortBy;
};

const GradesTable: React.FC<GradesTableProps> = ({
  grades_data,
  refetch,
  show_student,
  handleSelectBook,
  sort_by,
  handle_sort,
}) => {
  const columns = [];
  const [leftStyle, setLeft] = useState({});
  const [rightStyle, setRight] = useState({});
  const name_el = useRef<HTMLTableCellElement>(null);
  const retake_el = useRef<HTMLTableCellElement>(null);
  const data = sort_by
    ? sortArray(grades_data, sort_by.by, sort_by.sort)
    : grades_data;

  useEffect(() => {
    if (name_el && name_el.current !== null) {
      setLeft({ left: name_el.current.offsetWidth });
    }
  }, [name_el]);

  useEffect(() => {
    if (retake_el && retake_el.current !== null) {
      console.log(
        "table.tsx:34 | retake_el.current.offsetWidth",
        retake_el.current.offsetWidth
      );
      setRight({ right: retake_el.current.offsetWidth });
    }
  }, [retake_el]);

  if (show_student) {
    columns.push({
      name: "NAME",
      id: "student.last_name",
    });
  }

  columns.push({
    name: "BOOK NAME",
    id: "book.title",
  });
  columns.push({
    name: "INTRODUCTION",
  });
  let total_chapters = 0;
  data.forEach((grade) => {
    if (grade.book.chapters > total_chapters) {
      total_chapters = grade.book.chapters;
    }
  });
  for (let i = 1; i <= total_chapters; i++) {
    columns.push({
      name: `CHAPTER ${i}`,
    });
  }
  columns.push({
    name: "OVERALL GRADE",
  });

  const renderGradesTD = (
    grades: GradeItem[],
    book: ReaderItem,
    student: StudentItem
  ) => {
    const returnTds = [];
    for (let i = 0; i <= total_chapters; i++) {
      const finded_grade = grades.find((g) =>
        i === 0 ? g.chapter === "introduction" : Number(g.chapter) === i
      );
      if (finded_grade) {
        returnTds.push(
          <td className="text-center">
            <ChapterRetakeBtn
              grade={finded_grade.grade}
              requested_retake={finded_grade.requested_retake}
              disabled={finded_grade.disabled}
              question_num={finded_grade.question_num}
              past={finded_grade.past}
              chapter={finded_grade.chapter}
              book_id={book.id}
              student_id={student.id}
              refetch={refetch}
            />
          </td>
        );
      } else if (i === 0 && !book.has_introduction) {
        returnTds.push(
          <td className="text-center">
            <i className="far fa-ellipsis-h text-muted mt-3"></i>
          </td>
        );
      } else if (i > book.chapters) {
        returnTds.push(
          <td className="text-center">
            <i className="far fa-ellipsis-h text-muted mt-3"></i>
          </td>
        );
      } else {
        returnTds.push(
          <td className="text-center">
            <small>
              <i className="far fa-circle text-muted mt-3"></i>
            </small>
          </td>
        );
      }
    }
    return returnTds;
  };

  return (
    <>
      <div className="d-flex justify-content-end mb-1">
        <small className="text-white green_dark">
          <i className="fal fa-info-circle"></i> Allow retakes by chapter by
          clicking on the chapter score
        </small>
      </div>
      <table
        className="table bg-white table-hover table-responsive "
        id="table_grades"
      >
        <thead>
          <tr>
            {columns.map((column) => {
              if (sort_by) {
                return (
                  <ThSort
                    key={column.name.split(" ").join("_")}
                    title={column.name}
                    id={column.id || column.name}
                    type={sort_by.by === column.id ? sort_by.sort : undefined}
                    handle_sort={handle_sort}
                    className={`text-nowrap ${
                      column.name === "Name" || column.name === "Book Name"
                        ? "sticky_table"
                        : column.name === "Retakes" ||
                          column.name === "Overall Grade"
                        ? "sticky_table_right"
                        : ""
                    }`}
                    style={
                      column.name === "Book Name"
                        ? leftStyle
                        : column.name === "Overall Grade"
                        ? rightStyle
                        : undefined
                    }
                    ref={
                      column.name === "Name"
                        ? name_el
                        : column.name === "Retakes"
                        ? retake_el
                        : null
                    }
                  />
                );
              } else {
                return (
                  <th
                    className={`text-nowrap ${
                      column.name === "Name" || column.name === "Book Name"
                        ? "sticky_table"
                        : column.name === "Retakes" ||
                          column.name === "Overall Grade"
                        ? "sticky_table_right"
                        : ""
                    }`}
                    style={
                      column.name === "Book Name"
                        ? leftStyle
                        : column.name === "Overall Grade"
                        ? rightStyle
                        : undefined
                    }
                    key={column.name.split(" ").join("_")}
                    ref={
                      column.name === "Name"
                        ? name_el
                        : column.name === "Retakes"
                        ? retake_el
                        : null
                    }
                  >
                    {column.name}
                  </th>
                );
              }
            })}
          </tr>
        </thead>
        <tbody className="sticky_table_tbody grades_table">
          {data.map((row, key) => {
            const student = row.student;
            const history =
              student.history && student.history.length > 0
                ? student.history[0]
                : { score: 0, allow_retake: null, request_retake: null };
            const disabledRetakeBtn = row.grades.find(
              (g: GradeItem) => g.grade === 0 && g.past && g.past > 0
            )
              ? true
              : false;
            return (
              <tr key={`history_row_${key}`}>
                {show_student ? (
                  <td className="sticky_table">
                    <Link
                      to={`/student/${student.id}/responses/${row.book.id}`}
                      className="text-dark"
                    >
                      {student.name}{" "}
                      <i className="fal fa-eye text-muted opacity_6"></i>
                    </Link>
                  </td>
                ) : null}
                <td className="text-dark sticky_table" style={leftStyle}>
                  {handleSelectBook ? (
                    <button
                      onClick={handleSelectBook}
                      className="btn btn-link text-dark"
                      data-book_id={row.book.id}
                    >
                      {row.book.title}
                    </button>
                  ) : (
                    row.book.title
                  )}
                </td>
                {renderGradesTD(row.grades, row.book, student)}
                <td
                  className="sticky_table_right text-center"
                  style={rightStyle}
                >
                  <OverAllRender
                    overall={row.overall}
                    question_num={
                      row.book.chapter_questions || row.overall.question_num
                    }
                  />
                  <RetakeRender
                    student={student}
                    refetch={refetch}
                    history={history}
                    book_id={row.book.id}
                    disabled={disabledRetakeBtn}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default GradesTable;
