import React from "react";
import { Link } from "react-router-dom";

const Questions: React.FC = () => (
  <div className="section section_03" id="section_03">
    <div className="container">
      <div className="row">
        <div className="col-md-5 col_right">
          <img
            src={process.env.REACT_APP_CDN_IMG + "auto-graded-questions.png"}
            className="img-fluid"
            alt="Auto grades questions"
          />
        </div>
        <div className="col-md-7 col_left">
          <h3 className="text-left">
            NEW! Auto-Graded Comprehension Questions
          </h3>
          <p>
            Every chapter includes a set of multiple choice or true/false
            questions to see if your students are understanding what they are
            reading.
          </p>
          <p>
            Students can also request to retake a chapter set of questions,
            which you can grant or deny.
          </p>
          <Link to="/signup" className="btn btn-warning mt-5 ">
            Start Your Free Trial{" "}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default Questions;
