import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams, useHistory } from "react-router-dom";

import React, { useEffect, useState } from "react";

import { ClassItem } from "../../../models/classes";
import { ErrorType } from "../../../models/errors";
import { GET_CLASSES, SAVE_STUDENT } from "./queries";
import { Helmet } from "react-helmet";

type StudentItem = {
  first_name: string;
  last_name: string;
  class_id: string;
};

type QueryResult = {
  classes: ClassItem[];
};
const AddStudent: React.FC = () => {
  const { class_id } = useParams<{ class_id?: string }>();
  const [student, setStudent] = useState<StudentItem>({
    class_id: class_id,
  } as StudentItem);
  const [error, setError] = useState<ErrorType | null>(null);
  const history = useHistory();
  const [disabledSave, setDisabledSave] = useState(true);
  const [saveStudent, { loading: loading_save, error: save_error }] =
    useMutation(SAVE_STUDENT);
  const { data: classes_db } = useQuery<QueryResult>(GET_CLASSES, {
    fetchPolicy: "no-cache",
  });
  useEffect(() => {
    if (save_error) {
      console.log("index.tsx:29 | save_error", save_error);
      const set_error: ErrorType = {
        message: save_error.graphQLErrors[0].message,
      };
      setError(set_error);
    }
  }, [save_error]);

  useEffect(() => {
    if (
      student.class_id &&
      student.first_name &&
      student.first_name.length > 0 &&
      student.last_name &&
      student.last_name.length > 0
    ) {
      setDisabledSave(false);
    } else {
      setDisabledSave(true);
    }
  }, [student]);

  const handleType = (ev: { target: HTMLInputElement | HTMLSelectElement }) => {
    const type = ev.target.dataset.type as keyof StudentItem;
    const value = ev.target.value;
    const set_student = { ...student };
    set_student[type] = value;
    setStudent(set_student);
  };

  const handleSave = async () => {
    if (disabledSave) {
      if (!student.class_id) {
        setError({ message: "Please add a Class Period" });
      } else {
        setError({ message: "Please add student's name and last name " });
      }
      return false;
    }
    try {
      await saveStudent({
        variables: {
          first_name: student.first_name,
          last_name: student.last_name,
          class_id: student.class_id,
        },
      });

      history.push({
        pathname: `/students/${student.class_id}`,
      });
    } catch (er) {
      console.log("index.tsx:75 | er", er);
    }
  };

  return (
    <main className="first-container last-container py-5">
      <Helmet title="Add Students" />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="card card-default">
            <div className="card-body">
              <div className="card-title">
                <h2 className="text-dark">Add Student</h2>
              </div>
              <div className="form-group mb-3">
                <label htmlFor="name">First Name</label>
                <input
                  type="text"
                  onChange={handleType}
                  className="form-control"
                  data-type="first_name"
                  id="first_name"
                  autoComplete="new-password"
                  value={student?.first_name}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  onChange={handleType}
                  className="form-control"
                  data-type="last_name"
                  id="last_name"
                  autoComplete="new-password"
                  value={student?.last_name}
                />
              </div>
              <div className="form-group mb-3">
                <label htmlFor="plan_id">Class Period</label>
                <select
                  className="form-control"
                  data-type="class_id"
                  id="class_id"
                  value={student.class_id}
                  onChange={handleType}
                >
                  <option value="0">Select a Class</option>
                  {classes_db && classes_db.classes.length > 0 ? (
                    classes_db.classes.map((item, key) => (
                      <option
                        key={item.value}
                        value={item.value}
                        id={`class_id_${item.value}`}
                      >
                        {item.txt}
                      </option>
                    ))
                  ) : (
                    <option value="0">Loading Classes</option>
                  )}
                </select>
              </div>
              <hr />
              {error ? (
                <div className="alert alert-warning">{error.message}</div>
              ) : (
                <div className="alert alert-info">
                  <i className="alert_icon fal fa-lightbulb-exclamation"></i>{" "}
                  Password will be: <b>changeme </b>
                  <br /> Instruct students to change their password on first
                  login.
                </div>
              )}
              <button
                className="btn btn-success btn-block "
                disabled={loading_save}
                onClick={handleSave}
                id="save_student"
              >
                {loading_save ? "Saving..." : "Add Student"}
              </button>
              <Link to="/students" className="btn btn-black mt-4">
                <i className="fa fa-angle-left" aria-hidden="true"></i> Go Back
                to Student List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddStudent;
