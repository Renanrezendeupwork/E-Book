import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useLazyQuery } from "@apollo/client";
import { useParams } from "react-router-dom";
import KeyboardEventHandler from "@infinium/react-keyboard-event-handler";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";

import { AnalyticsContext } from "../../../context/analytics-context";
import { LoaderBar } from "../../../middleware/loaders";
import {
  SETTIMER,
  SAVEBOOKMARK,
  GETREADER,
  GET_QUESTIONS,
  SAVERESPONSE,
  GET_AFFIRMATIONS,
  ALLOW_TEACHER_RETAKE,
} from "./queries";
import useInterval from "../../../hooks/useInterval";
import axios from "../../../middleware/axios";
import BackDrop from "./modal";
import Chapterquiz from "./questions";
import runGlossary from "./glossary";
import { ReaderItem } from "../../../models/reader";
import {
  Affirmationtype,
  ChapterQuestion,
  DB_affirmations,
} from "../../../models/questions";
import { isNumber } from "../../../middleware/common-functions";
import { UserItem, UserSettings } from "../../../models/user";
import { ErrorType } from "../../../models/errors";
import { IconJumbotron } from "../../common/icons";
import { LoaderDots } from "../../../middleware/main_loader";
import { SAVEACHIEVEMENT } from "../achievements/queries";
import { REQUEST_RETAKE } from "../readerpage/queries";
import StudentTimer from "./timer";

const timer_span = 60; ///save on every  minute
declare const window: any;

type DB_response = {
  book: ReaderItem;
};
type DB_response_questions = {
  bookQuestions: ChapterQuestion[];
  retakeChapter: Retakes[];
};
interface PageTime {
  timer: number;
  timestamp: number;
  reader_id: string;
}

type LinkItem = {
  type: string;
  url: string;
  txt: string;
};
export type Retakes = {
  requested: boolean;
  created_at: Date;
  book_id: string;
  chapter: string;
};

type LinksItem = {
  "Extension-Activity"?: LinkItem[];
  "Multiple-Choice-Qs"?: LinkItem[];
  "Personal-Qs"?: LinkItem[];
};

interface quizItem {
  eval: number;
  finish: boolean;
  retake: Retakes;
  questions: ChapterQuestion[];
}

const Reader: React.FC = () => {
  const analyticsContext = useContext(AnalyticsContext);
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const settings: UserSettings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );
  const readers = JSON.parse(localStorage.getItem("local_readers") || "[]");
  const { reader_id, page = "1" } = useParams<{
    reader_id: string;
    page: string;
  }>();
  const [saveTimer] = useMutation(SETTIMER);
  const [saveBookmark] = useMutation(SAVEBOOKMARK);
  const [saveResponse] = useMutation(SAVERESPONSE);
  const [allowTeacherRetakeMutation, { loading: loading_allaow_teacher }] =
    useMutation(ALLOW_TEACHER_RETAKE);
  const [requestRetakeMutation, { loading: loading_allaow }] =
    useMutation(REQUEST_RETAKE);
  const { data: reader_data, loading: loading_reader } = useQuery<DB_response>(
    GETREADER,
    {
      variables: {
        book_id: reader_id,
        chapter: page,
        class_id: user.class_id,
      },
      fetchPolicy: "no-cache",
    }
  );

  const [fetchQuizz, { data: reader_question_data, called: calledFetchQuizz }] =
    useLazyQuery<DB_response_questions>(GET_QUESTIONS, {
      fetchPolicy: "no-cache",
    });
  const [error, setError] = useState<ErrorType | false>(false);
  const [timer, setTimer] = useState(0);
  const [read_time, setReadTime] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [retake_requested, setRetakeRequested] = useState<boolean>(false);
  const [lastResponded, setlastResponded] = useState<number>(0);
  const [quizNumber, setquizNumber] = useState<number>(-1);
  const [quiz, setquiz] = useState<quizItem>({} as quizItem);
  const [affirmation, setAffirmation] = useState<Affirmationtype>(
    {} as Affirmationtype
  );
  const [reader, setReader] = useState<ReaderItem | false>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [questions, setQuestions] = useState<LinksItem | false>(false);
  const [active_timer_toggle, setActive_timer_toggle] = useState(false);
  const [idleTime, setIdleTime] = useState<number>(0);
  const [isActive, setActive] = useState<string | boolean>(true);
  const [is_open, setIsOpen] = useState<boolean>(false);
  const [pageTime, setPageTime] = useState<PageTime>({
    timer: 0,
    timestamp: Date.now(),
    reader_id,
  });
  const { data: affirmations } = useQuery<DB_affirmations>(GET_AFFIRMATIONS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    document.onmousemove = handleMovment;
    document.onkeypress = handleMovment;
    setGetReader();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (affirmations) {
      randomizeAffirmations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [affirmations]);

  useEffect(() => {
    setLoader(true);
    setQuestions(false);
    setquizNumber(-1);
    setRetakeRequested(false);
    const reader_cont: HTMLElement = document.getElementById("reader_cont")!;
    if (reader_cont) {
      reader_cont.innerHTML = "";
    }
    if (page && isNumber(page)) {
      saveBookmark({
        variables: { book_id: reader_id, chapter: parseInt(page) },
      });
      ///update localStorage
      const update_readers = readers.map((item: ReaderItem) => {
        if (item.id === reader_id) {
          item.user_chapter = parseInt(page);
        }
        return item;
      });
      localStorage.setItem("local_readers", JSON.stringify(update_readers));
    }
    if (settings && settings.hide_quizzes !== true) {
      fetchQuizz({
        variables: {
          book_id: reader_id,
          chapter: page,
          class_id: user.class_id,
        },
      });
    }
    setIsOpen(false);
    getHtml();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader_id, page]);

  useEffect(() => {
    if (reader_data && reader_data.book) {
      if (!reader_data.book.glossary_arr && reader_data.book.glossary) {
        try {
          reader_data.book.glossary_arr = JSON.parse(reader_data.book.glossary);
        } catch (e) {
          console.error("index.tsx:165 | glossary error", e);
        }
      }
      if (reader_data.book.read_time) {
        setReadTime(parseInt(reader_data.book.read_time));
      }
      setReader(reader_data.book);
      setquizNumber(-1);
    }
  }, [reader_data]);

  useEffect(() => {
    if (reader_question_data && reader_question_data.bookQuestions) {
      parseQuiz();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader_question_data, calledFetchQuizz]);

  useEffect(() => {
    if (quiz && quiz.retake && quiz.retake.requested) {
      setRetakeRequested(true);
    } else {
      setRetakeRequested(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz]);

  useEffect(() => {
    setWaiting(false);
    if (
      quizNumber < 0 ||
      !quiz.questions[quizNumber] ||
      quiz.questions[quizNumber].response
    ) {
      return;
    }
    const timer = setTimeout(() => setWaiting(true), 5000);
    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz, quizNumber]);

  useEffect(() => {
    if (
      reader &&
      !loader &&
      reader.glossary &&
      reader.glossary_arr.length > 0 &&
      page !== "glossary" &&
      page !== "credits"
    ) {
      setTimeout(() => {
        runGlossary(reader.glossary_arr);
      }, 500);
    }
  }, [reader, loader, page]);

  useInterval(
    () => {
      var active_timer = JSON.parse(localStorage.getItem("pageTime") || `{}`);
      if (active_timer && active_timer.reader_id === reader_id) {
        setPageTime(active_timer);
      }
      intervalTimer();
      setTimer((curr_time) => curr_time + 1);
    },
    active_timer_toggle ? 1000 : null
  );

  useInterval(() => {
    if (isActive !== "idle" && user.is_teacher === false) {
      intervalTimerCheck();
    }
  }, 1000);

  const setGetReader = () => {
    if (reader) return false;
    const get_reader = readers.find((r: ReaderItem) => r.id === reader_id);
    if (get_reader) {
      setReader(get_reader);
    }
  };

  const toggle = () => setIsOpen(!is_open);

  const triggerClick = (action: string) => {
    if (!action || !reader) return;
    const event = {
      category: "Reader",
      action: action,
      label: `${reader.id}`,
      value: 1,
    };
    analyticsContext.event(event);
  };

  const randomizeAffirmations = () => {
    if (!affirmations) return;
    const correct_array = affirmations.affirmations.filter(
      (a) => a.type === "correct"
    );
    const random_correct =
      correct_array[Math.floor(Math.random() * correct_array.length)];
    const incorrect_array = affirmations.affirmations.filter(
      (a) => a.type === "incorrect"
    );
    const random_incorrect =
      incorrect_array[Math.floor(Math.random() * incorrect_array.length)];
    setAffirmation({ correct: random_correct, incorrect: random_incorrect });
  };

  const handleMovment = () => {
    setIdleTime(0);
  };

  const intervalTimer = () => {
    if (!document.hasFocus()) {
      /// user is on another tab or software
      setActive_timer_toggle(false);
      ///start new interval every 1 second to check if page is active again
      setActive(false);
      return;
    }
    ///check user idle time (No mouse movements, no clicks, no scroll)
    ///for 5 minutes
    if (idleTime >= 300) {
      setActive_timer_toggle(false);
      setActive("idle");
      return;
    }
    localStorage.setItem("pageTime", JSON.stringify(pageTime));
    const set_PageTime = {
      timer,
      timestamp: Date.now(),
      reader_id,
    };
    if (timer >= timer_span) {
      ///if grater than 1 min sendit it to the server
      set_PageTime.timer = 0;
      setTimer(0);
      deployTimer();
      ///remove revert localstorage
    }
    setPageTime(set_PageTime);
  };

  const intervalTimerCheck = () => {
    if (isActive === true && !isNaN(+idleTime)) {
      setIdleTime((idleTime) => idleTime + 1);
    }
    if (document.hasFocus()) {
      setActive(true);
      setActive_timer_toggle(true);
      if (isActive === false) setIdleTime(0);
      return;
    }
  };

  const deployTimer = () => {
    const playing_time: number = localStorage.getItem("playing_time")
      ? Number(localStorage.getItem("playing_time"))
      : 0;

    localStorage.removeItem("playing_time");
    ///save event to google analytics
    const event = {
      category: "Reader",
      action: "ReadingTime",
      label: `${reader_id}`,
      value: 1,
    };
    analyticsContext.event(event);

    saveTimer({ variables: { book_id: reader_id, audio_time: playing_time } });
    ///add +1 to setReadTime
    setReadTime((readTime) => readTime + 1);
  };

  const handleSelectQuestion = (ev: { currentTarget: HTMLButtonElement }) => {
    ev.currentTarget.blur();
    if (quizNumber < 0) return;
    const current_quiz = { ...quiz };
    const response = ev.currentTarget.dataset.value;
    if (!response) return;
    current_quiz.questions[quizNumber].response = response;
    setquiz(current_quiz);
  };

  const handleSelectQuestionKeyboard = (key_value: string) => {
    if (quizNumber < 0) return;
    if (key_value === "enter") {
      if (!lastResponded || quizNumber === lastResponded) {
        validateQuestion();
      } else {
        nextQuestion();
      }
      return;
    } else if (key_value === "esc") {
      setquizNumber(-1);
      return;
    }
    const number = parseInt(key_value) - 1;
    const current_quiz = { ...quiz };
    const question = current_quiz.questions[quizNumber];
    if (question.correct !== null) return;
    const option = question.options[number];
    if (!option) return;
    const response = option.id;
    if (!response) return;
    current_quiz.questions[quizNumber].response = response;
    setquiz(current_quiz);
  };

  const validateQuestion = async () => {
    const current_quiz = { ...quiz };
    const question = current_quiz.questions[quizNumber];
    const { options } = question;
    const selected_option = options.find(
      (option) => option.id === question.response
    );
    if (!selected_option) {
      return;
    }
    question.correct = selected_option ? selected_option.accepted : false;
    const activequizNumber = quizNumber;
    setquiz(current_quiz);
    setlastResponded(quizNumber + 1);
    setWaiting(false);
    try {
      /// save response to DB
      await saveResponse({
        variables: {
          question_id: question.id,
          correct: question.correct,
          response: question.response,
        },
      });
    } catch (error) {
      setError({
        reason: "response_error",
        message: `We got an error while saving your response on question #${
          activequizNumber + 1
        }. Please try again later. If the error prestist please contact ${
          user.is_teacher ? "us" : "your teacher"
        }.`,
      });
      const current_quiz = { ...quiz };
      const question = current_quiz.questions[activequizNumber];
      question.correct = null;
      setquiz(current_quiz);
      setlastResponded(activequizNumber);
      console.log(error);
    }
  };

  const nextQuestion = (ev?: { target: HTMLButtonElement }) => {
    if (ev) {
      ev.target.blur();
    }
    const number = quizNumber + 1;
    setWaiting(false);
    setlastResponded(number);
    randomizeAffirmations();
    if (number < quiz.questions.length) {
      setquizNumber(number);
    } else {
      const current_quiz = { ...quiz };
      current_quiz.finish = true;
      setquiz(current_quiz);
    }
  };

  const getHtml = async () => {
    try {
      const response = await axios.get(`reader/${reader_id}/${page || 1}`);
      if (response.data) {
        const { html, links } = response.data;
        if (!html) {
          setError({ message: "Book does not exist" });
          return;
        }
        renderHTML(html, links);
      }
    } catch (error) {
      setError({ message: "Something went wrong, please try again" });
      setLoader(false);
      console.log("index.js:6 | error ", error);
    }
  };

  const renderHTML = (html: string, links: LinksItem) => {
    const reader_cont: HTMLElement = document.getElementById("reader_cont")!;
    if (!reader_cont) {
      setLoader(false);
      setTimeout(() => {
        renderHTML(html, links);
      }, 500);
      return;
    }
    reader_cont.innerHTML = html;
    setQuestions(links);
    setActive_timer_toggle(true);
    setTimeout(() => {
      try {
        window.findAudio();
      } catch (error) {
        findAudiofun(1);
        console.log("index.tsx:333 | error", error);
      }
      setLoader(false);
    }, 500);
  };

  const findAudiofun = (tries: number) => {
    if (tries >= 5) {
      return;
    }
    setTimeout(() => {
      try {
        window.findAudio();
      } catch (error) {
        findAudiofun(tries + 1);
        console.log("index.tsx:333 | error", error);
      }
    }, 5000);
  };

  const showquiz = (ev: { target: HTMLButtonElement }) => {
    ev.target.blur();
    if (lastResponded < 0) {
      ///user finish quiz alredy, show answers
      const current_quiz = { ...quiz };
      current_quiz.finish = true;
      setquiz(current_quiz);
      setquizNumber(current_quiz.questions.length);
      return;
    }
    triggerClick(`ChaperQuestionsQuizOpen`);
    setquizNumber(lastResponded);
  };

  const retakeQuizz = async () => {
    await requestRetakeMutation({
      variables: { book_id: reader_id, chapter: page },
    });
    if (settings.allow_retakes) {
      fetchQuizz({
        variables: {
          book_id: reader_id,
          chapter: page,
          class_id: user.class_id,
        },
      });
      setquizNumber(0);
    } else {
      setRetakeRequested(true);
    }
  };

  const retakeTeacherQuizz = async () => {
    await allowTeacherRetakeMutation({
      variables: { book_id: reader_id, page },
    });
    fetchQuizz({
      variables: {
        book_id: reader_id,
        chapter: page,
        class_id: user.class_id,
      },
    });
    setquizNumber(0);
  };

  const parseQuiz = () => {
    if (!reader_question_data) {
      return;
    }
    ///get last responded question
    const last_responded: number = reader_question_data.bookQuestions.findIndex(
      (question) => question.response === null
    );
    setlastResponded(last_responded);
    setquiz({
      eval: 0,
      finish: false,
      retake: reader_question_data.retakeChapter[0],
      questions: [...reader_question_data.bookQuestions],
    });
  };

  if (reader === false) {
    return (
      <div className={`reader_page min-vh-100 bg-dark`}>
        <LoaderDots />
      </div>
    );
  }
  if (error && !error.reason) {
    return (
      <div className={`reader_page min-vh-100 bg-dark`}>
        <IconJumbotron
          classes="my-5"
          txt_classes="text-white"
          icon="fas fa-books"
          txt={error.message || "Something went wrong, please try again"}
          cta={{
            link: "/",
            txt: "Go to Home",
            classes: "btn btn-light ",
          }}
        />
      </div>
    );
  }
  const next = getNext(page, reader);
  const next_url =
    reader.chapters > parseInt(page)
      ? `/reader/${reader.url}/${reader.id}/${next}`
      : "";
  return (
    <div
      className={`reader_page ${quizNumber >= 0 ? "quiz_active" : ""} ${
        user.admin ? "is_admin" : ""
      }`}
    >
      {loader || loading_allaow || loading_allaow_teacher || loading_reader ? (
        <LoaderBar fixed />
      ) : null}
      <Helmet title={`Page: ${page} | ${reader.title}`} />
      <ReaderNav
        url={reader.url}
        toggle={toggle}
        is_open={is_open}
        reader={reader}
        page={page}
        read_time={read_time}
        active_reading={isActive === true ? true : false}
      />
      <div id="reader_cont" className="notranslate"></div>
      <BottomNav
        reader={reader}
        page={page}
        questions={questions}
        next={next}
        quiz={quiz}
        showquiz={showquiz}
        triggerClick={triggerClick}
      />

      {quizNumber >= 0 ? (
        <Chapterquiz
          chapter={page}
          questions={quiz.questions}
          waiting={waiting}
          finished={quiz.finish}
          retake={retake_requested}
          is_teacher={user.is_teacher}
          retakeQuizz={retakeQuizz}
          retakeTeacherQuizz={retakeTeacherQuizz}
          loading={loading_allaow || loading_allaow_teacher || false}
          loading_reader={loading_reader}
          quiz_number={quizNumber}
          select={handleSelectQuestion}
          validate={validateQuestion}
          next={nextQuestion}
          next_page={next_url}
          has_next_chapter={isNumber(next)}
          book_title={reader.title}
          affirmation={affirmation}
          cancel={() => {
            setquizNumber(-1);
            setError(false);
          }}
          error={error}
        />
      ) : null}
      {quizNumber >= 0 ? (
        <KeyboardEventHandler
          handleKeys={["numeric", "enter", "esc"]}
          onKeyEvent={(key) => handleSelectQuestionKeyboard(key)}
        />
      ) : null}
      <BackDrop
        show={isActive === "idle"}
        setActive={() => {
          setActive(true);
        }}
      />
      <Footer />
      <Helmet>
        <script
          src={process.env.PUBLIC_URL + "/audio.js"}
          type="text/javascript"
        />

        <script
          src={process.env.PUBLIC_URL + "/content-protector.min.js"}
          type="text/javascript"
        />
      </Helmet>
    </div>
  );
};

const ReaderNav: React.FC<{
  url: string;
  is_open: boolean;
  read_time: number;
  active_reading: boolean;
  toggle: any;
  reader: ReaderItem;
  page: number | string;
}> = ({ reader, url, is_open, toggle, page, read_time, active_reading }) => {
  return (
    <Navbar
      className="navbar navbar-dark bg-theme fixed-top reader_nav"
      style={{
        background: reader.nav_colors ? reader.nav_colors.background : "#000",
        color: reader.nav_colors ? reader.nav_colors.color : "#fff",
      }}
    >
      <div className="container">
        <Link to="/">
          <img
            src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white120.png"
            className="img-fluid"
            alt="Flangoo Logo"
          />
        </Link>
        <div className="d-flex justify-content-end align-items-center">
          <StudentTimer read_time={read_time} active_reading={active_reading} />
          <NavbarToggler onClick={toggle} />
        </div>
        <Collapse isOpen={is_open} navbar>
          <Nav navbar className=" w-100">
            {reader.has_prereading && (
              <NavItem className="nav-item active">
                <Link
                  className="dropdown-item chapter-links"
                  to={`/reader/${url}/${reader.id}/pre-reading`}
                >
                  Pre-Reading
                </Link>
              </NavItem>
            )}
            {reader.has_introduction && (
              <NavItem className="nav-item active">
                <Link
                  className="dropdown-item chapter-links"
                  to={`/reader/${url}/${reader.id}/introduction`}
                >
                  Introduction
                </Link>
              </NavItem>
            )}
            <ChaptersItems
              chapters={reader.chapters}
              url={url}
              reader_id={reader.id}
              page={page}
            />
            {reader.has_glossary && (
              <NavItem className="nav-item active">
                <Link
                  className="dropdown-item chapter-links"
                  to={`/reader/${url}/${reader.id}/glossary`}
                >
                  Glossary
                </Link>
              </NavItem>
            )}
            {reader.has_cultural && (
              <NavItem className="nav-item active">
                <Link
                  className="dropdown-item chapter-links"
                  to={`/reader/${url}/${reader.id}/cultural-notes`}
                >
                  Cultural Notes
                </Link>
              </NavItem>
            )}
            {reader.has_aboutstory && (
              <NavItem className="nav-item active">
                <Link
                  className="dropdown-item chapter-links"
                  to={`/reader/${url}/${reader.id}/about-story`}
                >
                  About Story
                </Link>
              </NavItem>
            )}
            <NavItem className="nav-item active">
              <Link
                className="dropdown-item chapter-links"
                to={`/reader/${url}/${reader.id}/credits`}
              >
                Credits
              </Link>
            </NavItem>
          </Nav>
        </Collapse>
      </div>
    </Navbar>
  );
};

const ChaptersItems: React.FC<{
  chapters: number;
  url: string;
  reader_id: string;
  page: number | string;
}> = ({ chapters, url, reader_id, page }) => {
  const response = [];
  for (let i = 1; i <= chapters; i++) {
    response.push(
      <NavItem className="nav-item" key={`chapter_nav_${i}`}>
        <Link
          className={`dropdown-item chapter-links ${
            page === parseInt(i.toLocaleString()) ? "selected" : ""
          }`}
          to={`/reader/${url}/${reader_id}/${i}`}
        >
          Chapter {i}
        </Link>
      </NavItem>
    );
  }
  return <React.Fragment>{response}</React.Fragment>;
};

const BottomNav: React.FC<{
  reader: ReaderItem;
  page: string;
  questions: LinksItem | false;
  next: number | false | string;
  quiz: quizItem;
  showquiz: any;
  triggerClick: (ev: string) => void;
}> = ({ reader, page, questions, next, quiz, showquiz, triggerClick }) => {
  const prev = getPrev(page, reader);
  return (
    <div className="container">
      {" "}
      <div className="row justify-content-between text-center">
        <div className="col-md-3">
          {prev ? (
            <Link
              to={`/reader/${reader.url}/${reader.id}/${prev}`}
              className="text-white btn btn-primary btn_round btn_mobile_block no_focus"
            >
              <i className="fal fa-arrow-alt-left fa-2x"></i>
            </Link>
          ) : null}
        </div>
        <div className="col-md-3 py-4 py-md-0">
          {quiz?.questions?.length ? (
            <div className="w-100 text-center">
              <button
                onClick={showquiz}
                className="btn btn-success py-3"
                id="multiple_choice_btn"
              >
                Multiple Choice Questions
              </button>
            </div>
          ) : null}
        </div>
        <div className="col-md-3 py-4 py-md-0">
          {questions && Object.keys(questions).length > 0 ? (
            <ChapterQuestions
              questions={questions}
              triggerClick={triggerClick}
            />
          ) : null}
        </div>
        <div className="col-md-3 ">
          {next !== false ? (
            <Link
              to={`/reader/${reader.url}/${reader.id}/${next}`}
              className="text-white btn btn-primary btn_round btn_mobile_block no_focus"
            >
              <i className="fal fa-arrow-alt-right fa-2x"></i>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

const ChapterQuestions: React.FC<{
  questions: LinksItem;
  triggerClick: (ev: string) => void;
}> = ({ questions, triggerClick }) => {
  const [dropdownOpen, setOpen] = useState(false);
  const toggle = () => setOpen(!dropdownOpen);
  const questions_length = Object.keys(questions).length;
  const [saveAchievementMutation] = useMutation(SAVEACHIEVEMENT);
  const saveAchievement = (id: string) => {
    saveAchievementMutation({ variables: { id } });
  };

  return (
    <ButtonDropdown isOpen={dropdownOpen} toggle={toggle}>
      <DropdownToggle className="btn btn-secondary dropdown-toggle btn_mobile_block py-3">
        {questions_length > 1 ? "Activities" : "Short-Answer Questions"}
      </DropdownToggle>
      <DropdownMenu>
        {Object.keys(questions).map((type, index) => {
          //@ts-ignore next-line
          const item: LinkItem[] = questions[type];
          const type_name = getTypeName(type);
          return (
            <React.Fragment key={`questions_fragment_${index}`}>
              <p className="text-center text-bold m-0">{type_name}</p>
              {item.map((q, key) => (
                <a
                  className="btn btn-link text-primary dropdown-item py-2 border-0"
                  download={true}
                  target="_blank"
                  rel="noreferrer"
                  href={q.url}
                  onClick={() => {
                    triggerClick(
                      `ChaperQuestionsDownload${q.type.toLocaleUpperCase()}`
                    );
                    saveAchievement("13");
                  }}
                  key={`questions_map_${type}_${key}`}
                >
                  {q.txt}
                </a>
              ))}
              {index + 1 !== questions_length ? <hr /> : null}
            </React.Fragment>
          );
        })}
      </DropdownMenu>
    </ButtonDropdown>
  );
};

const Footer = () => (
  <footer className="bg-dark reader_footer">
    <div className="container">
      <p className="m-0 text-center text-white">
        Copyright © 2005-{new Date().getFullYear()} Teacher's Discovery®, a
        division of American Eagle Co., Inc. All Rights Reserved.
      </p>
    </div>
  </footer>
);

type PageNames =
  | number
  | "glossary"
  | "credits"
  | "pre-reading"
  | "cultural-notes"
  | "introduction"
  | "about-story"
  | false;

function getNext(page: string, reader: ReaderItem): PageNames {
  if (isNumber(page)) {
    return reader.chapters === parseInt(page)
      ? reader.has_glossary
        ? "glossary"
        : reader.has_aboutstory
        ? "about-story"
        : "credits"
      : parseInt(page) + 1;
  }
  switch (page) {
    case "glossary":
      return reader.has_cultural
        ? "cultural-notes"
        : reader.has_aboutstory
        ? "about-story"
        : "credits";
    case "pre-reading":
      return reader.has_introduction ? "introduction" : 1;
    case "introduction":
      return 1;
    case "cultural-notes":
      return reader.has_aboutstory ? "about-story" : "credits";
    case "about-story":
      return "credits";
  }
  return false;
}

function getPrev(page: number | string | false, reader: ReaderItem): PageNames {
  switch (page) {
    case "credits":
      return reader.has_cultural
        ? "cultural-notes"
        : reader.has_aboutstory
        ? "about-story"
        : reader.has_glossary
        ? "glossary"
        : reader.chapters;
    case "pre-reading":
      return false;
    case "introduction":
      return reader.has_prereading ? "pre-reading" : false;
    case "cultural-notes":
      return reader.has_glossary ? "glossary" : reader.chapters;
    case "about-story":
      return reader.has_aboutstory
        ? "about-story"
        : reader.has_glossary
        ? "glossary"
        : reader.chapters;
  }

  if (reader.has_introduction && page === "1") {
    return "introduction";
  }
  if (reader.has_prereading && page === "1") {
    return "pre-reading";
  }
  if (isNumber(page)) {
    return Number(page) - 1;
  }

  return reader.chapters;
}

function getTypeName(type: string): string {
  switch (type) {
    case "multiplechoice":
      return "Multiple Choice Questions";
    case "personal":
      return "Personal Questions";
    case "extensionactivity":
      return "Extension Activity";
    case "activitiesinteractive":
      return "Activity";
    case "activitiesinteractive1":
      return "Activity 1";
    case "activitiesinteractive2":
      return "Activity 2";
    case "activitiesinteractive3":
      return "Activity 3";
    case "activitiesinteractive4":
      return "Activity 4";
    case "activitiesinteractive5":
      return "Activity 5";

    default:
      return "Chapter Questions";
  }
}

export default Reader;
