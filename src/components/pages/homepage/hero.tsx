import React from "react";
import { Link } from "react-router-dom";
import { PlanItem } from "../../../models/user";

type HomePageProps = {
  main_cta: string;
};

const Hero: React.FC<HomePageProps> = ({ main_cta }) => {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const yearly_plan = plans_data.find((plan) => plan.id === "3");
  const monthly_plan = plans_data.find((plan) => plan.id === "1");
  return (
    <div
      className="hero"
      style={{
        backgroundImage: `url(${
          process.env.REACT_APP_CDN_IMG + "new-books-bg.png"
        })`,
      }}
    >
      <h4 className="mb-2">SPANISH • FRENCH • GERMAN</h4>
      <img
        className="mb-2 mt-0"
        src={process.env.REACT_APP_CDN_IMG + "hero-logo.png"}
        alt="hero logo"
      />

      <div className="d-flex align-items-center justify-content-around mt-4 mb-3">
        <Link to="/signup" className="btn btn_lg  btn-primary try_btn">
          {" "}
          {main_cta}
        </Link>
        <p className="m-0 mx-3">OR</p>
        <a
          href="https://www.teachersdiscovery.com/product/flangoo-spanish-digital-readers-subscription/spanish"
          target="_blank"
          rel="noreferrer"
          className="btn btn-danger text-light btn_lg"
        >
          <b>Buy Now</b>
        </a>
      </div>
      <p>No credit card, no commitment, and no student info required.</p>
      <div className="pricing">
        <p>
          ${monthly_plan?.price_amount} per month or $
          {yearly_plan?.price_amount} for 12 months{" "}
        </p>
        <a href="#section_07">
          SEE ALL PRICES <br />{" "}
          <i className="fa fa-chevron-down fa-2x" aria-hidden="true"></i>{" "}
        </a>
      </div>
    </div>
  );
};

export default Hero;
