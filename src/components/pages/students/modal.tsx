import React from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ClassItem } from "../../../models/classes";
import { ErrorType } from "../../../models/errors";

type ModalProps = {
  show: boolean;
  has_groups: boolean;
  loading: boolean;
  class_data?: ClassItem | undefined | null;
  fun?: () => void;
  handleType: (ev: { target: HTMLInputElement }) => void;
  toggle: () => void;
};

export const ClassModal = ({
  show,
  has_groups,
  fun,
  toggle,
  handleType,
  loading,
  class_data,
}: ModalProps) => (
  <Modal isOpen={show} toggle={toggle} className="bg-white" id="class_modal">
    <ModalHeader className="text-white" toggle={toggle}>
      {!has_groups
        ? "First you need to add a Class"
        : class_data
        ? "Edit Class Name"
        : "New Class Group"}
    </ModalHeader>
    <ModalBody>
      <input
        className="form-control"
        type="text"
        id="class_name"
        defaultValue={class_data?.txt}
        placeholder="Class Period"
        onChange={handleType}
        disabled={loading}
      />
    </ModalBody>
    <ModalFooter>
      <Button
        color="success"
        id="add_class_fun"
        className="btn-block"
        onClick={fun}
        disabled={loading}
      >
        Save Class
      </Button>
    </ModalFooter>
  </Modal>
);

type RemoveModalProps = {
  show: boolean;
  loading: boolean;
  class_data?: ClassItem | undefined | null;
  fun?: () => void;
  toggle: () => void;
};

export const RemoveModal = ({
  show,
  fun,
  toggle,
  loading,
  class_data,
}: RemoveModalProps) => (
  <Modal isOpen={show} toggle={toggle} className="bg-white">
    <ModalHeader className="text-white" toggle={toggle}>
      {class_data ? (
        <span>
          Remove Class: <i>{class_data.txt}</i>?
        </span>
      ) : (
        "Delete All Students?"
      )}
    </ModalHeader>
    <ModalBody>
      <p>
        All your students{class_data ? " in this class " : ""} will lose access
        to Flangoo
        <br />
        <span className="text-danger">This action cannot be reverted</span>{" "}
      </p>
    </ModalBody>
    <ModalFooter>
      <Button
        color="danger"
        className="btn-block"
        onClick={fun}
        disabled={loading}
      >
        Yes,{" "}
        {class_data ? " Remove Class and Students " : "Delete All Students"}
      </Button>
    </ModalFooter>
  </Modal>
);

type RemoveModalStudentProps = {
  show: boolean;
  fun?: any;
  toggle: () => void;
  students_num: number;
  loading: boolean;
};

export const RemoveModalStudent = ({
  show,
  fun,
  toggle,
  students_num,
  loading,
}: RemoveModalStudentProps) => (
  <Modal isOpen={show} toggle={toggle} className="bg-white">
    <ModalHeader className="text-white" toggle={toggle}>
      Remove <i>{students_num}</i> {students_num === 1 ? "Student" : "Student"}
      s?
    </ModalHeader>
    <ModalBody>
      <p>
        Removed {students_num === 1 ? "student" : "students"} will lose access
        to Flangoo
        <br />
        <span className="text-danger">This action cannot be reverted</span>{" "}
      </p>
    </ModalBody>
    <ModalFooter>
      <Button
        color="danger"
        className="btn-block"
        onClick={fun}
        disabled={loading}
      >
        Yes, Remove {students_num} {students_num === 1 ? "Student" : "Students"}
      </Button>
    </ModalFooter>
  </Modal>
);

type TransferModalStudentProps = {
  show: boolean;
  teacher_email: string;
  fun?: any;
  toggle: () => void;
  handleTeacherEmailType: (ev: { target: HTMLInputElement }) => void;
  students_num: number;
  loading: boolean;
  error: ErrorType | false;
};

export const TransferModalStudent = ({
  show,
  fun,
  toggle,
  teacher_email,
  handleTeacherEmailType,
  students_num,
  loading,
  error,
}: TransferModalStudentProps) => {
  return (
    <Modal isOpen={show} toggle={toggle} className="bg-white">
      <ModalHeader className="text-white" toggle={toggle}>
        Transfer <i>{students_num === 0 ? "All" : students_num}</i>{" "}
        {students_num === 1 ? "Student" : "Students"}?
      </ModalHeader>
      <ModalBody>
        <p>
          This action will transfer your{" "}
          {students_num === 1 ? "student" : "students"} and all of their reading
          data to your colleague. We will send a notification to your colleague
          teacher to accept the students you are transferring
        </p>
        <p>
          We will send a notification to your colleague to accept the students
          you are transferring.
          <br />
          <br />
          You will transfer{" "}
          <b>
            {students_num === 0 ? "All your" : students_num}{" "}
            {students_num === 1 ? "student" : "students"}
          </b>{" "}
          to another teacher.
          <div className="form-group mt-3">
            <label htmlFor="teacheremail_input">Teacher's Email address</label>
            <input
              type="email"
              value={teacher_email}
              onChange={handleTeacherEmailType}
              className={`form-control ${error ? "bg-warning" : ""}`}
              id="teacheremail_input"
              aria-describedby="teacher_email"
            />
            <small id="teacher_email" className="form-text text-muted">
              The provided email should be for an active Flangoo account.
            </small>
          </div>
          <span className="text-danger">
            Once the teacher accepts, this action cannot be reverted.
          </span>{" "}
        </p>
        {error ? (
          <div className="alert alert-warning">
            <i className="fal fa-exclamation-circle "></i> {error?.message}
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <Button
          color="danger"
          className="btn-block"
          onClick={fun}
          disabled={loading}
        >
          {loading
            ? "Transfering..."
            : `Transfer ${students_num === 0 ? "All" : students_num} ${
                students_num === 1 ? "Student" : "Students"
              }`}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
