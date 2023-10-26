import { useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import { ALLOW_RETAKE } from "../readerpage/queries";

type ChapterRetakeBtnProps = {
  grade: number;
  question_num: number;
  past?: number;
  chapter: string;
  book_id: string;
  student_id: string;
  refetch: () => void;
  disabled: boolean;
  requested_retake: boolean;
};
const ChapterRetakeBtn: React.FC<ChapterRetakeBtnProps> = ({
  grade,
  question_num,
  past,
  chapter,
  book_id,
  student_id,
  refetch,
  disabled,
  requested_retake,
}) => {
  const [allowRetakeMu, { loading, data }] = useMutation(ALLOW_RETAKE);

  useEffect(() => {
    if (data) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const allowRetake = (
    chapter: string,
    book_id: string,
    student_id: string
  ) => {
    allowRetakeMu({
      variables: {
        chapter,
        book_id,
        student_id,
        allow: true,
      },
    });
  };

  return (
    <button
      className="btn  chapter_retakes_btn"
      onClick={() => allowRetake(chapter, book_id, student_id)}
      disabled={loading || disabled}
    >
      {disabled ? (
        <small>
          <i className={` far fa-circle`}></i>
        </small>
      ) : (
        `${grade}/${question_num}`
      )}{" "}
      {disabled ? null : requested_retake ? (
        <i
          className={`icon show  ${
            loading ? "far fa-redo fa-spin" : "far fa-user-clock"
          }`}
        ></i>
      ) : (
        <i className={`icon  far fa-redo-alt ${loading ? "fa-spin" : ""}`}></i>
      )}
      {past ? (
        <small className="text-muted grades_past">
          {past}/{question_num}
        </small>
      ) : null}
      {requested_retake ? (
        <small className="text-muted reuested_text">Requested </small>
      ) : null}
    </button>
  );
};

export default ChapterRetakeBtn;
