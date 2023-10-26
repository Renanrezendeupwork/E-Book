import React, { useEffect, useState } from "react";
import SelectSearch from "react-select-search";
import { UserItem } from "../../../models/user";
import { IconJumbotron } from "../../common/icons";
import { useMutation, useQuery } from "@apollo/client";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import { CANCEL_TRANSFER, GET_STUDENTS, HANDLE_STUDENTS } from "./queries";
import { FilterFun, SelectSearchItem } from "../../../models/filters";
import { ClassItem, NewClassItem } from "../../../models/classes";
import { CREATE_CLASS } from "../students/queries";
import { ClassModal } from "../students/modal";
import {
  StudentTransferItem,
  StudentsTransferType,
} from "../../../models/student";

const TransferStudents = () => {
  const { data, loading, error, refetch } = useQuery<{
    studentsTransfer: StudentsTransferType[];
    classes: ClassItem[];
  }>(GET_STUDENTS, {
    fetchPolicy: "cache-and-network",
  });
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);

  useEffect(() => {
    if (data) {
      setClasses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const setClasses = () => {
    if (!data) {
      return;
    }
    const groups: SelectSearchItem[] = data.classes.map((item: ClassItem) => {
      return { name: item.txt, value: item.value };
    });
    groups.push({ name: "Assign to a New Class", value: "new" });
    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };

  return (
    <main className="first-container last-container transfer_students_page">
      {loading ? <LoaderBar fixed /> : null}
      <div className="container">
        <h1>Handle Student Transfers</h1>
        <p>
          In this section you can <b>accept, reject or cancel</b> student
          transfers from another teacher.
        </p>
        {error ? <p>{error.message}</p> : null}
        {data && data.studentsTransfer.length ? (
          data.studentsTransfer.map((item) => (
            <StudentsList
              type={item.type}
              reload={refetch}
              classGroups={classGroups}
              key={`StudentsList_${item.teacher.id}`}
              students={item.students}
              teacher={item.teacher}
            />
          ))
        ) : loading ? (
          <LoaderDots />
        ) : (
          <IconJumbotron
            classes="my-4"
            icon="fad fa-transporter-3"
            txt="No Pending Transfer"
            help_text="You currently do not have any pending student transfers."
            cta={{
              classes: "btn btn-primary",
              link: "/students",
              txt: "Go to Students",
            }}
          />
        )}
      </div>
    </main>
  );
};

type StudentsListProps = {
  students: StudentTransferItem[];
  teacher: UserItem;
  type: "sent" | "received";
  reload: () => void;
  classGroups: SelectSearchItem[];
};
const StudentsList: React.FC<StudentsListProps> = ({
  students,
  teacher,
  type,
  classGroups,
  reload,
}) => {
  const students_txt = students.length > 1 ? "students" : "student";
  const [handleStudentsMutation, { loading: loading_handle, called }] =
    useMutation(HANDLE_STUDENTS);
  const [
    cancelTransferMutation,
    { loading: loading_cancel, called: called_cancel },
  ] = useMutation(CANCEL_TRANSFER);
  const [class_selected, setClassSelected] = useState<string | null>();
  const [createClass, { loading: loading_save, data: new_class }] =
    useMutation(CREATE_CLASS);
  const [class_data, setClass] = useState<NewClassItem>({} as NewClassItem);
  const [modal, setModal] = useState<boolean | string>(false);

  useEffect(() => {
    if (new_class) {
      handleStudentsMutation({
        variables: {
          action: "accept",
          students_ids: students.map((item) => item.id),
          class_id: new_class.classGroup.id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [new_class]);
  useEffect(() => {
    if ((called || called_cancel) && !loading_handle) {
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [called, called_cancel, loading_handle]);

  const saveClass = async () => {
    const data: { name: string | undefined; id?: string } = {
      name: class_data.txt,
    };
    await createClass({ variables: data });
    setModal(false);
    setClass({ txt: " " });
  };

  const handleClassType = (ev: { target: HTMLInputElement }) => {
    const class_name = ev.target.value;
    setClass({ txt: class_name });
  };

  const showModal = () => {
    setModal(true);
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

  const handleSelectClass = (selected_id: any) => {
    const set_selected = classGroups.find((g) => g.value === selected_id);
    if (set_selected) {
      setClassSelected(set_selected.value);
    }
  };

  const handleStudents = (ev: any) => {
    const action = ev.target.value;
    if (action === "accept" && !class_selected) {
      return;
    }
    if (action === "accept" && class_selected === "new") {
      showModal();
      return;
    }
    handleStudentsMutation({
      variables: {
        action,
        students_ids: students.map((item) => item.id),
        class_id: class_selected,
      },
    });
  };

  const cancelTransfer = (ev: any) => {
    const teacher_id = ev.target.value;
    cancelTransferMutation({
      variables: {
        teacher_id,
      },
    });
  };

  return (
    <div className="card transfer_card">
      <LoaderBar fixed />
      <div className="card-body">
        <div className="row justify-content-between">
          <div className="col-md-5 card_info">
            <div>
              <h4 className="text-dark mb-0">
                {type === "received" ? "From" : "To"}: {teacher.name}
              </h4>
              <span className="badge badge-primary mr-2">
                <i className="fas fa-envelope"></i> {teacher.email}
              </span>
              <span className="badge badge-primary">
                <i
                  className={`fas fa-${
                    students.length > 1
                      ? students.length === 2
                        ? "user-friends"
                        : "users"
                      : "user1"
                  }`}
                ></i>{" "}
                {students.length} {students_txt}
              </span>
            </div>
            {type === "received" ? (
              <>
                {" "}
                <small className="text-dark">Assign to class:</small>
                <SelectSearch
                  search
                  value={class_selected || undefined}
                  onChange={handleSelectClass}
                  emptyMessage="Class not found"
                  filterOptions={filterOptions}
                  options={classGroups}
                  placeholder="Select a Class Group"
                />
                <small className="text-secondary">
                  To accept the {students_txt}, please select a class to add
                  them to.
                </small>
              </>
            ) : (
              <small className="text-secondary">
                You are sending {students.length} {students_txt} to another
                teacher. Waiting for approval.
              </small>
            )}
            {type === "received" ? (
              <div className="ctas">
                <button
                  className="btn btn-outline-danger"
                  onClick={handleStudents}
                  value="reject"
                  disabled={loading_cancel}
                >
                  <i className="fas fa-times"></i> Reject {students_txt}
                </button>
                <button
                  className={`btn btn-success ${
                    !class_selected ? "disabled" : ""
                  }`}
                  onClick={handleStudents}
                  value="accept"
                  disabled={!class_selected || loading_handle}
                >
                  <i className="fas fa-check"></i> Accept {students.length}{" "}
                  {students_txt}
                </button>
              </div>
            ) : (
              <div className="ctas">
                <button
                  onClick={cancelTransfer}
                  value={teacher.id}
                  className="btn btn-outline-danger"
                  disabled={loading_handle}
                >
                  <i className="fas fa-times"></i> Cancel Transfer
                </button>
              </div>
            )}
          </div>
          <div className="col-md-5 students_table">
            <table className="table bg-white table-hover">
              <tr>
                <th>#</th>
                <th>Student Name</th>
              </tr>
              {students.map((student, key) => (
                <tr key={`student_row${student.id}`}>
                  <td>#{key + 1}</td>
                  <td>{student.name}</td>
                </tr>
              ))}
            </table>
          </div>
        </div>
      </div>
      {modal ? (
        <ClassModal
          show
          class_data={null}
          loading={loading_save}
          toggle={() => {
            setModal(false);
          }}
          handleType={handleClassType}
          has_groups={classGroups && classGroups.length > 1}
          fun={saveClass}
        />
      ) : null}
    </div>
  );
};

export default TransferStudents;
