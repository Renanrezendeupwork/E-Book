import React from "react";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";

import {
  Affirmationtype,
  ChapterQuestion,
  QuestionOptions,
} from "../../../models/questions";
import { UserItem, UserSettings } from "../../../models/user";
import { IconJumbotron } from "../../common/icons";
import { ErrorType } from "../../../models/errors";

type ChapterQuizProps = {
  questions: ChapterQuestion[];
  quiz_number: number;
  chapter: string;
  next: any;
  cancel: any;
  retakeQuizz: any;
  retakeTeacherQuizz: any;
  loading: boolean;
  select: any;
  validate: any;
  finished: boolean;
  retake: boolean;
  waiting: boolean;
  has_next_chapter: boolean;
  loading_reader: boolean;
  is_teacher: boolean;
  next_page: string;
  book_title: string;
  affirmation: Affirmationtype;
  error: false | ErrorType;
};

const Chapterquiz: React.FC<ChapterQuizProps> = ({
  questions,
  quiz_number,
  next,
  chapter,
  cancel,
  retakeQuizz,
  retakeTeacherQuizz,
  loading,
  select,
  validate,
  next_page,
  book_title,
  affirmation,
  has_next_chapter,
  retake,
  finished = false,
  loading_reader,
  waiting = false,
  error,
  is_teacher = false,
}) => {
  const active_question = questions[quiz_number];
  if (error) {
    return (
      <div className="chapter_questions_container active d-flex align-items-center justify-content-center">
        <IconJumbotron
          icon="fal fa-bolt mb-3 text-danger"
          txt={"Oh oh! Something went wrong"}
          help_text={error.message}
          cta={{
            classes: "btn btn-danger",
            txt: "Close",
            function: cancel,
          }}
        />
      </div>
    );
  }
  return (
    <div className="chapter_questions_container active notranslate">
      {finished ? (
        <Resume
          cancel={cancel}
          questions={questions}
          next_page={next_page}
          chapter={chapter}
          has_next_chapter={has_next_chapter}
          retake={retake}
          retakeQuizz={retakeQuizz}
          retakeTeacherQuizz={retakeTeacherQuizz}
          loading={loading}
        />
      ) : (
        <div className="container ">
          <Question
            question={active_question}
            key={active_question.id}
            num={quiz_number}
            select={select}
            book_title={book_title}
            affirmation={affirmation}
          />
          <div className="actions">
            <button className="btn btn-link text-muted" onClick={cancel}>
              Cancel{" "}
            </button>
            <button
              className={`btn no_focus  ${
                active_question.correct !== null ? "btn-danger" : "btn-success"
              }  ${waiting ? "pulsate-fwd" : ""} ${
                is_teacher ? "move_left" : ""
              } ${loading_reader ? "disabled opacity_7" : ""}`}
              disabled={loading_reader}
              onClick={active_question.correct !== null ? next : validate}
            >
              {active_question.correct !== null ? "Next" : "Submit Answer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Question = ({
  question,
  num,
  select,
  book_title,
  affirmation,
}: {
  question: ChapterQuestion;
  num: number;
  select: any;
  book_title: string;
  affirmation: Affirmationtype;
}) => {
  // const options = question.options.sort(() => Math.random() - 0.5);
  const options = question.options;
  return (
    <div className={`question ${question.correct !== null ? "responded" : ""}`}>
      <h4 className="d-flex flex-column flex-md-row align-items-center justify-content-between">
        <span className="badge badge-primary badge-pill">#{num + 1}</span>{" "}
        <small>Chapter #{question.chapter}</small> <small>{book_title}</small>
      </h4>
      {question.correct !== null && (
        <ResponseMessage
          response={question.correct}
          message={
            question.correct
              ? affirmation.correct.message
              : renderIncorrectMessage()
          }
        />
      )}
      <h3
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(question.question),
        }}
      />

      <div className="ctas">
        {options.map((option, key) => (
          <Option
            value={option}
            responded={question.correct !== null}
            key={option.id}
            select={select}
            number={key + 1}
            selected={question.response === option.id}
          />
        ))}
      </div>
      <small className="text-secondary xs_hidden">
        <i className="fal fa-info-circle"></i>{" "}
        {question.response
          ? "Hit Enter to Submit Answer"
          : "Use your keyboard numbers to select the correct answer"}
      </small>
    </div>
  );
};

const ResponseMessage = ({
  response,
  message,
}: {
  response: boolean;
  message: string | undefined;
}) => {
  if (response === true) {
    return (
      <div className="alert alert-success">
        <i className="fa fa-check mr-2" aria-hidden="true"></i>
        {message}
      </div>
    );
  }
  return (
    <div className="alert alert-danger">
      <i className="fa fa-times text-danger mr-2" aria-hidden="true"></i>
      {message}
    </div>
  );
};

export const Option = ({
  value,
  selected,
  select,
  responded,
  number,
}: {
  value: QuestionOptions;
  select: any;
  selected?: boolean;
  responded?: boolean;
  number: number;
}) => (
  <button
    className={`btn option_btn ${
      selected ? "selected btn-dark " : "btn-outline-dark"
    } `}
    data-value={value.id}
    onClick={select}
  >
    <span className="question_num ">
      {selected || responded ? (
        <i
          className={` ${renderIcon(responded, value.accepted, selected)}`}
        ></i>
      ) : (
        <span>{number}</span>
      )}
    </span>

    {value.option_txt}
  </button>
);

const Resume = ({
  cancel,
  chapter,
  questions,
  retakeQuizz,
  retakeTeacherQuizz,
  next_page,
  has_next_chapter,
  loading,
  retake,
}: {
  cancel: any;
  retakeQuizz: any;
  retakeTeacherQuizz: any;
  questions: ChapterQuestion[];
  next_page: string;
  chapter: string;
  has_next_chapter: boolean;
  loading: boolean;
  retake: boolean;
}) => {
  const correct = questions.filter((question) => question.correct);
  const in_correct = questions.filter((question) => !question.correct);
  const total = questions.length;
  const total_correct = correct.length;
  const evaluation = (total_correct * 100) / total / 10;
  const passed = evaluation >= 7;
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const settings: UserSettings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );
  const retake_info = {
    txt: "Want to try again?",
    help_text: "Ask your teacher to do a retake of this chapter",
    cta: {
      txt: "Request Re-take Chapter Quiz",
      classes: "btn btn-primary",
      function: retakeQuizz,
    },
  };
  if (settings.allow_retakes) {
    retake_info.help_text = "Clicking the button will re-start the quiz";
    retake_info.cta.txt = "Re-take Chapter Quiz";
    retake_info.cta.classes = "btn btn-danger";
    // delete retake_info.cta;
  } else if (retake) {
    retake_info.txt = "You requested to retake this quiz";
    retake_info.help_text =
      "Wating for your teacher to allow you to retake this chapter";
    // delete retake_info.cta;
  }
  return (
    <div className="chapter_questions_resume">
      <div className={`header ${passed ? "success" : ""}`}>
        <div className="container">
          <p className="m-0">Chapter #{chapter}</p>
          <h3>
            {passed
              ? has_next_chapter
                ? "Good job! You are ready for the next chapter"
                : "Good job! You have completed all chapters on this book"
              : "Oh oh! You need to read this chapter again"}
          </h3>
          <p>
            You got {total_correct} out of {total} questions right
          </p>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            {correct.length ? (
              <ResumeLi type="success" questions={correct} />
            ) : null}
            {in_correct.length ? (
              <ResumeLi type="failed" questions={in_correct} />
            ) : null}
            <div className="actions">
              <button className="btn btn-link text-muted" onClick={cancel}>
                Back to Reader
              </button>
              {next_page && (
                <Link
                  className="btn btn-primary text-white ml-auto"
                  to={next_page}
                  id="next_chapter"
                >
                  Next Chapter
                </Link>
              )}
            </div>
          </div>
          <div className="col-md-4 py-3">
            {user.is_teacher ? (
              <IconJumbotron
                txt="Retake Quiz?"
                icon={`${
                  loading ? "far fa-circle-notch fa-spin" : "far fa-undo-alt"
                }`}
                help_text="Since you are the teacher, you can start over anytime"
                cta={{
                  txt: "Re-take Quiz",
                  classes: "btn btn-primary",
                  function: retakeTeacherQuizz,
                }}
              />
            ) : (
              <IconJumbotron
                txt={retake_info.txt}
                icon={`${
                  loading ? "far fa-circle-notch fa-spin" : "far fa-undo-alt"
                }`}
                help_text={retake_info.help_text}
                cta={retake_info.cta}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ResumeLi = ({
  questions,
  type,
}: {
  questions: ChapterQuestion[];
  type: "success" | "failed";
}) => (
  <div className="success_resume resume">
    <i
      className={`fa ${
        type === "success" ? "fa-check text-success" : "fa-times text-danger"
      }`}
      aria-hidden="true"
    ></i>{" "}
    {type === "success" ? "What you got correct" : "What you got wrong"}
    <ul>
      {questions.map((item) => (
        <li
          key={`resume_li_${item.id}`}
          dangerouslySetInnerHTML={{ __html: item.question }}
        />
      ))}
    </ul>
  </div>
);

function renderIcon(
  responded: boolean | undefined,
  accepted: boolean | undefined,
  selected: boolean | undefined
): string {
  if (responded && selected) {
    return accepted ? "fas fa-check text-success" : "text-danger far fa-times";
  } else {
    return selected ? "fas fa-check " : "far fa";
  }
}

function renderIncorrectMessage(): string {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  switch (user.lang_id) {
    case "1":
      return "¡Incorrecto!";
    case "3":
      return "Falsch!";
    case "2":
      return "Faux !";
    default:
      return "¡Incorrecto!";
  }
}

export default Chapterquiz;
