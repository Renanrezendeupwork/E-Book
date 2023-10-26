import React, { useEffect, useState, useContext } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";
import { isMobile } from "react-device-detect";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";

import {
  GET_STUDENT,
  GETRESPONSES,
  GET_GRADES,
  UPDATE_STUDENT,
  REMOVE_STUDENT,
} from "./queries";
import { SETPREFF } from "../profile/queries";
import History from "./history";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import { toDate } from "../../../middleware/dates";
import {
  HistoryItem,
  StudentFields,
  StudentItem,
} from "../../../models/student";
import ResponseTable from "./responses";
import { ReaderItem } from "../../../models/reader";
import { Grades } from "../../../models/grades";
import GradesTable from "../grades/table";
import { ALLOW_RETAKE } from "../readerpage/queries";
import { IconJumbotron, PasswordInput } from "../../common/icons";
import { UserItem, UserSettings } from "../../../models/user";
import { ClassItem } from "../../../models/classes";
import RemoveStudent from "./modal";
import { ChapterQuestion } from "../../../models/questions";
import { CopyButton, GoggleSignup } from "../../common/buttons";
import { ErrorType } from "../../../models/errors";
import Appearance from "../settings/appearance";
import { DataContext } from "../../../context/data-context";

type GoBack = () => void;
interface GetGradesData {
  grades: Grades[];
}

const provider = new GoogleAuthProvider();

const auth = getAuth();

const Student: React.FC = () => {
  const dataContext = useContext(DataContext);
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const set_user = dataContext.user as UserItem;
  const student_txt = user.is_teacher ? "student" : "your";
  const [book, setBook] = useState<ReaderItem | false>(false);
  const [error, setError] = useState<ErrorType | false>(false);
  const [responses_data, setResponses_data] = useState<
    { bookQuestions: ChapterQuestion[] } | false
  >(false);
  const [loadingResponses, setLoadingResponses] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [student, setStudent] = useState<StudentItem>({} as StudentItem);
  const local_settings = set_user.settings as UserSettings;
  const [settings, setSettings] = useState(local_settings as UserSettings);
  const [removeStudent, { loading: loading_remove }] =
    useMutation(REMOVE_STUDENT);
  const [setPreff] = useMutation(SETPREFF);

  const { student_id, section, id } = useParams<{
    student_id: string;
    section: string;
    id: string;
  }>();

  const {
    data: db_data,
    loading,
    refetch,
  } = useQuery(GET_STUDENT, {
    variables: { id: user.is_teacher ? student_id : user.id },
    fetchPolicy: "no-cache",
  });

  const [
    getResponses,
    {
      data: responsesData,
      refetch: refetchResponses,
      loading: loading_responses,
    },
  ] = useLazyQuery(GETRESPONSES, {
    fetchPolicy: "no-cache",
  });

  const [getGrades, { data: grades_data }] = useLazyQuery<GetGradesData>(
    GET_GRADES,
    {
      fetchPolicy: "no-cache",
    }
  );

  const [allowRetakeMutation, { loading: loading_allaow }] =
    useMutation(ALLOW_RETAKE);
  const [updateStudent, { loading: loading_update, error: update_error }] =
    useMutation(UPDATE_STUDENT);
  const history = useHistory();

  useEffect(() => {
    if (!student || !student.id) {
      return;
    }
    ///login with Firebase on refresh
    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          return;
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user;
        //@ts-ignore next-line
        const firebase_token = user.accessToken;
        updateStudentPropmt({ firebase_token });
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
  }, [student]);

  useEffect(() => {
    if (settings) {
      dataContext.setSettings(settings);
    }
    // eslint-disable-next-line
  }, [settings]);
  useEffect(() => {
    if (book) {
      getResponses({ variables: { book_id: book.id, student_id: student_id } });
    }
    // eslint-disable-next-line
  }, [book, student_id]);
  useEffect(() => {
    if (update_error) {
      setError({ message: update_error.graphQLErrors[0].message });
    }
    // eslint-disable-next-line
  }, [update_error]);

  useEffect(() => {
    if (responsesData) {
      setResponses_data(responsesData);
    }
    // eslint-disable-next-line
  }, [responsesData]);

  useEffect(() => {
    if (user.is_teacher && student_id) {
      getGrades({ variables: { student_id } });
    } else if (!user.is_teacher && settings.hide_quizzes !== true) {
      getGrades({ variables: { student_id: user.id } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student_id]);

  useEffect(() => {
    if (db_data) {
      setStudent(db_data.student);
      if (section) {
        if ((section === "responses" || section === "chapter_retake") && id) {
          getReader(id);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, id, db_data]);

  const goBack = () => {
    if (history) {
      history.push("/students");
    }
  };

  const handleSelectBook = (ev: { currentTarget: HTMLInputElement }) => {
    const book_id = ev.currentTarget.dataset.book_id;
    if (!book_id) {
      setBook(false);
      return;
    }
    getReader(book_id);
  };

  const promtRemove = () => {
    setShowModal(true);
  };

  const removeStudentFun = async () => {
    setShowModal(true);
    try {
      await removeStudent({ variables: { ids: [student_id] } });
      goBack();
    } catch (error) {
      console.log(error);
    }
  };

  const toggleModal = () => {
    const set_modal = !showModal;
    setShowModal(set_modal);
  };

  const getReader = (book_id: string): void => {
    if (!book_id) {
      return;
    }
    const current_history: HistoryItem | undefined =
      db_data.student.history.find((r: HistoryItem) => r.book.id === book_id);
    if (current_history) {
      setBook({
        ...current_history?.book,
        score: current_history.score,
        allow_retake: current_history.allow_retake,
      });
    }
  };

  const allowRetake = async (
    student_id: string,
    allow: boolean,
    book_id: string,
    chapter?: string
  ) => {
    await allowRetakeMutation({
      variables: { book_id, student_id: student_id, allow: allow, chapter },
    });
    getGrades({ variables: { student_id } });
    getResponses({ variables: { book_id, student_id } });
    refetch();
  };

  const updateStudentPropmt = async ({
    firebase_token,
  }: {
    firebase_token?: string;
  }) => {
    await updateStudent({
      variables: {
        id: student.id,
        first_name: student.first_name,
        last_name: student.last_name,
        class_id: student.class_id,
        password: student.password || undefined,
        firebase_token,
      },
    });
    refetch();
  };

  const handleType = (ev: { target: HTMLInputElement | HTMLSelectElement }) => {
    const type: StudentFields = ev.target.dataset.type as StudentFields;
    if (!type) return;
    const set_student = { ...student };
    const value = ev.target.value;
    set_student[type] = value;

    setStudent(set_student);
  };

  const refetchResFun = () => {
    setLoadingResponses(true);
    if (refetchResponses) {
      refetchResponses();
      refetch();
    }
    setTimeout(() => {
      setLoadingResponses(false);
    }, 1000);
  };

  const handleUpdateSetting = (setting: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [setting]: value });
    ///run mutation to update settings
    setPreff({
      variables: {
        pref_value: value.toString(),
        pref_key: setting,
        is_global: false,
      },
    });
  };

  if (loading || loading_remove) {
    return (
      <div className="first-container student_page last-container">
        <LoaderDots />
      </div>
    );
  }

  if (!db_data || !db_data.student) {
    return (
      <div className="first-container student_page last-container">error</div>
    );
  }

  return (
    <main className="first-container student_page last-container">
      {loading_responses || loading_allaow ? <LoaderBar fixed={true} /> : null}
      <div className="container-fluid students_page mt-5 pt-2">
        <div className="row ">
          <div className="col-md-3">
            <HeadingData student={db_data.student} />
            {user.is_teacher || settings.block_password_change !== true ? (
              <FormData
                student={student}
                goBack={goBack}
                updateStudent={updateStudentPropmt}
                errorHook={[error, setError]}
                handleType={handleType}
                classess={db_data.classes}
                loading={loading_update}
              />
            ) : null}
            {user.is_teacher ? (
              <button
                onClick={promtRemove}
                className="btn btn-link btn-block mt-4 text-danger"
              >
                Remove Student
              </button>
            ) : (
              <Appearance setSettings={handleUpdateSetting} />
            )}
          </div>
          <div className="col-md-9">
            {student_id === "change_pass" ? (
              <div className="alert alert-success">
                <h1>Welcome to Flangoo!</h1>
                <p>Please change your password on the box from below</p>
              </div>
            ) : null}
            {book && responses_data ? (
              <ResponseTable
                data={
                  responses_data.bookQuestions
                    ? responses_data.bookQuestions.sort((a, b) =>
                        parseInt(a.chapter) > parseInt(b.chapter) ? 1 : -1
                      )
                    : []
                }
                refetch={refetchResFun}
                refetch_loading={loadingResponses}
                allowRetake={allowRetake}
                book_title={book.title}
                reader_id={book.id}
                student={student}
                allow_retake={book.allow_retake}
                score={book.score!}
                back={handleSelectBook}
                loading_request={loading_allaow}
              />
            ) : null}
            {!book ? (
              <History
                data={db_data.student.history}
                handleSelectBook={handleSelectBook}
                student_name={db_data.student.name}
                hide_score={settings.hide_quizzes === true || false}
              />
            ) : null}

            {settings.hide_quizzes === true ? null : (
              <div className="card card-default mt-3">
                <div className="card-body">
                  <div className="card-title text-capitalize">
                    {" "}
                    {student_txt} Grades
                  </div>
                  {grades_data && grades_data.grades.length > 0 ? (
                    <GradesTable
                      refetch={refetch}
                      grades_data={grades_data.grades}
                      handleSelectBook={handleSelectBook}
                      show_student={false}
                    />
                  ) : (
                    <IconJumbotron
                      txt="No Grades to Show"
                      classes="mt-5 mb-3"
                      txt_classes="text-secondary"
                      icon="fal fa-sticky-note"
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <RemoveStudent
        show={showModal}
        student={student}
        confirm={removeStudentFun}
        toggle={toggleModal}
      />
    </main>
  );
};

const HeadingData: React.FC<{ student: StudentItem }> = ({ student }) => (
  <div className="student_data">
    <h4>{student.name}</h4>
    <p>
      Login Code:
      <CopyButton classes="ml-1 green_dark" text={student.login_code}>
        {" "}
        {student.login_code}{" "}
      </CopyButton>
    </p>
    <p>
      Class Period:{" "}
      {student.class ? (
        student.class.name
      ) : (
        <span className="text-muted">No Class assigned</span>
      )}{" "}
    </p>
    <p>
      Last Seen:{" "}
      {student.last_login ? (
        toDate(student.last_login)
      ) : (
        <span className="text-muted">Not logged</span>
      )}{" "}
    </p>
    <p>
      Logged: <strong>{student.minutes}</strong> <small>this week</small> |{" "}
      <strong>{student.semester_minutes}</strong> <small>total time</small>{" "}
    </p>
  </div>
);

type FormDataProps = {
  goBack: GoBack;
  student: StudentItem;
  classess: ClassItem[];
  handleType: any;
  errorHook: [ErrorType | false, any];
  updateStudent: any;
  loading: boolean;
};
const FormData: React.FC<FormDataProps> = ({
  goBack,
  student,
  handleType,
  updateStudent,
  errorHook,
  classess,
  loading,
}) => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [error, setError] = errorHook;

  const student_txt = user.is_teacher ? "student" : "your";
  const handleGoogleSignup = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        //@ts-ignore next-line
        const firebase_token = user.accessToken;
        updateStudent({ firebase_token });
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
  const handleGoogleSignupMob = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    signInWithRedirect(auth, provider);
  };
  return (
    <div className="card card-default">
      <div className="card-body">
        {user.is_teacher ? (
          <div className="student_data">
            <div className="card-title">Student Info </div>
            <div className="form-group mb-3">
              <label htmlFor="name">First Name</label>
              <input
                type="text"
                className="form-control"
                onChange={handleType}
                autoComplete="new-password"
                data-type="first_name"
                value={student.first_name}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="last_name">Last Name</label>
              <input
                type="text"
                className="form-control"
                onChange={handleType}
                autoComplete="new-password"
                data-type="last_name"
                value={student.last_name}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="plan_id">Class Period</label>
              <select
                className="form-control"
                data-type="class_id"
                value={student.class_id}
                onChange={handleType}
              >
                <option value="false">Select a Class Group</option>
                {classess.map((item) => (
                  <option value={item.value} key={`classess.map_${item.value}`}>
                    {item.txt}
                  </option>
                ))}
              </select>
            </div>
            <hr />
          </div>
        ) : (
          <>
            {student.firebase_id ? (
              <p className="text-success w-100 text-center small mb-2">
                Your Google account is connected
              </p>
            ) : null}
            <GoggleSignup
              disalbed={loading}
              txt={student.firebase_id ? "Un-link account " : "Link account "}
              fun={
                student.firebase_id
                  ? () => updateStudent({ firebase_token: "remove" })
                  : isMobile
                  ? handleGoogleSignupMob
                  : handleGoogleSignup
              }
            />
            <hr />
          </>
        )}

        <div className="form-group mb-3">
          <label htmlFor="email">Update Password</label>
          <PasswordInput
            placeholder={`Change ${student_txt} password`}
            handleType={handleType}
            data_type="password"
          />
        </div>
        {error ? (
          <div className="alert alert-danger">
            <i className="far fa-exclamation-triangle text-white"></i>{" "}
            {error.message}
          </div>
        ) : null}
        <div className="form-group">
          <button
            className="btn btn-success btn-block"
            onClick={updateStudent}
            disabled={loading}
          >
            {loading ? "Updaiting" : "Update"}
          </button>
        </div>
        {user.is_teacher ? (
          <button onClick={goBack} className="btn btn-black">
            <i className="fa fa-angle-left" aria-hidden="true"></i> Go Back to
            Student List
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Student;
