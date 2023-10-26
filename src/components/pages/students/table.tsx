import React from "react";
import { Link } from "react-router-dom";
import { toDate } from "../../../middleware/dates";
import { sortArray, SortBy } from "../../../hooks/useSort";
import { StudentItem } from "../../../models/student";
import { ThSort } from "../../common/ui_elements";

type StudentsTableProps = {
  students_data: StudentItem[];
  selectStudent: any;
  actionTrigger: null | "remove" | "transfer";
  selectedStudents: string[];
  handle_sort: any;
  sort_by: SortBy;
};

const StudentsTable: React.FC<StudentsTableProps> = ({
  students_data,
  selectStudent,
  actionTrigger,
  selectedStudents,
  sort_by,
  handle_sort,
}) => {
  const data = sortArray(students_data, sort_by.by, sort_by.sort);
  const columns = [
    {
      name: "NAME",
      id: "last_name",
    },
    {
      name: "LGOIN CODE",
      id: "login_code",
    },
    {
      name: "CLASS PERIOD",
      id: "class_id",
    },
    {
      name: "LOGGED",
      id: "minutes",
    },
    {
      name: "LAST SEEN",
      id: "last_login",
    },
  ];

  return (
    <table className="table bg-white table-hover" id="stuents_table">
      <thead>
        <tr>
          {columns.map((column) => (
            <ThSort
              key={column.name.split(" ").join("_")}
              title={column.name}
              id={column.id}
              type={sort_by.by === column.id ? sort_by.sort : undefined}
              handle_sort={handle_sort}
            />
          ))}
          <th className="text-center">{actionTrigger ? "SELECET" : "ACTIONS"}</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          const selected_student = selectedStudents.findIndex(
            (sid) => sid === row.id
          );
          return (
            <tr
              key={`student_list_${row.id}`}
              id={`${row.name.toLocaleLowerCase().split(" ").join("")}_row`}
            >
              <td>{row.name}</td>
              <td
                id={`${row.name.toLocaleLowerCase().split(" ").join("")}_code`}
              >
                {row.login_code}
              </td>
              <td>{row.class ? row.class.name : "-"}</td>
              <td>
                <small>
                  <b>{row.minutes}</b> week <br />
                  <b>{row.semester_minutes}</b> total time
                </small>
              </td>
              <td>
                {row.last_login ? (
                  toDate(row.last_login)
                ) : (
                  <span className="text-muted">Not logged</span>
                )}
              </td>
              {actionTrigger ? (
                <td className="text-center">
                  <button
                    className="btn no_focus"
                    onClick={() => {
                      selectStudent(row.id);
                    }}
                    data-student={row.id}
                  >
                    <span className="fa-stack fa-1x">
                      <i
                        className={`far fa-square fa-stack-2x ${
                          selected_student >= 0 ? "opacity_8" : "opacity_5"
                        }`}
                      ></i>
                      <i
                        className={`fa-stack-1x ${
                          selected_student >= 0
                            ? actionTrigger === "remove"
                              ? "far fa-times text-danger"
                              : "far fa-check text-success"
                            : ""
                        } `}
                      ></i>
                    </span>
                  </button>
                </td>
              ) : (
                <td>
                  <Link
                    to={`/student/${row.id}`}
                    className="btn btn-dark btn-block green_outline_gray"
                  >
                    Manage
                  </Link>
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default StudentsTable;
