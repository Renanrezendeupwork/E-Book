import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";

import { LoaderBar, LoaderDots } from "../../../middleware/loaders";

import { ErrorType } from "../../../models/errors";
import { ClassItem } from "../../../models/classes";
import { GET_CLASSES, STUDENTSIGNUP } from "./queries";
import { IconJumbotron, PasswordInput } from "../../common/icons";
import { GoggleSignup } from "../../common/buttons";
import { isMobile } from "react-device-detect";

const auth = getAuth();

type StudentItem = {
  first_name?: string;
  last_name?: string;
  class_id?: string;
  password?: string;
  firebase_token?: string;
  firebase_id?: string;
};

const StudentsSelfSignup: React.FC = () => {
  const { token, group_id } = useParams<{
    token?: string;
    group_id?: string;
  }>();
  const [error, setError] = useState<ErrorType | null>(null);
  const [student_data, setStudent] = useState<StudentItem>({
    first_name: "",
    last_name: "",
    class_id: group_id ? group_id.replace(/\D/g, "") : "",
    password: "",
  } as StudentItem);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: classes_db } = useQuery<{ classes: ClassItem[] }>(GET_CLASSES, {
    variables: { teacher_id: token },
    fetchPolicy: "no-cache",
  });
  const [
    studentSignup,
    { loading: saving, data: new_student, error: save_error },
  ] = useMutation(STUDENTSIGNUP);

  useEffect(() => {
    ///login with Firebase on refresh
    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          return;
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          setError({
            message: "Something went wrong. Please try again.",
          });
          return;
        }
        const [first_name, last_name] = result.user.displayName
          ? result.user.displayName.split(" ")
          : "Student Name".split(" ");
        // The signed-in user info.
        const new_user: StudentItem = {
          firebase_id: result.user.uid,
          firebase_token: credential.accessToken,
          first_name,
          last_name,
        };
        signupHandlerGoogle(new_user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setError({
          message: "Something went wrong. Please try again.",
          reason: `${errorMessage} | Code: ${errorCode}`,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (save_error) {
      console.log("index.tsx:29 | save_error", save_error);
      const set_error: ErrorType = {
        message: save_error.graphQLErrors[0].message,
      };
      setError(set_error);
      setLoading(false);
    }
  }, [save_error]);
  useEffect(() => {
    if (new_student && new_student.addStudent) {
      const user = new_student.addStudent;
      user.type = "student";
      user.is_teacher = false;
      if (!user.lang_id) {
        user.lang_id = "1";
      }
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("logoutType");
      window.location.href = "/";
    }
  }, [new_student]);

  const signupHandler = async () => {
    if (loading) return; //// avoid multiple signups
    setLoading(true);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      await studentSignup({
        variables: {
          first_name: student_data.first_name,
          last_name: student_data.last_name,
          password: student_data.password,
          teacher_id: token,
          timezone,
          group_id: student_data.class_id,
        },
      });
    } catch (error) {
      console.log("index.tsx:78 | error", error);
    }
  };

  const signupHandlerGoogle = async (student: StudentItem) => {
    if (!student_data.class_id) {
      setError({ message: `Missing Class` });

      return;
    } //// avoid multiple signups
    if (loading) return; //// avoid multiple signups
    setLoading(true);
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      await studentSignup({
        variables: {
          first_name: student.first_name,
          last_name: student.last_name,
          firebase_token: student.firebase_token,
          firebase_id: student.firebase_id,
          teacher_id: token,
          timezone,
          group_id: student_data.class_id,
        },
      });
    } catch (error) {
      console.log("index.tsx:78 | error", error);
    }
  };

  const validateStudentData = () => {
    ////validate student input data
    let valid: true | keyof StudentItem = true;
    Object.keys(student_data).forEach((k) => {
      const key = k as keyof StudentItem;
      if (!student_data[key]) {
        valid = key;
      }
    });
    if (valid === true) {
      signupHandler();
    } else {
      setError({ message: `Missing ${valid}` });
    }
  };

  const enterPressed = (ev: React.KeyboardEvent): void => {
    var code = ev.keyCode || ev.which;
    if (code === 13) {
      //13 is the enter keycode
      validateStudentData();
    }
  };

  const handleType = (ev: {
    target: HTMLInputElement | HTMLSelectElement;
  }): void => {
    const set_student = { ...student_data };
    const value = ev.target.value;
    const type = ev.target.dataset.type as keyof StudentItem;
    if (!type) {
      return;
    }
    set_student[type] = value;
    setStudent(set_student);
  };

  return (
    <main>
      {loading ? <LoaderBar fixed /> : null}
      <div className="container login_div">
        <div className="row justify-content-center align-items-center min-vh-100 ">
          <div className="col-10 col-md-6">
            {token ? <h1>Student Sign-Up</h1> : null}
            {!token ? (
              <IconJumbotron
                icon="far fa-unlink"
                classes="text-danger mb-4"
                txt="Broken link"
                help_text="Looks like you have an incomplete URL. Please ask your teacher for a new one"
                cta={{
                  txt: "Return to Flangoo",
                  href: "https://cdn.flangoo.com",
                  classes: "btn btn-block btn-danger",
                }}
              />
            ) : (
              <SignupForm
                handleType={handleType}
                enterPressed={enterPressed}
                validateStudentData={validateStudentData}
                student_data={student_data}
                classes={classes_db ? classes_db.classes : false}
                group_id={student_data.class_id}
                error={error}
                setError={setError}
                loading={loading}
                saving={saving}
                signupHandler={signupHandlerGoogle}
              />
            )}
            <p>
              <small>
                <Link to="/login">Have an account?</Link>
              </small>
            </p>
          </div>
          <div className="col-10 col-md-6 text-right">
            <img
              src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
              className="img-fluid"
              alt="Flangoo Logo"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

type SignupFormProps = {
  handleType: any;
  enterPressed: any;
  validateStudentData: any;
  signupHandler: any;
  setError: any;
  student_data: StudentItem;
  classes: ClassItem[] | false;
  group_id: string | undefined;
  error: ErrorType | null;
  loading: boolean;
  saving: boolean;
};
const SignupForm: React.FC<SignupFormProps> = ({
  handleType,
  student_data,
  enterPressed,
  setError,
  classes,
  group_id,
  error,
  validateStudentData,
  loading,
  saving,
  signupHandler,
}) => {
  const handleGoogleSignupMob = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    const provider = new GoogleAuthProvider();

    signInWithRedirect(auth, provider);
  };

  const handleGoogleSignup = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          setError({
            message: "Something went wrong. Please try again.",
          });
          return;
        }
        const [first_name, last_name] = result.user.displayName
          ? result.user.displayName.split(" ")
          : "Student Name".split(" ");
        // The signed-in user info.
        const new_user: StudentItem = {
          firebase_id: result.user.uid,
          firebase_token: credential.accessToken,
          first_name,
          last_name,
        };
        signupHandler(new_user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setError({
          message: "Something went wrong. Please try again.",
          reason: `${errorMessage} | Code: ${errorCode}`,
        });
      });
  };

  return (
    <>
      {classes ? (
        <div className={`form-group `}>
          <label className="text-white">
            Class Period {group_id ? "" : "(If applicable)"}
          </label>
          <select
            className="form-control"
            data-type="class_id"
            id="class_id"
            onChange={handleType}
            value={student_data.class_id}
            disabled={group_id ? true : false}
          >
            <option>Select Class</option>
            {classes.map((item) => (
              <option
                key={`classes_db.classes_${item.value}`}
                value={item.value}
              >
                {item.txt}
              </option>
            ))}
          </select>
          <hr className="text-white" />
        </div>
      ) : null}{" "}
      <GoggleSignup
        txt="Sign up"
        fun={isMobile ? handleGoogleSignupMob : handleGoogleSignup}
      />
      <p className="text-center my-2 text-white">
        <small>Or</small>
      </p>
      <div className="card material-shadows">
        <div className="card-body">
          <div className={`form-group `}>
            <label>First Name</label>
            <input
              onChange={handleType}
              type="text"
              data-type="first_name"
              id="first_name"
              value={student_data.first_name}
              className="form-control"
              placeholder="First Name"
              onKeyPress={enterPressed}
            />
          </div>
          <div className={`form-group `}>
            <label>Last Name</label>
            <input
              onChange={handleType}
              type="text"
              data-type="last_name"
              id="last_name"
              value={student_data.last_name}
              className="form-control"
              placeholder="Last Name"
              onKeyPress={enterPressed}
            />
          </div>

          <div className={`form-group `}>
            <label>Password</label>
            <PasswordInput
              placeholder={`Type your new password`}
              handleType={handleType}
              data_type="password"
              id="password"
              value={student_data.password}
              onKeyPress={enterPressed}
            />
          </div>
          {error ? (
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle shake_anim"></i>{" "}
              {error.message}
            </div>
          ) : null}
          <button
            type="button"
            id="create_student"
            className="btn btn-raised btn-danger btn-block btn_xs_lg py-3"
            disabled={loading}
            onClick={validateStudentData}
          >
            {loading || saving ? (
              <LoaderDots
                // size="15"
                color="#333a40"
                centered={false}
                display="p-0"
              />
            ) : (
              "Register"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default StudentsSelfSignup;
