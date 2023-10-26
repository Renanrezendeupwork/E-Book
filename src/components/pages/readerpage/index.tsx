import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";

import { LoaderDots } from "../../../middleware/loaders";
import { IconJumbotron } from "../../common/icons";

import { GET_RESPONSE, GET_RESPONSE_STUDENT, REQUEST_RETAKE } from "./queries";
import { ReaderItem } from "../../../models/reader";
import ResponseTable from "./response_table";
import StudentsQuizTable from "./students_quiz_table";
import {
  BottomInfoProps,
  DB_response,
  FilterTypes,
  TabOptions,
} from "./models";
import { StudentItem } from "../../../models/student";
import { ChapterQuestion, Userquiz } from "../../../models/questions";
import { useMutation } from "@apollo/client";
import { FilterFun, SelectSearchItem } from "../../../models/filters";
import { ClassItem } from "../../../models/classes";
import { useRef } from "react";
import Reviews from "./student_reviews";
import BookInfo from "./bookInfo";

const Reader: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const video_ref = useRef<HTMLVideoElement>(null);
  const local_readers = localStorage.getItem("local_readers")
    ? JSON.parse(localStorage.getItem("local_readers") || "{}")
    : false;
  const { reader_id } = useParams<{ reader_id: string }>();
  const [reader, setReader] = useState<ReaderItem | false>(false);
  const [activeTab, setActiveTab] = useState<TabOptions>("quiz");
  const [filter, setFilter] = useState<FilterTypes>(false);
  const [video, setVideo] = useState({ play: false });
  const [classGroups, setClassGroups] = useState<SelectSearchItem[]>([]);
  const [class_selected, setClassSelected] = useState<ClassItem | null>();
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [student, setStudent] = useState<StudentItem | false>(false);
  const [quizResponse, setquizResponse] = useState<Userquiz[]>([]);
  const {
    data: db_readers,
    refetch: refetch_db_readers,
    loading: loading_reader,
  } = useQuery<DB_response>(GET_RESPONSE, {
    variables: { book_id: reader_id },
    skip: !user.is_teacher,
    fetchPolicy: "no-cache",
  });

  const {
    data: db_student,
    refetch: refetch_db_student,
    loading: loading_reader_student,
  } = useQuery<DB_response>(GET_RESPONSE_STUDENT, {
    variables: {
      book_id: reader_id,
      student_id: user.id,
      class_id: user.class_id,
    },
    skip: user.is_teacher,
    fetchPolicy: "no-cache",
  });
  const [requestRetakeMutation, { loading: loading_request }] =
    useMutation(REQUEST_RETAKE);
  const history = useHistory();
  useEffect(() => {
    getReader(local_readers);
    const book_info = document.getElementById("book_info");
    if (book_info) {
      book_info.scrollIntoView({ block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader_id]);

  useEffect(() => {
    if (db_readers) {
      if (db_readers.bookQuestions) {
        renderquizResponse(db_readers.bookQuestions);
      }
      if (db_readers.students) {
        filterStudentsFun(filter === false ? false : "reload");
      }
      if (db_readers.classes) {
        setClasses();
      }
      if (db_readers.book) {
        setReader(db_readers.book);
      }
    } else if (db_student) {
      if (db_student.book) {
        setReader(db_student.book);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_readers, db_student, class_selected]);

  useEffect(() => {
    if (db_student) {
      if (db_student.bookQuestions) {
        renderquizResponse(db_student.bookQuestions);
        setStudent(db_student.student);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_student]);

  const setClasses = () => {
    const groups: SelectSearchItem[] = db_readers!.classes.map(
      (item: ClassItem) => {
        return { name: item.txt, value: item.value };
      }
    );
    groups.push({ name: "- See All", value: "0" });
    setClassGroups(groups.sort((a, b) => (a.name > b.name ? 1 : -1)));
  };

  const renderquizResponse = (bookQuestions: ChapterQuestion[]) => {
    const response: Userquiz[] = [];
    bookQuestions.forEach((question) => {
      ///loook if chapter exists
      const exists: number = response.findIndex(
        (q) => q.chapter === question.chapter
      );
      if (exists >= 0) {
        response[exists].responses?.push({ correct: question.correct });
        return;
      } else {
        const user_quiz: Userquiz = {
          chapter: question.chapter,
          requested_retake: question.requested_retake,
          timestamp: question.timestamp,
          updated: question.updated,
          responses: [{ correct: question.correct }],
        };
        response.push(user_quiz);
      }
    });
    setquizResponse(response);
  };

  const getReader = (readers: ReaderItem[]): void => {
    if (!readers) {
      return;
    }
    const get_reader: ReaderItem | undefined = readers.find(
      (r: ReaderItem) => r.id === reader_id
    );
    if (get_reader) {
      setReader(get_reader);
    }
  };

  const filterStudents = (ev: { currentTarget: HTMLButtonElement }) => {
    const filter_by = ev.currentTarget.dataset.type as FilterTypes;
    if (!filter_by) return;
    filterStudentsFun(filter_by);
  };

  const filterStudentsFun = (filter_by: FilterTypes) => {
    const students = [...db_readers!.students];
    ///filter by class if needed
    const filtered_by_class = students.filter((student) => {
      if (class_selected && class_selected.value !== student.class.id)
        return false;
      return true;
    });
    if (filter === filter_by) {
      setFilter(false);
      setStudents(filtered_by_class);
      return;
    }
    if (filter_by === "reload") {
      filter_by = filter;
    }

    const filtered_studednts = filtered_by_class.filter((student) => {
      const history = student.history[0];
      if (filter_by === "passed") {
        if (!history) return false;
        if (history.score && history.score >= 7) return true;
      } else if (filter_by === "missing") {
        if (!history) return true;
      } else if (filter_by === "failed") {
        if (!history) return false;
        if (history.score && history.score < 7) return true;
      }
      return false;
    });
    setFilter(filter_by);
    setStudents(filtered_studednts);
  };

  const requestRetake = async () => {
    await requestRetakeMutation({
      variables: { book_id: reader_id },
    });
    refetch_db_student();
  };

  const filterOptions: FilterFun = (options) => {
    return (query) => {
      const response = options.filter((item) => item.name.search(query) >= 0);
      return response;
    };
  };

  const handleSelectClass = (selected_id: any) => {
    if (selected_id === "0") {
      setClassSelected(null);
    } else {
      if (db_readers) {
        const set_selected = db_readers.classes.find(
          (g: ClassItem) => g.value === selected_id
        );
        setClassSelected(set_selected);
      }
    }
  };

  const handlePlayVideo = () => {
    const set_video = { ...video };
    set_video.play = !set_video.play;
    if (set_video.play && video_ref.current) {
      video_ref.current.play();
    }
    setVideo(set_video);
  };

  const goBack = () => {
    try {
      history.goBack();
    } catch (_) {
      history.push("/");
    }
  };

  if (!reader) {
    return (
      <main className="first-container no_padding bookdetails_page py-5">
        {loading_reader_student || loading_reader ? (
          <LoaderDots />
        ) : (
          <IconJumbotron
            classes="my-5"
            txt_classes="text-white"
            icon="fas fa-books"
            txt="Book does not exist"
            cta={{
              link: "/",
              txt: "Go to Home",
              classes: "btn btn-light ",
            }}
          />
        )}
      </main>
    );
  }

  const toggleTab = (ev: { currentTarget: HTMLButtonElement }) => {
    const tab = ev.currentTarget.dataset.tab as TabOptions;
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  return (
    <main className="first-container no_padding bookdetails_page">
      <div className="book_details">
        <BookInfo
          reader={reader}
          goBack={goBack}
          user={user}
          playVideo={handlePlayVideo}
        />
        {reader.video_url ? (
          <div className={`video_container ${video.play ? "active" : ""}`}>
            <video
              controls={true}
              onPause={handlePlayVideo}
              ref={video_ref}
              controlsList="nodownload"
            >
              <source src={reader.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : null}
      </div>
      {user.is_teacher ? (
        <NavTabs activeTab={activeTab} setActive={toggleTab} />
      ) : null}
      {activeTab === "quiz" ? (
        <BottomInfo
          loading={loading_request || false}
          questions={quizResponse}
          students={students}
          refetch={refetch_db_readers}
          student={student || undefined}
          requestRetake={requestRetake}
          filterStudents={filterStudents}
          filter={filter}
          book_id={reader.id}
          classGroups={classGroups}
          class_selected={class_selected || null}
          handleSelectClass={handleSelectClass}
          filterOptions={filterOptions}
          book_url={`/reader/${reader.url}/${reader.id}/1`}
        />
      ) : (
        <Reviews book_id={reader.id} students={students} />
      )}
    </main>
  );
};

const BottomInfo = ({
  questions,
  students,
  student,
  filterStudents,
  filter,
  book_id,
  loading,
  handleSelectClass,
  class_selected,
  filterOptions,
  classGroups,
  requestRetake,
  book_url,
  refetch,
}: BottomInfoProps) => {
  if (questions.length < 1) {
    return null;
  }
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6">
          <ResponseTable
            questions={questions}
            refetch={refetch}
            student={student || undefined}
            loading={loading}
            requestRetake={requestRetake}
            book_url={book_url}
            book_id={book_id}
          />
        </div>
        {user.is_teacher ? (
          <div className="col-md-6">
            <StudentsQuizTable
              refetch={refetch}
              students={students || []}
              filterStudents={filterStudents}
              filter={filter}
              book_id={book_id}
              classGroups={classGroups}
              class_selected={class_selected}
              handleSelectClass={handleSelectClass}
              filterOptions={filterOptions}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

type NavTabsProps = {
  activeTab: string;
  setActive: (ev: { currentTarget: HTMLButtonElement }) => void;
};

const NavTabs: React.FC<NavTabsProps> = ({ activeTab, setActive }) => {
  return (
    <div className="container mt-3">
      <ul className="nav nav-tabs ">
        <li className="nav-item mr-2">
          <button
            className={`nav-link ${
              activeTab === "quiz" ? "active" : "bg-transparent text-white green_dark"
            }`}
            onClick={setActive}
            data-tab="quiz"
          >
            Student Quiz
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "reviews" ? "active" : "bg-transparent text-white green_dark"
            }`}
            onClick={setActive}
            data-tab="reviews"
          >
            Student Reviews
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Reader;
