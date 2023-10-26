import { useMutation } from "@apollo/client";
import React from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CANCELMEMBER } from "./queries";

const CancelPlan: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [cancelMembership, { loading, data: user_data, called }] =
    useMutation(CANCELMEMBER);

  useEffect(() => {
    if (user_data) {
      console.log(user_data);
      const new_user = user_data.cancelMembership;
      localStorage.setItem("user", JSON.stringify({ ...user, ...new_user }));
      window.location.href = "/sign_out";
    }
    // eslint-disable-next-line
  }, [user_data]);

  const cancelMembershipFun = () => {
    cancelMembership();
  };

  return (
    <main className="first-container bg-light py-5">
      <div className="container my-4">
        <div className="row">
          <div className="col-lg-12 ">
            <h3 className="black_text">Cancel Your Membership?</h3>
            <hr className="my-4" />
          </div>
          <div className="col-lg-8">
            <h4 className="black_text">
              Click “Finish Cancellation” Below to Cancel Your Membership
            </h4>
            <ul className="black_text">
              <li>
                Cancellation will be effective immediately after your
                confirmation.
              </li>
              <li>
                Restart your membership anytime. Your viewing preferences will
                always be saved.
              </li>
              <li>
                If you are not satisfied with our service and would like a
                refund, contact us at 1-800-TEACHER.
              </li>
            </ul>

            <div className="d-flex justify-content-between mt-5">
              <Link to="/youraccount" className="btn btn-default">
                Go Back
              </Link>
              <button
                className="btn btn-danger"
                id="finish_cancellation"
                onClick={cancelMembershipFun}
                disabled={loading}
              >
                {loading || called ? "Canceling" : "Finish Cancellation"}
              </button>
            </div>
          </div>
        </div>
        <hr className="my-4" />
      </div>
    </main>
  );
};

export default CancelPlan;
