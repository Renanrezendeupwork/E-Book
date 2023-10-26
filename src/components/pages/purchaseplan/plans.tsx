import React, { MouseEvent } from "react";
import { PlanType } from "../../../models/plans";

type PlansProps = {
  plans: PlanType[];
  selectedPlan?: PlanType;
  handlePlanSelect: (ev: MouseEvent<HTMLButtonElement>) => void;
};

const Plans: React.FC<PlansProps> = ({
  plans,
  selectedPlan,
  handlePlanSelect,
}) => (
  <div className="col-lg-10">
    <h4 className="black_text">
      Purchase any of the membership packages from below.
    </h4>
    <ul className="black_text">
      <li>Select your preferred membership package and make payment.</li>
      <li>You can cancel your subscription anytime later.</li>
      <li>
        You can also subscribe using a PO on the Teacher's Discovery site by{" "}
        <a
          href="https://www.teachersdiscovery.com/product/29270"
          target="_blank"
          rel="noreferrer"
        >
          <u>clicking here</u>
        </a>
        .
      </li>
      <li>Renewing will ADD on to the end of your current expiration date.</li>
    </ul>
    <table className="table table-striped table-hover">
      <tbody>
        <tr role="rowheader">
          <td>
            <h6>Packages</h6>
          </td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td key={`plan.name${plan.id}`} className={`text-center `}>
                  <h5>{plan.name}</h5>
                  {plan.subtitle ? <p>{plan.subtitle}</p> : null}
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>Subscription Price</td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td
                  key={`plan.price_amount${plan.id}`}
                  className={`text-center `}
                >
                  USD ${plan.price_amount} <br />
                  {plan.regular_price ? (
                    <span className="text-danger">
                      <del>${plan.regular_price}</del>
                    </span>
                  ) : null}
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>Students That Can Access As Well</td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td key={`plan.students${plan.id}`} className={`text-center `}>
                  {plan.students}
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>
            Access on Your Computer, TV, <br /> Phone, and Tablet
          </td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td className={`text-center `} key={`access_on${plan.id}`}>
                  <i className="fa fa-check" aria-hidden="true"></i>
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>Spanish, French &amp; German titles</td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td className={`text-center `} key={`languages${plan.id}`}>
                  <i className="fa fa-check" aria-hidden="true"></i>
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>Cancel Anytime</td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td className={`text-center `} key={`cancel${plan.id}`}>
                  <i className="fa fa-check" aria-hidden="true"></i>
                </td>
              ))
            : null}
        </tr>
        <tr>
          <td>
            <span>Select your plan:</span>
          </td>
          {plans.length > 0
            ? plans.map((plan) => (
                <td className={`text-center `} key={`button${plan.id}`}>
                  <button
                    className={`btn  btn-block py-3 ${
                      selectedPlan && selectedPlan.id === plan.id
                        ? "btn-success"
                        : "btn-outline-dark"
                    }`}
                    onClick={handlePlanSelect}
                    data-plan-id={plan.id}
                  >
                    {selectedPlan && selectedPlan.id === plan.id
                      ? "Selected"
                      : "Select"}
                  </button>
                </td>
              ))
            : null}
        </tr>
      </tbody>
    </table>
  </div>
);

export default Plans;
