import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import SelectSearch from "react-select-search";
import { useLazyQuery } from "@apollo/client";
import { IconJumbotron } from "../../common/icons";
import { useQuery } from "@apollo/client";
import FileDownload from "js-file-download";

import axios_api from "../../../middleware/axios_api";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import GradesTable from "./table";
import { GET_GRADES, GET_CLASSES } from "./queries";
import { SelectSearchItem } from "../../../models/filters";
import { ClassItem } from "../../../models/classes";
import { Grades } from "../../../models/grades";
import { ReaderItem } from "../../../models/reader";
import { filterOptions } from "../../../middleware/common-functions";
import useSort from "../../../hooks/useSort";
import { ErrorType } from "../../../models/errors";
import { ButtonTootip } from "../../common/buttons";

interface GetGradesData {
  grades: Grades[];
  books: ReaderItem[];
}

const GradesPage: React.FC = () => {
  const history = useHistory();
  const [loading_page, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType | false>(false);
  const [sort_by, setSort] = useSort({
    by: "last_name",
    sort: "asc",
  });
  const { class_id, book_id } = useParams<{
    class_id?: string;
    book_id?: string;
  }>();
  const [class_selected, setClassSelected] = useState<ClassItem | null>();
  const [grades, setGrades] = useState<Grades[]>([]);
  const [readers, setReaders] = useState<SelectSearchItem[]>([]);
  const [polling, setPolling] = useState<boolean>(false);
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);
  const { data: classes_db, loading: loading_classes } = useQuery<{
    classes: ClassItem[];
    books: ReaderItem[];
  }>(GET_CLASSES, {
    fetchPolicy: "no-cache",
  });
  const [
    getGrades,
    { data: grades_data, loading, stopPolling, startPolling, refetch },
  ] = useLazyQuery<GetGradesData>(GET_GRADES, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    if (grades_data) {
      setGrades(grades_data.grades);
      if (book_id) {
        selectReader(book_id);
      }
    }
    // eslint-disable-next-line
  }, [grades_data, book_id]);

  useEffect(() => {
    if (polling === false && stopPolling) {
      stopPolling();
    } else if (startPolling) {
      startPolling(3000);
    }
    return () => {
      if (stopPolling) {
        stopPolling();
      }
    };
  }, [polling, stopPolling, startPolling]);

  useEffect(() => {
    if (class_selected) {
      getGrades({ variables: { class_id: class_selected.value } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_selected]);

  useEffect(() => {
    if (classes_db) {
      setClasses();
      setReadersFun();
      if (class_id) {
        selectClass(class_id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classes_db, class_id]);

  const togglePolling = () => {
    setPolling(!polling);
  };
  const setClasses = () => {
    if (!classes_db) return;
    const groups: SelectSearchItem[] = classes_db.classes.map(
      (item: ClassItem) => {
        return { name: item.txt, value: item.value };
      }
    );

    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };
  const setReadersFun = () => {
    if (!classes_db) return;
    const groups: SelectSearchItem[] = classes_db.books.map(
      (item: ReaderItem) => {
        return {
          name: item.title,
          language: item.language.name,
          value: item.id,
        };
      }
    );
    groups.push({ name: "- See All", value: "0" });
    setReaders(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };

  const selectClass = (selected_id: any) => {
    if (!classes_db) return;
    if (!selected_id || selected_id === "0") {
      setClassSelected(null);
    } else {
      const set_selected = classes_db.classes.find(
        (g: ClassItem) => g.value === selected_id
      );
      setClassSelected(set_selected);
    }
  };

  const handleSelectClass = (selected_id: any) => {
    history.replace({
      pathname: `/grades/${selected_id ? `${selected_id}` : ``}${
        book_id && book_id !== "0" ? `/${book_id}` : ``
      }`,
    });
  };

  const handleSelectReader = (selected_id: any) => {
    history.replace({
      pathname: `/grades/${class_id}${
        selected_id && selected_id !== "0" ? `/${selected_id}` : ``
      }`,
    });
  };

  const selectReader = (selected_id: any) => {
    if (!grades_data || !classes_db) return;
    let reader_id: string | null = null;
    if (selected_id !== "0") {
      const set_selected = classes_db.books.find(
        (b: ReaderItem) => b.id === selected_id
      );
      if (!set_selected) return;
      reader_id = set_selected.id;
    }
    if (reader_id) {
      const set_grades = grades_data.grades.filter(
        (g) => g.book.id === reader_id
      );
      setGrades(set_grades);
    } else {
      setGrades(grades_data.grades);
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

  const downloadStudents = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios_api.get(
        `get_grades${class_selected ? `/${class_selected.value}` : ""}`
      );
      setLoading(false);
      const file_name = class_selected
        ? `Flangoo Students Grades Class ${class_selected.txt}.csv`
        : "Flangoo Students.csv";
      FileDownload(response.data, file_name);
    } catch (catch_error: any) {
      setLoading(false);
      if (catch_error?.response?.data?.message) {
        setError({
          message: `Please refresh the page and try again. Error: ${catch_error.response.data.message}`,
        });
      } else {
        setError({
          message: "Please refresh the page and try again",
        });
      }
    }
  };

  function renderBook(
    props: any,
    option: any,
    snapshot: any,
    className: string
  ) {
    return (
      <button {...props} className={className} type="button">
        {option.name}{" "}
        {option.language ? (
          <small className="text-muted"> | {option.language}</small>
        ) : null}
      </button>
    );
  }
  return (
    <main className="first-container last-container no_padding">
      {error ? (
        <div className="alert alert-danger d-flex align-items-center">
          <div>
            <i className="fal fa-exclamation-square fa-3x mr-3"></i>
          </div>
          <div>
            <h4>Something went wrong</h4>
            <p>{error.message}</p>
          </div>
        </div>
      ) : null}
      {loading || loading_classes ? <LoaderBar fixed={true} /> : null}
      <div className="title_part">
        <div className="container text-center">
          <h1 className="m-0">View Students Grades</h1>
          <p>See how your students are doing on each reader quiz they take</p>
          <div className="ctas d-flex justify-content-center pt-1">
            <button
              className={`mr-2 btn text-white green_contain_green ${grades.length ? "" : "disabled"}`}
              disabled={loading_page || grades.length < 1}
              onClick={downloadStudents}
            >
              <i className="fa fa-download" aria-hidden="true"></i>{" "}
              {loading_page ? "Downloading..." : "Download Grades"}
            </button>
          </div>
        </div>
      </div>
      <div className="container data_part">
          {classGroups.length ? (
            <div className="row mb-3">
              <div className="col-md-4">
                <SelectSearch
                  search
                  onChange={handleSelectClass}
                  value={class_selected?.value}
                  id="class_id"
                  emptyMessage="Class not found"
                  filterOptions={filterOptions}
                  options={classGroups}
                  placeholder="Select a Class Group"
                />
              </div>
              {class_selected ? (
                <div className="col-md-4">
                  <SelectSearch
                    search
                    onChange={handleSelectReader}
                    value={book_id || undefined}
                    renderOption={renderBook}
                    emptyMessage="Book not Found"
                    filterOptions={filterOptions}
                    options={readers}
                    placeholder="Type to search book"
                  />
                </div>
              ) : null}
              {class_selected ? (
                <div className="col-md-4">
                  <ButtonTootip
                    id="togglePolling"
                    tooltip_txt={`${
                      polling ? "Disable" : "Enable"
                    } real-time updates`}
                    className="btn"
                    onClick={togglePolling}
                    disabled={loading_page}
                  >
                    <i
                      className={`${
                        polling
                          ? "fas fa-play text-success"
                          : "far fa-pause text-secondary"
                      }`}
                    ></i>{" "}
                  </ButtonTootip>
                </div>
              ) : null}
            </div>
          ) : null}
          {(loading && grades.length < 1) || loading || loading_classes ? (
            <LoaderDots />
          ) : class_selected ? (
            grades.length > 0 ? (
              <GradesTable
                grades_data={grades}
                show_student={true}
                refetch={refetch}
                handle_sort={handleSort}
                sort_by={sort_by}
              />
            ) : (
              <IconJumbotron
                txt="No Grades to Show for this Class Group"
                classes="mt-5 mb-3"
                icon="fal fa-users"
              />
            )
          ) : (
            <IconJumbotron
              txt="Select a Class Group"
              classes="mt-5 mb-3"
              icon="fal fa-users"
            />
          )}
      </div>
    </main>
  );
};

export default GradesPage;
