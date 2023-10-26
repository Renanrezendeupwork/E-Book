import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { ALLOW_RETAKE } from "../pages/readerpage/queries";
import { RetakeRenderProps } from "../pages/readerpage/models";
import { UserItem } from "../../models/user";

export const RetakeRender: React.FC<RetakeRenderProps> = ({
  history,
  student,
  book_id,
  chapter,
  refetch,
  disabled = false,
}) => {
  const [allowRetakeMutation, { loading }] = useMutation(ALLOW_RETAKE);
  const [isDisabled, setDisabled] = useState(disabled);
  let button_txt = "Retake not Allowed";
  let classes = "";
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.is_teacher) return null;

  const clickFun = () => {
    setDisabled(true);
    if (book_id) {
      allowRetake(student.id, true);
    }
  };
  if (loading || !history) {
    button_txt = "Allowing...";
  } else if (disabled) {
    button_txt = "Allowed";
  } else {
    button_txt = chapter ? "Allow Retake" : "Reset All";
  }

  const allowRetake = async (student_id: string, allow: boolean) => {
    await allowRetakeMutation({
      variables: { book_id, student_id: student_id, allow: allow, chapter },
    });
    refetch();
  };

  return (
    <button
      className={`mt-1 btn btn-${
        isDisabled ? "outline-secondary" : "danger green_contain_danger_light"
      } mx-1 ${classes}`}
      disabled={isDisabled}
      onClick={isDisabled ? () => {} : clickFun}
    >
      {button_txt}
    </button>
  );
};

type OverAllRenderProps = {
  overall: {
    grade: number;
    question_num: number;
  };
  question_num: number;
};

export const OverAllRender: React.FC<OverAllRenderProps> = ({
  overall,
  question_num,
}) => {
  let icon = "fa fa-minus text-muted";
  let evaluation = Math.round((overall.grade * 10) / question_num);
  if (overall.grade < 1) {
    icon = "fa fa-minus text-muted";
  } else if (evaluation >= 7) {
    icon = "fas fa-check text-success";
  } else {
    icon = " fas fa-times text-danger";
  }
  return (
    <span>
      <i className={icon}></i> {overall.grade}/{question_num}
    </span>
  );
};
