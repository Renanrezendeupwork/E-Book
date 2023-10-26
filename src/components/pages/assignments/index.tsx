import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";

import { GET_CLASSES, GET_ASSIGNMENTS } from "./queries";
import AssignmentTable from "./table";
import { IconJumbotron } from "../../common/icons";
import { SelectGroup } from "../../common/ui_elements";
import useSort from "../../../hooks/useSort";

const AssignmentsPage: React.FC = () => {
  const { group_id } = useParams<{ group_id: string }>();
  const [class_id, setClassid] = useState<string | false>(false);
  const [sort_by, setSort] = useSort({
    by: "start_time",
    sort: "desc",
  });
  const { data: db_classes, loading: loading_classes } = useQuery(GET_CLASSES, {
    fetchPolicy: "no-cache",
  });
  const [
    getAssignment,
    { data: db_assignments, loading: loading_assignments },
  ] = useLazyQuery(GET_ASSIGNMENTS, { fetchPolicy: "no-cache" });

  const history = useHistory();

  useEffect(() => {
    if (group_id) {
      setClassid(group_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (class_id) {
      getAssignment({ variables: { class_id } });
    } else {
      getAssignment();
    }
    history.push({
      pathname: `/assignments${class_id ? `/${class_id}` : ""}`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_id]);

  const selectClass = (ev: { target: HTMLInputElement }) => {
    const selected_class = ev.target.value;
    if (selected_class === "false") {
      setClassid(false);
    } else {
      setClassid(selected_class);
    }
  };
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
  return (
    <main className="first-container last-container no_padding">
      {loading_classes || loading_assignments ? <LoaderBar fixed /> : null}
      <div className="title_part">
        <div className="container text-center">
          <h1>Manage Assignments</h1>
          <p>Give your students custom assignments by class group.</p>
          <Link
            className="btn btn-danger green_contain_green"
            to={`/new_assignment${class_id ? `/${class_id}` : ""}`}
          >
            Create New Assignment
          </Link>
        </div>
      </div>
      <div className="container data_part">
        {db_classes && (
          <SelectGroup
            id="selectClass"
            col="col-md-4 p-0"
            changeFun={selectClass}
            options={db_classes.classes}
            placeholder="View All"
            view_all={true}
            selected={class_id || undefined}
            title="Manage by Class Group"
          />
        )}
        {db_assignments && db_assignments.assignments.length > 0 ? (
          <AssignmentTable
            assignment_data={db_assignments.assignments}
            sort_by={sort_by}
            handle_sort={handleSort}
          />
        ) : loading_assignments ? (
          <LoaderDots />
        ) : (
          <IconJumbotron
            txt="No Assignment"
            classes="mt-4"
            icon="fas fa-sticky-note"
            cta={{
              link: `/new_assignment${class_id ? `/${class_id}` : ""}`,
              txt: "Create New Assignments",
              classes: "btn-danger green_contain_green",
            }}
          />
        )}
      </div>
    </main>
  );
};

export default AssignmentsPage;
