import React from "react";
import { Link } from "react-router-dom";
import { sortArray, SortBy } from "../../../hooks/useSort";
import { NumericType, StringType, toDate } from "../../../middleware/dates";
import { AssignmentItem } from "../../../models/assignment";
import { ThSort } from "../../common/ui_elements";

type AssignmentTableProps = {
  assignment_data: AssignmentItem[];
  handle_sort: any;
  sort_by: SortBy;
};

const AssignmentTable: React.FC<AssignmentTableProps> = ({
  assignment_data,
  sort_by,
  handle_sort,
}) => {
  const data = sortArray(assignment_data, sort_by.by, sort_by.sort);
  const columns = [
    {
      name: "Class",
      id: "class.name",
    },
    {
      name: "Language",
      id: "language_id",
    },
    {
      name: "Title",
      id: "title",
    },
    {
      name: "Start Date",
      id: "start_time",
    },
    {
      name: "Due Date",
      id: "end_time",
    },
    {
      name: "Book",
      id: "book.title",
    },
  ];

  return (
    <table className="table bg-white table-hover mt-3">
      <thead>
        <tr>
          {columns.map((column) => (
            <ThSort
              key={column.name.split(" ").join("_")}
              id={column.id}
              title={column.name}
              type={sort_by.by === column.id ? sort_by.sort : undefined}
              handle_sort={handle_sort}
            />
          ))}
          <th style={{ minWidth: "250px" }}></th>
        </tr>
      </thead>
      <tbody>
        {data.map((row) => {
          return (
            <tr key={`assignment_list_${row.id}`}>
              <td>{row.class?.name}</td>
              <td>{row.book?.language?.name}</td>
              <td>{row.title}</td>
              <td>
                {toDate(row.start_time, {
                  day: NumericType.Digit,
                  month: StringType.Long,
                })}
              </td>
              <td>
                {toDate(row.end_time, {
                  day: NumericType.Digit,
                  month: StringType.Long,
                })}
              </td>
              <td>{row.book ? row.book.title : "-"}</td>
              <td className="text-right">
                <Link
                  to={`/assignment/${row.class_id}/${row.id}`}
                  className="btn btn-success mr-3 green_contain_green_light"
                >
                  <i className="fal fa-bars"></i> View
                </Link>
                <Link
                  to={`/edit_assignment/${row.class_id}/${row.id}`}
                  className="btn btn-dark green_contain_gray"
                >
                  <i className="fal fa-edit"></i> Edit
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default AssignmentTable;
