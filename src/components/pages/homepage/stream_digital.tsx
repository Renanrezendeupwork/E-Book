import React from "react";
import { Link } from "react-router-dom";
import { PlanItem } from "../../../models/user";

const StreamDigital: React.FC = () => {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const monthly_plan = plans_data.find((plan) => plan.id === "1");

  return (
    <div className="container-fluid section" id="section_1">
      <div className="container  py-5">
        <div className="row">
          <div className="col-md-4">
            <img
              src={process.env.REACT_APP_CDN_IMG + "2021-08-03.gif"}
              className="img-fluid"
              alt="books animation"
            />
          </div>

          <div className="col-md-8">
            <h3 className="text-left">
              Stream Digital Short Stories and Novels in Your World Language
              Class
            </h3>
            <div className="checkmarks">
              <div>
                {" "}
                <img
                  src={process.env.REACT_APP_CDN_IMG + "orange-checkmark.png"}
                  alt="Orange checkmark"
                />{" "}
                <p>Seamlessly switch between at-home and in-class use</p>
              </div>
              <div>
                {" "}
                <img
                  src={process.env.REACT_APP_CDN_IMG + "orange-checkmark.png"}
                  alt="Orange checkmark"
                />{" "}
                <p>
                  One account includes over 200 titles, all three languages, and
                  access for up to {monthly_plan?.students} students
                </p>
              </div>
              <div>
                {" "}
                <img
                  src={process.env.REACT_APP_CDN_IMG + "orange-checkmark.png"}
                  alt="Orange checkmark"
                />{" "}
                <p>No software to install—Flangoo works on any device!</p>
              </div>
            </div>
            <Link to="/signup" className="btn btn-warning ">
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamDigital;
