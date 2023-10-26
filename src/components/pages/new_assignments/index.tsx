import React, { useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";
import { LoaderBar } from "../../../middleware/loaders";

import {
  GET_CLASSES,
  GET_ASSIGNMENTS,
  SET_ASSIGNMENTS,
  REMOVE_ASSIGNMENT,
  GET_READERS,
} from "./queries";
import { ReaderItem, Level as LevelItem } from "../../../models/reader";
import {
  AssignmentItem,
  AssignmentKeys,
  ErrorItem,
} from "../../../models/assignment";
import { ClassItem } from "../../../models/classes";
import { LangItem } from "../../../models/lang";
import { filterOptions } from "../../../middleware/common-functions";
import { SelectSearchItem } from "../../../models/filters";

const assignment_data = {
  title: {
    msg: "Please add an assignment title",
  },
  start_time: {
    msg: "Please add a Start Date",
  },
  end_time: {
    msg: "Please add a Due Date",
  },
  book_id: {
    msg: "Please add a Book title for the assignment",
  },
};

const NewAssignmentsPage: React.FC = () => {
  const languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "{}"
  );
  const [readers, setReaders] = useState<ReaderItem[]>([]);
  const [levels, setLevels] = useState<LevelItem[]>([]);
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const history = useHistory();
  const { class_id, assignment_id } = useParams<{
    class_id: string;
    assignment_id: string;
  }>();
  const [assignment, setAssignment] = useState<AssignmentItem>(
    {} as AssignmentItem
  );
  const [error, setError] = useState<ErrorItem | false>(false);
  const { data: db_classes, loading: loading_classes } = useQuery(GET_CLASSES);
  const { data: db_readers } = useQuery(GET_READERS);
  const [
    getAssignment,
    { data: db_assignments, loading: loading_assignments },
  ] = useLazyQuery(GET_ASSIGNMENTS, {
    fetchPolicy: "no-cache",
  });
  const [setAssignmentQuery, { loading: loading_save }] =
    useMutation(SET_ASSIGNMENTS);
  const [removeAssignment] = useMutation(REMOVE_ASSIGNMENT);

  useEffect(() => {
    if (db_readers && db_readers.books) {
      const set_readers = db_readers.books.sort(
        (a: ReaderItem, b: ReaderItem) => (a.title > b.title ? 1 : -1)
      );
      const set_levels: LevelItem[] = set_readers
        .map((item: ReaderItem) => ({ ...item.level }))
        .sort((a: LevelItem, b: LevelItem) => (a.name > b.name ? 1 : -1))
        .reduce((unique: LevelItem[], item: LevelItem) => {
          const finded = unique.find((sub_item) => sub_item.id === item.id);
          return finded ? unique : [...unique, item];
        }, []);
      setLevels(set_levels);
      setReaders(set_readers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_readers]);

  useEffect(() => {
    if (classGroups) {
      if (class_id && assignment_id) {
        getAssignment({ variables: { class_id, id: assignment_id } });
        setSelectedClasses([class_id]);
      } else if (class_id) {
        setAssignment({ class_id });
        setSelectedClasses([class_id]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_id, assignment_id, classGroups]);

  useEffect(() => {
    if (db_classes) {
      setClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_classes]);
  useEffect(() => {
    if (db_assignments && db_assignments.assignments) {
      const set_assignment = db_assignments.assignments[0];
      set_assignment.end_time = set_assignment.end_time.split(" ")[0];
      set_assignment.start_time = set_assignment.start_time.split(" ")[0];
      setAssignment(set_assignment);
    }
  }, [db_assignments]);

  const handleSelectClass = (selected_id: string[]) => {
    setSelectedClasses(selected_id);
  };

  const inputHandler = (ev: { target: HTMLInputElement }) => {
    const input_value = ev.target.value;
    const type: AssignmentKeys = ev.target.dataset.type as AssignmentKeys;
    if (!type) return;
    const current_assignment = { ...assignment };
    current_assignment[type] = input_value;
    setAssignment(current_assignment);
  };

  const handleSaveAssignment = async () => {
    ///validate empty
    if (!assignment.id && selectedClasses.length < 1) {
      setError({ msg: "Please select a Class Group", item: "class_id" });
      return;
    }
    // @ts-ignore
    const empty: AssignmentKeys = Object.keys(assignment_data).find(
      (assignment_key) => {
        // @ts-ignore
        const value: AssignmentKeys = assignment[
          assignment_key
        ] as AssignmentKeys;
        return !value || value.length <= 0 ? true : false;
      }
    );
    if (empty) {
      // @ts-ignore
      setError({ msg: assignment_data[empty].msg, item: empty });
      return;
    }
    setError(false);
    await setAssignmentQuery({
      variables: {
        classes_id: selectedClasses,
        title: assignment.title,
        start_time: assignment.start_time + " 00:00:00",
        end_time: assignment.end_time + " 00:00:00",
        book_id: assignment.book_id,
        id: assignment.id,
        message: assignment.message,
      },
    });
    history.push({
      pathname: `/assignments/${assignment.class_id}`,
    });
  };

  const handleRemoveAssignment = async () => {
    if (!assignment.id) {
      return;
    }
    setError(false);
    await removeAssignment({
      variables: {
        id: assignment.id,
      },
    });
    history.push({
      pathname: `/assignments/${assignment.class_id}`,
    });
  };

  const setClasses = () => {
    const groups: SelectSearchItem[] = db_classes.classes.map(
      (item: ClassItem) => {
        return { name: item.txt, value: item.value };
      }
    );

    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };

  return (
    <main className="first-container last-container">
      {loading_classes || loading_assignments || loading_save ? (
        <LoaderBar fixed />
      ) : null}
      <div className="container">
        <h1>{assignment_id ? "Edit" : "New"} Assignment</h1>
        <div className="row">
          <div className="col-md-8">
            <FormAssignment
              assignment={assignment}
              inputHandler={inputHandler}
            />
          </div>
          <div className="col-md-4">
            <FormData
              assignment={assignment}
              inputHandler={inputHandler}
              classes={classGroups ? classGroups : []}
              selectedClasses={selectedClasses}
              handleSelectClass={handleSelectClass}
            />
            <FormBook
              assignment={assignment}
              inputHandler={inputHandler}
              all_readers={readers}
              levels={levels}
              languages={languages}
              saveAssignment={handleSaveAssignment}
              removeAssignment={handleRemoveAssignment}
              loading={loading_save}
              error={error}
            />
            <Link
              to={`/assignments${class_id ? `/${class_id}` : ""}`}
              className="btn btn-link btn-block mt-3"
            >
              Back to Assignments
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

const FormAssignment = ({
  assignment,
  inputHandler,
}: {
  assignment: AssignmentItem;
  inputHandler: any;
}) => (
  <div className="card card-default">
    <div className="card-body">
      <div className="form-group mb-3">
        <label htmlFor="name">Title</label>
        <input
          type="text"
          className="form-control"
          autoComplete="new-password"
          data-type="title"
          onChange={inputHandler}
          value={assignment.title}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="last_name">
          Assignment Message <small className="text-muted">(Optional)</small>
        </label>
        <textarea
          className="form-control"
          rows={5}
          data-type="message"
          onChange={inputHandler}
          value={assignment.message || ""}
        />
      </div>
    </div>
  </div>
);
const FormData = ({
  assignment,
  classes,
  inputHandler,
  handleSelectClass,
  selectedClasses,
}: {
  assignment: AssignmentItem;
  classes: SelectSearchItem[];
  inputHandler: any;
  handleSelectClass: any;
  selectedClasses: string[];
}) => (
  <div className="card card-default">
    <div className="card-body">
      <div className="form-group mb-3">
        <label htmlFor="plan_id">
          {assignment.id ? "Class Group" : "Select Class Groups"}
        </label>
        {assignment.id ? (
          <input
            className="form-control"
            readOnly
            value={assignment.class?.name}
          />
        ) : (
          <>
            <SelectSearch
              onChange={handleSelectClass}
              multiple={true}
              printOptions="auto"
              value={selectedClasses}
              emptyMessage="Class not found"
              data-type="class_id"
              filterOptions={filterOptions}
              options={classes ? classes : []}
              placeholder="Select Class Groups"
            />
            <small className="text-muted d-block m-0">
              Add as many as you like
            </small>
          </>
        )}
      </div>
      {assignment.id ? (
        <div className="form-group mb-3">
          <label htmlFor="plan_id">Copy to Other classes</label>
          <SelectSearch
            onChange={handleSelectClass}
            multiple={true}
            printOptions="auto"
            value={selectedClasses}
            emptyMessage="Class not found"
            data-type="class_id"
            filterOptions={filterOptions}
            options={classes ? classes : []}
            placeholder="Select Class Groups"
          />
          <small className="text-muted d-block m-0">
            Add as many as you like
          </small>
        </div>
      ) : null}
      <div className="form-group mb-3">
        <label htmlFor="name">Start Date</label>
        <input
          type="date"
          className="form-control"
          autoComplete="new-password"
          onChange={inputHandler}
          data-type="start_time"
          value={assignment.start_time}
        />
      </div>
      <div className="form-group mb-3">
        <label htmlFor="last_name">Due Date</label>
        <input
          type="date"
          className="form-control"
          autoComplete="new-password"
          onChange={inputHandler}
          data-type="end_time"
          value={assignment.end_time}
        />
      </div>
    </div>
  </div>
);

const FormBook = ({
  inputHandler,
  assignment,
  all_readers,
  levels,
  languages,
  removeAssignment,
  saveAssignment,
  loading,
  error,
}: {
  inputHandler?: any;
  assignment?: AssignmentItem;
  all_readers?: ReaderItem[];
  levels?: LevelItem[];
  languages?: LangItem[];
  saveAssignment?: any;
  removeAssignment?: any;
  loading?: boolean;
  error?: ErrorItem | false;
}) => {
  const [filter, setFilter] = useState({
    level: "all",
    lang: "all",
  });
  const [readers, setReaders] = useState(all_readers);

  useEffect(() => {
    console.log("index.tsx:317 | filter", filter);
    if (all_readers) {
      const set_readers = all_readers
        .filter((book) => {
          return filter.lang === "all"
            ? true
            : book.language.id === filter.lang;
        })
        .filter((book) =>
          filter.level !== "all" ? book.level_id === filter.level : true
        );
      setReaders(set_readers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filterBy = (ev: { target: HTMLSelectElement }) => {
    const type = ev.target.dataset.type;
    const set_filter = { ...filter };
    if (type === "lang") {
      setFilter({ level: set_filter.level, lang: ev.target.value });
    } else {
      setFilter({ lang: set_filter.lang, level: ev.target.value });
    }
  };

  if (!readers) return <div></div>;

  return (
    <div className="card card-default mt-2">
      <div className="card-body">
        <div className="card-title">Select Book</div>
        <div className="form-group mb-3">
          <label htmlFor="last_name">Select a Language</label>
          <select
            className="form-control"
            onChange={filterBy}
            data-type="lang"
            value={filter.lang}
          >
            {filter.lang === "all" ? (
              <option value="all">Select a Language</option>
            ) : null}
            {languages &&
              languages.map((lang) => (
                <option value={lang.id} key={`lang_options_${lang.id}`}>
                  {lang.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="last_name">Filter by Level</label>
          <select
            className="form-control"
            onChange={filterBy}
            data-type="level"
            value={filter.level}
          >
            <option value="all">All Levels</option>
            {levels &&
              levels.map((level) => (
                <option value={level.id} key={`level_options_${level.id}`}>
                  {level.name}
                </option>
              ))}
          </select>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="last_name">
            Book{" "}
            {filter.lang === "all" ? (
              <small className="text-danger">Select a Language</small>
            ) : readers.length === 0 ? (
              <small className="text-danger">No books match your filter</small>
            ) : (
              <small className="text-muted">({readers.length} Books)</small>
            )}
          </label>
          <select
            className="form-control"
            data-type="book_id"
            onChange={inputHandler}
            disabled={readers.length === 0 || filter.lang === "all"}
            value={assignment ? assignment.book_id || "false" : "false"}
          >
            <option value="false">Select a Book</option>
            {readers &&
              readers.map((book) => (
                <option value={book.id} key={`reader_options_${book.id}`}>
                  {book.title}
                </option>
              ))}
          </select>
        </div>
        {error && <div className="alert alert-warning">{error.msg}</div>}
        <div className="form-group">
          <button
            className="btn btn-danger btn-block green_contain_green"
            onClick={saveAssignment}
            disabled={loading}
          >
            Save
          </button>
          {assignment && assignment.id ? (
            <button
              className="btn text-danger btn-block mt-5"
              onClick={removeAssignment}
              disabled={loading}
            >
              <i className="fal fa-trash-alt"></i> Delete Assignment
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default NewAssignmentsPage;
