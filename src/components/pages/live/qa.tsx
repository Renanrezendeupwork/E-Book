import React, { useState } from "react";
import axios from "../../../middleware/axios_firebase";
import { UserItem } from "../../../models/user";
import { QA_CommentType } from "./models";

type QAProps = { live: boolean };
const QA: React.FC<QAProps> = ({ live }) => {
  const [question, setQuestion] = useState<string>("");
  const [questions, setQuestions] = useState<QA_CommentType[]>();
  const user = JSON.parse(localStorage.getItem("user") || "{}") as UserItem;

  const handleSendQA = () => {
    if (!question || !live) return;
    setQuestion("");
    const questionsArr = questions || [];
    questionsArr.unshift({
      question: question,
      ///current local time
      time: new Date().getHours() + ":" + new Date().getMinutes(),
    });
    setQuestions(questionsArr);
    const input = document.getElementById("questionInput") as HTMLInputElement;
    if (input) {
      input.focus();
    }
    try {
      axios.post("/scriptsQaCreate", {
        question: question,
        user_id: user.id,
        user_name: user.name,
        is_teacher: user.is_teacher,
      });
    } catch (error) {
      console.log("poll.tsx:18 | error ", error);
    }
  };

  const handleType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuestion(e.target.value);
  };
  const enterPressed = (ev: React.KeyboardEvent): void => {
    var code = ev.keyCode || ev.which;
    if (code === 13) {
      //13 is the enter keycode
      handleSendQA();
    }
  };
  return (
    <div className="QA_contanier">
      <div className={`QA_comments ${live ? "" : "opacity_7"}`}>
        {live ? (
          questions &&
          questions.map((item, index) => {
            return (
              <div className="QA_comment" key={index}>
                <p>
                  {user.name.split(" ")[0]}: {item.question}
                </p>
                <span>{item.time}</span>
              </div>
            );
          })
        ) : (
          <div className="QA_comment">
            <p>
              <b className="text-success">Angelo:</b> I'm not live right now.
              You will be able to ask me questions when I'm live. Come back on
              Jan 27!
            </p>
          </div>
        )}
      </div>
      <div className="QA_input">
        <input
          type="text"
          placeholder={live ? "Send Angelo a Question" : "Angelo is not live"}
          className="form-control"
          id="questionInput"
          value={question}
          onChange={handleType}
          onKeyUp={enterPressed}
        />
        <div className="bottom" onClick={handleSendQA}>
          <span>Question Sent!</span>
          <button className="btn btn-primary" disabled={!live}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default QA;
