import React, { forwardRef, LegacyRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SelectSearch from "react-select-search";
import { DateTime } from "luxon";
import { useMutation, useLazyQuery } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import FileDownload from "js-file-download";
import DatePicker from "react-datepicker";
import {
  ButtonDropdown,
  DropdownItem,
  DropdownMenu,
  UncontrolledButtonDropdown,
  DropdownToggle,
} from "reactstrap";

import { IconJumbotron } from "../../common/icons";
import axios_api from "../../../middleware/axios_api";
import {
  ClassModal,
  RemoveModal,
  RemoveModalStudent,
  TransferModalStudent,
} from "./modal";
import { NewClassItem, ClassItem } from "../../../models/classes";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import StudentsTable from "./table";
import {
  GET_STUDENTS,
  CREATE_CLASS,
  REMOVE_CLASS,
  REMOVE_STUDENTS,
  TRANSFER_STUDENTS,
} from "./queries";
import { StudentItem, StudentsTransferType } from "../../../models/student";
import { FilterFun, SelectSearchItem } from "../../../models/filters";
import { UserItem } from "../../../models/user";
import { ErrorType } from "../../../models/errors";
import useSort from "../../../hooks/useSort";

import "react-datepicker/dist/react-datepicker.css";
import { getWeekDates } from "../../../middleware/dates";
import { validateEmail } from "../../../middleware/common-functions";

const StudentsPage: React.FC = () => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [startDate, setStartDate] = useState(new Date());
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [teacher_email, setTeacherEmail] = useState<string>("");
  const [action, setAction] = useState<"transfer" | "remove" | null>(null);
  const [weekNum, setWeekNum] = useState(DateTime.now().weekNumber);
  const [modal, setModal] = useState<boolean | string>(false);
  const [sort_by, setSort] = useSort({
    by: "last_name",
    sort: "asc",
  });
  const [error, setError] = useState<ErrorType | false>(false);
  const { class_id } = useParams<{ class_id?: string }>();
  const history = useHistory();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [class_data, setClass] = useState<NewClassItem>({} as NewClassItem);
  const [class_selected, setClassSelected] = useState<ClassItem | null>();
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);
  const [createClass, { loading: loading_save, data: newest_class }] =
    useMutation(CREATE_CLASS);
  const [removeClass] = useMutation(REMOVE_CLASS);
  const [removeStudents, { loading: loadingRemove }] =
    useMutation(REMOVE_STUDENTS);
  const [transferStudents, { loading: loadingTransfer }] =
    useMutation(TRANSFER_STUDENTS);
  const [getStudents, { data: db_data, loading, refetch: refetch_students }] =
    useLazyQuery<{
      students: StudentItem[];
      classes: ClassItem[];
      studentsTransfer: StudentsTransferType[];
    }>(GET_STUDENTS, {
      fetchPolicy: "no-cache",
      // pollInterval: 5000,
    });

  useEffect(() => {
    getStudents();
    if (newest_class?.classGroup?.id) {
      history.push({ pathname: `/students/${newest_class.classGroup.id}` });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading_save, newest_class]);

  useEffect(() => {
    if (db_data) {
      const set_students =
        class_selected && class_selected.value !== "0"
          ? db_data.students.filter(
              (item) => item.class_id === class_selected.value
            )
          : db_data.students;
      setStudents(set_students);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [class_selected]);

  useEffect(() => {
    if (db_data) {
      setClasses();
      setStudents(db_data.students);
      handleSelectClass(class_id || "0");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_data, class_id]);

  const setClasses = () => {
    if (!db_data) return;
    const groups: SelectSearchItem[] = db_data.classes.map(
      (item: ClassItem) => {
        return { name: item.txt, value: item.value };
      }
    );
    groups.push({ name: "- See All", value: "0" });
    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };
  const showModal = () => {
    setModal(true);
  };
  const showModalEdit = () => {
    setModal("edit");
  };
  const showModalDelete = () => {
    setModal("delete");
  };
  const showModalDeleteStudent = () => {
    setModal("delete_student");
  };
  const showModalTransferStudent = () => {
    setModal("transfer_student");
  };

  const handleClassType = (ev: { target: HTMLInputElement }) => {
    const class_name = ev.target.value;
    setClass({ txt: class_name });
  };

  const handleTeacherEmailType = (ev: { target: HTMLInputElement }) => {
    const email = ev.target.value;
    setTeacherEmail(email);
  };

  const saveClass = async () => {
    const data: { name: string | undefined; id?: string } = {
      name: class_data.txt,
    };
    if (modal === "edit") {
      data.id = class_selected?.value;
    }
    await createClass({ variables: data });
    setModal(false);
    setClass({ txt: " " });
  };

  const removeClassFun = async () => {
    if (!class_selected) {
      return false;
    }
    await removeClass({
      variables: { id: class_selected.value, remove_students: true },
    });
    setModal(false);
    history.push({ pathname: `/students` });
    if (refetch_students) {
      refetch_students();
    }
  };

  const removeStudentsFun = async () => {
    const students_id =
      action === "remove" ? selectedStudents : students.map((item) => item.id);
    await removeStudents({
      variables: { ids: students_id },
    });
    setModal(false);
    setSelectedStudents([]);
    if (refetch_students) {
      refetch_students();
    }
  };

  const transferStudentsFun = async () => {
    const valid = validateEmail(teacher_email);
    if (!valid) {
      const emailInput = document.getElementById("teacheremail_input");
      if (emailInput) {
        emailInput.focus();
      }
      setError({
        message: "Please add a valid email address",
        type: "email",
      });
      return;
    }
    const students_id =
      action === "transfer"
        ? selectedStudents
        : students.map((item) => item.id);
    try {
      await transferStudents({
        variables: { ids: students_id, teacher_email },
      });
      setModal(false);
      setSelectedStudents([]);
      if (refetch_students) {
        refetch_students();
      }
    } catch (error_catch: any) {
      console.log("index.tsx:208 | error_catch", error_catch.graphQLErrors);
      setError({
        message: error_catch.graphQLErrors[0]
          ? error_catch.graphQLErrors[0].message
          : "Please add a valid email address",
        type: "email",
      });
    }
  };

  const filterOptions: FilterFun = (options) => {
    return (query) => {
      const response = options.filter((item) => {
        const item_name = item.name.toLocaleLowerCase();
        return item_name.search(query.toLocaleLowerCase()) >= 0;
      });
      return response;
    };
  };

  const promtSelectClass = (selected_id: any) => {
    if (selected_id === "0") {
      history.push({ pathname: `/students` });
    } else {
      history.push({ pathname: `/students/${selected_id}` });
    }
  };
  const handleSelectClass = (selected_id: any) => {
    if (selected_id === "0") {
      setClassSelected(null);
    }
    if (!db_data) return;
    const set_selected = db_data.classes.find((g) => g.value === selected_id);

    setClassSelected(set_selected);
  };

  const addStudent = () => {
    if (!classGroups || classGroups.length <= 1) {
      setModal(true);
      return;
    }
    history.push({
      pathname: `/addstudents${class_id ? `/${class_id}` : ""}`,
    });
  };

  const studentSignup = () => {
    if (!classGroups || classGroups.length <= 1) {
      setModal(true);
      return;
    }
    history.push({
      pathname: "/howstudentsignup",
    });
  };

  const handleError = (set_error: ErrorType | false) => {
    setError(set_error);
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

  const handleDate = (date: Date) => {
    setStartDate(date);
    const set_week_number = DateTime.fromJSDate(date).weekNumber;
    getStudents({
      variables: {
        week_numer: set_week_number,
      },
    });
    setWeekNum(set_week_number);
  };

  const setActionFun = (action: null | "transfer" | "remove") => {
    setAction(action);
  };

  const cancelActionFun = () => {
    setAction(null);
    setSelectedStudents([]);
  };

  const selectStudentFun = (student_id: string) => {
    const set_selected = [...selectedStudents];
    const find_student = set_selected.findIndex((sid) => sid === student_id);
    if (find_student >= 0) {
      set_selected.splice(find_student);
    } else {
      set_selected.push(student_id);
    }
    setSelectedStudents(set_selected);
  };

  return (
    <main className="first-container last-container all_students_page no_padding">
      {loading || loading_save || loadingRemove || loadingTransfer ? (
        <LoaderBar fixed />
      ) : null}
      <div className="title_part">
        <div className="container text-center">
          {error && !error.type ? (
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
          <h1>Manage Students</h1>
          <p>
            Give your students access here.{" "}
            {loading
              ? ""
              : db_data
              ? `You have added
            ${db_data.students.length || "0"} out of
            ${user.student_limit || 180} student accounts`
            : ""}
          </p>
          <Ctas
            addClass={showModal}
            selected_class={class_selected}
            addStudent={addStudent}
            studentSignup={studentSignup}
            setError={handleError}
            student_limit={
              students ? students.length >= (user.student_limit || 180) : false
            }
          />
          {students && students.length >= (user.student_limit || 180) - 20 ? (
            <p>
              Need to add more students?{" "}
              <Link to="/help" className="text-primary">
                Send us a message.
              </Link>
            </p>
          ) : null}
        </div>
      </div>
      <div className="container data_part">
        {classGroups ? (
          <div className="row mb-3">
            <div className="col-md-4">
              <SelectSearch
                search
                onChange={promtSelectClass}
                value={class_selected?.value || class_id || "0"}
                emptyMessage="Class not found"
                filterOptions={filterOptions}
                options={classGroups}
                placeholder="Select a Class Group"
              />
            </div>
            <div className="col-md-2">
              <DatePicker
                selected={startDate}
                onChange={handleDate}
                calendarClassName="week_hover"
                calendarStartDay={1}
                customInput={
                  <CustomInput
                    value=""
                    week={getWeekDates(weekNum)}
                    onClick=""
                  />
                }
                maxDate={new Date()}
              />
            </div>
            <div className="col-md-2">
              {class_selected && (
                <button
                  type="button"
                  className="mr-2 btn btn-primary green_contain_gray"
                  onClick={showModalEdit}
                >
                  Rename Group
                </button>
              )}
            </div>
            <div className="col-md-4 text-right">
              {action ? (
                <ActionsOptions
                  disabled={selectedStudents.length === 0}
                  action={action}
                  confirmActionFun={
                    action === "remove"
                      ? showModalDeleteStudent
                      : showModalTransferStudent
                  }
                  cancelActionFun={cancelActionFun}
                />
              ) : (
                <ActionsCtas
                  class_selected={class_selected}
                  setActionFun={setActionFun}
                  showModalTransferStudent={showModalTransferStudent}
                  showModalDelete={showModalDelete}
                  students_length={students.length}
                />
              )}
            </div>
          </div>
        ) : null}
        {db_data && db_data.studentsTransfer.length > 0 ? (
          <div className="alert alert-primary d-flex align-items-center ">
            <div>
              <i className="fad fa-transporter-3 fa-2x mr-3"></i>
            </div>
            <div>
              <h5>You have students in transfer</h5>
              <p>
                You can accept, reject, or cancel student transfers from another
                teacher.
              </p>
            </div>
            <Link to="/transferstudents" className="btn btn-light ml-auto">
              Handle Transfers
            </Link>
          </div>
        ) : null}
        {!students ? (
          <LoaderDots />
        ) : students.length > 0 ? (
          <StudentsTable
            actionTrigger={action}
            students_data={students}
            selectStudent={selectStudentFun}
            selectedStudents={selectedStudents}
            sort_by={sort_by}
            handle_sort={handleSort}
          />
        ) : (
          <IconJumbotron
            id="no_students_jumbo"
            txt="No Students"
            classes="my-5"
            icon="fal fa-users"
            cta={{
              txt: "Add a Student",
              classes: "btn btn-danger green_contain_green",
              function: addStudent,
            }}
          />
        )}
        <div className="w-100 text-right">
          {action ? (
            <ActionsOptions
              disabled={selectedStudents.length === 0}
              action={action}
              cancelActionFun={cancelActionFun}
              confirmActionFun={
                action === "remove"
                  ? showModalDeleteStudent
                  : showModalTransferStudent
              }
            />
          ) : null}
        </div>
      </div>
      {modal ? (
        modal === "delete" ? (
          <RemoveModal
            show
            class_data={class_selected || null}
            loading={loading_save}
            toggle={() => {
              setModal(false);
            }}
            fun={class_selected ? removeClassFun : removeStudentsFun}
          />
        ) : modal === "delete_student" ? (
          <RemoveModalStudent
            show
            students_num={selectedStudents.length}
            loading={loadingRemove}
            toggle={() => {
              setModal(false);
            }}
            fun={removeStudentsFun}
          />
        ) : modal === "transfer_student" ? (
          <TransferModalStudent
            show
            teacher_email={teacher_email}
            students_num={selectedStudents.length}
            handleTeacherEmailType={handleTeacherEmailType}
            loading={loadingTransfer}
            error={error}
            toggle={() => {
              setModal(false);
            }}
            fun={transferStudentsFun}
          />
        ) : (
          <ClassModal
            show
            class_data={modal === "edit" ? class_selected : null}
            loading={loading_save}
            toggle={() => {
              setModal(false);
            }}
            handleType={handleClassType}
            has_groups={classGroups && classGroups.length > 1}
            fun={saveClass}
          />
        )
      ) : null}
    </main>
  );
};

const Ctas = ({
  addClass,
  addStudent,
  studentSignup,
  selected_class,
  student_limit,
  setError,
}: {
  addClass: () => void;
  addStudent: () => void;
  studentSignup: () => void;
  setError: any;
  selected_class: ClassItem | null | undefined;
  student_limit: boolean;
}) => {
  const [dropdownOpen, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);

  const downloadStudents = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await axios_api.get(
        `get_students${selected_class ? `/${selected_class.value}` : ""}`
      );
      setLoading(false);
      const file_name = selected_class
        ? `Flangoo Students ${selected_class.txt}.csv`
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
  return (
    <div className="ctas d-flex justify-content-center pt-4">
      {student_limit ? (
        <button className="btn btn-secondary add_student green_contain_green" disabled>
          Add Students
        </button>
      ) : (
        <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle
            className="btn btn-primary dropdown-toggle green_contain_green"
            id="add_students_btn"
          >
            Add Students <span className="caret"></span>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              className="py-2"
              onClick={studentSignup}
              id="add_students_btn_self"
            >
              Have Students Sign Up
            </DropdownItem>
            <DropdownItem
              className="py-2"
              onClick={addStudent}
              id="add_students_btn_manual"
            >
              Add Students Manually
            </DropdownItem>
          </DropdownMenu>
        </ButtonDropdown>
      )}
      <button
        type="button"
        className="mr-2 btn btn-success green_outline_gray"
        onClick={addClass}
        id="add_class_btn"
      >
        {" "}
        Add Class Group{" "}
      </button>
      <button
        className="mr-2 btn text-white green_contain_green_light"
        onClick={downloadStudents}
        disabled={loading}
      >
        <i className="fa fa-download" aria-hidden="true"></i>{" "}
        {loading ? "Downloading..." : "Download List"}
      </button>

    </div>
  );
};

const CustomInput = forwardRef(
  (
    {
      value,
      onClick,
      week,
    }: { value: any; onClick: any; week: number | string },
    ref: LegacyRef<HTMLButtonElement> | undefined
  ) => (
    <button className="btn btn-outline-light" onClick={onClick} ref={ref}>
      {week} <i className="fad fa-calendar-day"></i>
    </button>
  )
);

type ActionsCtasProps = {
  class_selected: ClassItem | null | undefined;
  setActionFun: (action: "remove" | "transfer" | null) => void;
  students_length: number;
  showModalDelete: () => void;
  showModalTransferStudent: () => void;
};
const ActionsCtas: React.FC<ActionsCtasProps> = ({
  class_selected,
  setActionFun,
  showModalDelete,
  students_length,
  showModalTransferStudent,
}) => (
  <UncontrolledButtonDropdown color="danger">
    <DropdownToggle className="btn btn-danger dropdown-toggle green_contain_danger_light">
      Transfer & Delete Students <span className="caret"></span>
    </DropdownToggle>
    <DropdownMenu right className="pt-0">
      <DropdownItem header>
        <i className="fa-fw fad fa-people-arrows"></i> Transfer Students
      </DropdownItem>
      <DropdownItem
        className="py-2 "
        onClick={() => {
          setActionFun("transfer");
        }}
      >
        <i className="fa-fw fad fa-users"></i> Select Students to Transfer
      </DropdownItem>
      {students_length > 0 || class_selected ? (
        <DropdownItem className="py-2" onClick={showModalTransferStudent}>
          <i className="fa-fw fas fa-users"></i>{" "}
          {class_selected
            ? students_length > 0
              ? "Transfer Class"
              : "Transfer Class"
            : "Transfer All Students"}
        </DropdownItem>
      ) : null}
      <DropdownItem header>
        <i className="fa-fw fad fa-user-slash"></i> Remove Students
      </DropdownItem>
      <DropdownItem
        className="py-2"
        onClick={() => {
          setActionFun("remove");
        }}
      >
        <i className="fa-fw fad fa-users"></i> Select Students to Delete
      </DropdownItem>
      {students_length > 0 || class_selected ? (
        <DropdownItem className="py-2" onClick={showModalDelete}>
          <i className="fa-fw fas fa-users"></i>{" "}
          {class_selected
            ? students_length > 0
              ? "Remove Class & Students"
              : "Remove Class"
            : "Delete All Students"}
        </DropdownItem>
      ) : null}
    </DropdownMenu>
  </UncontrolledButtonDropdown>
);

type ActionsOptionsProps = {
  action: "transfer" | "remove" | null;
  disabled: boolean;
  confirmActionFun: () => void;
  cancelActionFun: () => void;
};
const ActionsOptions: React.FC<ActionsOptionsProps> = ({
  action,
  disabled,
  confirmActionFun,
  cancelActionFun,
}) => (
  <React.Fragment>
    <button className="btn btn-outline-light green_contain_gray" onClick={cancelActionFun}>
      Cancel
    </button>
    <button
      onClick={confirmActionFun}
      disabled={disabled}
      className={`btn ml-3 ${
        action === "remove" ? "btn-danger" : "btn-primary green_contain_green"
      }`}
    >
      {action === "remove" ? "Remove" : "Transfer"} Selected Students
    </button>
  </React.Fragment>
);

export default StudentsPage;
