import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { toDate, NumericType, StringType } from "../../../middleware/dates";
import { PlanItem, UserItem } from "../../../models/user";
import { GET_USER } from "./queries";
import { LoaderBar } from "../../../middleware/loaders";
import { useEffect } from "react";

const ProfilePage: React.FC = () => {
  const local_user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    data: user_data,
    loading,
    called,
  } = useQuery<{
    user: UserItem;
  }>(GET_USER, {
    fetchPolicy: "no-cache",
    skip: !local_user.is_teacher,
  });

  useEffect(() => {
    if (!local_user.is_teacher) {
      window.location.href = "/student";
    }
    if (user_data && !called) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...local_user, ...user_data.user })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_data, called]);

  return (
    <main className="first-container bg-light py-5">
      {loading || !user_data ? (
        <LoaderBar />
      ) : (
        <div className="container">
          <h1>Account</h1>
          <Membership
            email={user_data.user.email}
            active={user_data.user.active}
          />
          <hr />
          <Plan data={user_data.user.plan} />
        </div>
      )}
    </main>
  );
};
type MembershipProps = { email: string; active: boolean };
const Membership: React.FC<MembershipProps> = ({ email, active }) => (
  <div className="row align-items-center my-4">
    {!active ? (
      <div className="col-12">
        {" "}
        <div className="alert alert-danger">
          <h4>
            <i className="fal fa-exclamation-triangle"></i> Membership inactive
          </h4>
        </div>
      </div>
    ) : null}
    <div className="col-md-5">
      <h3>Membership and Billing</h3>
      <Link
        to="/purchaseplan"
        className={`my-2 btn btn-${
          active
            ? "primary green_contain_green_light"
            : "success green_contain_green"
        }`}
      >
        {active ? "Upgrade Membership" : "Purchase Membership"}
      </Link>
      {active ? (
        <Link
          to={`cancelplan`}
          className="my-2 btn btn-dark ml-2 green_contain_danger_light"
          id="cancel_account"
        >
          Cancel Membership{" "}
        </Link>
      ) : null}
      <br />
      Need help with admin approval? <br />
      <a
        href="https://cdn.flangoo.com/assets/global/Approval-Request-New-Flangoo-Account.docx"
        className="blue_text"
        download=""
      >
        {" "}
        Click here
      </a>{" "}
      to download our pre-written approval letter.
    </div>
    <div className="col-md-4">
      <b>{email}</b> <br />
      <small>Password: ******</small>
    </div>
    <div className="col-md-3">
      <Link className="blue_text d-block mb-2" to="/settings/emails">
        Change Email
      </Link>{" "}
      <Link className="blue_text d-block" to="/settings/security">
        Change Password
      </Link>
    </div>
  </div>
);

const Plan = ({ data }: { data: PlanItem | undefined }) => (
  <div className="row align-items-center my-4">
    <div className="col-5">
      <h5>Plan Details</h5>
    </div>
    <div className="col-4">
      {data ? (
        <>
          {" "}
          <b>{data.name} Subscription</b> <br />
          Expires:{" "}
          {toDate(data.to, {
            year: NumericType.Numeric,
            month: StringType.Short,
            day: NumericType.Numeric,
          })}
        </>
      ) : (
        <b className="text-danger">No Active Subscription</b>
      )}
      <br />
      <small>
        To add more time to your plan, click on the "Upgrade Membership" button
      </small>
    </div>
    <div className="col-3">
      <Link className="blue_text d-block d-block mb-2" to="/settings/profile">
        Manage Profile
      </Link>{" "}
      <Link className="blue_text d-block" to="/billinghistory">
        Billing History
      </Link>
    </div>
  </div>
);

export default ProfilePage;
