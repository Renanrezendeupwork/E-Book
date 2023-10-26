import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import { PlanItem } from "../../../models/user";
import SignupForm from "./signupForm";

const TeacherSignup: React.FC = () => {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const trial = plans_data.find((plan) => plan.id === "2");
  const title = `Create Your Account and Enjoy a ${trial?.days}-Day Free Trial!`;
  const sub_title = "No credit card required.";
  const { referral } = useParams<{ referral?: string }>();

  useEffect(() => {
    const document_body = document.getElementsByTagName("body")[0];
    if (document_body) {
      document_body.classList.add("white_bg");
    }
    return () => {
      document_body.classList.remove("white_bg");
    };
  }, []);

  return (
    <div className="container first-container">
      <div className="row">
        <div className="col-lg-5">
          <h4 className="black_text">{title}</h4>
          <p className="black_text">{sub_title}</p>
          <SignupForm referral={referral ? true : false} />
          <br />
          <p>
            Already have an account?{" "}
            <Link to="/signin" className="text-primary">
              Sign In
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeacherSignup;
