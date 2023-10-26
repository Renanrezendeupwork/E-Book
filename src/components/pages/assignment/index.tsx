import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import Assigment from "../library/assigment";
import { GETASSIGNMENT } from "./queries";
import { AssignmentItem } from "../../../models/assignment";
import { LoaderDots } from "../../../middleware/main_loader";
import Table from "./table";
import { IconJumbotron } from "../../common/icons";
import { ClassItem } from "../../../models/classes";
import useSort from "../../../hooks/useSort";

const AssignmentPage: React.FC = () => {
  const { class_id, assignment_id } = useParams<{
    assignment_id: string;
    class_id: string;
  }>();
  const { data: get_assignment, refetch } = useQuery<{
    assignments: AssignmentItem[];
    class: ClassItem;
  }>(GETASSIGNMENT, {
    fetchPolicy: "no-cache",
    variables: { id: assignment_id, class_id },
  });
  const [sort_by, setSort] = useSort({
    by: "student.last_name",
    sort: "asc",
  });

  const handleSort = (ev: { currentTarget: HTMLElement }) => {
    const set_sort = { ...sort_by };
    const sort_id = ev.currentTarget.dataset.id;
    if (!sort_id) {
      return;
    }
    if (set_sort.by === sort_id) {
      set_sort.sort = set_sort.sort === "desc" ? "asc" : "desc";
    }
    set_sort.by = sort_id;
    setSort(set_sort);
  };

  const handleRefetch = () => {
    refetch();
  };

  return (
    <main>
      {get_assignment && get_assignment.assignments.length > 0 ? (
        <>
          <Assigment assignment={get_assignment.assignments[0]} />
          {get_assignment.assignments[0].history ? (
            <Table
              refetch={handleRefetch}
              history={get_assignment.assignments[0].history}
              book_chapters={get_assignment.assignments[0].book?.chapters || 0}
              group={get_assignment.assignments[0].class}
              sort_by={sort_by}
              handle_sort={handleSort}
            />
          ) : (
            <IconJumbotron
              classes="my-5"
              txt="No student data"
              icon="far fa-book-user"
            />
          )}
        </>
      ) : (
        <div className="w-100 text-center my-5 py-5 first-container">
          <LoaderDots size={20} />
        </div>
      )}
    </main>
  );
};

export default AssignmentPage;
