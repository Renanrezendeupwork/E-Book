import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { toDate } from "../../../middleware/dates";
import { ChapterQuestion, Userquiz } from "../../../models/questions";
import { ButtonTootip } from "../../common/buttons";
import RetakeModal from "./retake_modal";
import { StudentItem } from "../../../models/student";

type RetakeBtnProps = {
  className?: string;
  allowRetake?: any;
  toggleModal: () => void;
  loading?: boolean;
  allow_retake?: boolean | null;
  student_id: string;
  book_id: string;
};

type ResponsesProps = {
  data: ChapterQuestion[];
  book_title: string;
  reader_id: string;
  student: StudentItem;
  allow_retake?: boolean | null;
  score: number;
  allowRetake: (
    student_id: string,
    allow: boolean,
    book_id: string,
    chapter?: string
  ) => void;
  back: any;
  refetch: any;
  refetch_loading: boolean;
  loading_request: boolean;
};

const Responses: React.FC<ResponsesProps> = ({
  data,
  book_title,
  score,
  back,
  refetch,
  refetch_loading,
  reader_id,
  allowRetake,
  loading_request,
  student,
  allow_retake,
}) => {
  const [modalShow, setShow] = useState(false);
  const [quizResponse, setquizResponse] = useState<Userquiz[]>([]);
  const { section } = useParams<{ section: string }>();
  useEffect(() => {
    renderquizResponse(data);
  }, [data]);

  useEffect(() => {
    if (section === "chapter_retake") {
      setShow(true);
    }
  }, [section]);

  const toggleModal = () => {
    refetch();
    setShow(!modalShow);
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

  return (
    <div className="card card-default">
      <div className="card-body">
        <div className="card-title ">
          <div className="d-flex justify-content-between w-100">
            <button className="btn btn-transparent" onClick={back}>
              <i className="fas fa-chevron-left mr-2"></i> View All
            </button>
            <h4 className="text-dark">Reader quiz | {book_title} </h4>
            <span>
              {score ? `${score}/10` : "-"}{" "}
              {score ? (
                score >= 7 ? (
                  <i className="fas fa-check text-success"></i>
                ) : (
                  <i className="fas fa-times text-danger"></i>
                )
              ) : (
                ""
              )}{" "}
            </span>
          </div>
          <div className="d-flex justify-content-end align-items-center w-100">
            <ButtonTootip
              id="refresh_response"
              type="transparent"
              onClick={refetch}
              disabled={refetch_loading}
              tooltip_txt="Refresh Responses"
            >
              <i
                className={`fas fa-sync ${refetch_loading ? "fa-spin" : ""}`}
              ></i>
            </ButtonTootip>
            <RetakeBtn
              allowRetake={allowRetake}
              allow_retake={allow_retake}
              loading={loading_request}
              toggleModal={toggleModal}
              student_id={student.id}
              book_id={reader_id}
            />
          </div>
        </div>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Correct </th>
              <th>Chapter</th>
              <th>Question </th>
              <th>Student Response </th>
              <th>Date </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, key) => (
              <ResponseItem data={item} key={`response_item_${key}`} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="card-footer d-flex justify-content-between">
        <button className="btn btn-transparent" onClick={back}>
          <i className="fas fa-chevron-left mr-2"></i> Back
        </button>
        <RetakeBtn
          allowRetake={allowRetake}
          loading={loading_request}
          toggleModal={toggleModal}
          allow_retake={allow_retake}
          student_id={student.id}
          book_id={reader_id}
        />
      </div>
      <RetakeModal
        show={modalShow}
        toggle={toggleModal}
        refetch={refetch}
        questions={quizResponse}
        refetch_loading={refetch_loading}
        student={student}
        reader_id={reader_id}
      />
    </div>
  );
};

const RetakeBtn: React.FC<RetakeBtnProps> = ({
  className,
  allowRetake,
  loading,
  allow_retake,
  toggleModal,
  student_id,
  book_id,
}) => {
  const [show, setShow] = useState(false);
  const toggle = () => setShow(!show);
  const showModal = () => {
    toggleModal();
    toggle();
  };
  return (
    <div className="d-flex flex-column">
      <div className="btn-group">
        <button className={`btn btn-danger ${className} green_contain_green`} onClick={toggle}>
          {loading ? "Sending..." : "Handle Retake"}
        </button>
        <button
          type="button"
          onClick={toggle}
          className="btn btn-danger  dropdown-toggle dropdown-toggle-split no_focus green_contain_green"
          data-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="sr-only">Toggle Dropdown</span>
        </button>
        <div
          className={`dropdown-menu dropdown-menu-right bg-light  ${
            show ? "show" : ""
          } `}
        >
          <button
            className="dropdown-item"
            disabled={allow_retake ? true : false}
            onClick={() => allowRetake(student_id, true, book_id)}
          >
            {" "}
            <i className="fa-fw mr-1 fad opacity_7 fa-book"></i>Reset All Book
          </button>
          <button className="dropdown-item" onClick={showModal}>
            {" "}
            <i className="fa-fw mr-1 fad opacity_7 fa-bookmark"></i>Reset By
            Chapter
          </button>
        </div>
      </div>
      {allow_retake ? (
        <small className={`text-muted ${className}`}>
          Retake allowed, waiting for student result
        </small>
      ) : null}
    </div>
  );
};

const ResponseItem: React.FC<{ data: ChapterQuestion }> = ({ data }) => {
  const { question, response, correct, updated, options, chapter } = data;
  const selected = options.find((option) => option.id === response);
  const correct_response = options.find((option) => option.accepted === true);
  return (
    <tr>
      <td className="text-center text-truncate">
        {correct === null ? (
          <i className="fas fa-minus text-muted"></i>
        ) : correct ? (
          <i className="fas fa-check text-success"></i>
        ) : (
          <i className="fas fa-times text-danger"></i>
        )}
      </td>
      <td className="text-center">{chapter}</td>
      <td>
        <span dangerouslySetInnerHTML={{ __html: question }} /> <br />{" "}
        <small className="text-muted">
          Response: {correct_response?.option_txt}
        </small>
      </td>
      <td> {selected?.option_txt || "-"} </td>
      <td> {updated ? toDate(updated) : "-"} </td>
    </tr>
  );
};

export default Responses;
