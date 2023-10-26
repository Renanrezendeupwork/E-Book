import React from "react";
import { Link } from "react-router-dom";
import { PlanItem } from "../../../models/user";

const Save40: React.FC = () => {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const monthly_plan = plans_data.find((plan) => plan.id === "1");
  return (
    <div className="section section_07" id="section_07">
      <div className="container">
        <div className="row">
          <div className="col-md-6 col_right">
            <img
              src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo-Price-Grid_2023.jpg"
              className="img-fluid"
              alt="Flangoo Price Grid"
            />
          </div>
          <div className="col-md-5 col-md-offset-1">
            <h3 className="text-left">
              SAVE when you buy multiple years at once!
            </h3>

            <p>
              You get complete access to all of the short stories and novels for{" "}
              {monthly_plan?.students} students. <br />
              Multi-year and district pricing also available. Call <br />{" "}
              1-800-TEACHER for details.
            </p>
            <p>
              We also have monthly subscriptions for $
              {monthly_plan?.price_amount} per month, which won't auto-renew.
            </p>
            <Link to="/signup" className="btn btn-warning mt-5 ">
              {" "}
              Start Your Free Trial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Save40;
