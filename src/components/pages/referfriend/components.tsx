import React from "react";
import { ErrorType } from "../../../models/errors";
import { Referral } from "../../../models/referers";

type ReferCardProps = {
  sendReferer: any;
  handleType: any;
  addReferer: any;
  handleMessage: any;
  loading: boolean;
  message: string;
  referers: Referral[];
  error: ErrorType | false;
};
export const ReferCard: React.FC<ReferCardProps> = ({
  sendReferer,
  handleType,
  referers,
  addReferer,
  loading,
  message,
  handleMessage,
  error,
}) => (
  <div className="material_shadows_3 friends_emails">
    <form method="post" id="send_referrers">
      <h3 className="black_text">Friend's Emails</h3>
      {referers.map((item, key) => (
        <InviteForm
          key={`InviteForm_${key}`}
          handleType={handleType}
          index={key}
          referral={item}
          addReferer={addReferer}
          showPlus={key < 3 && key + 1 === referers.length}
        />
      ))}
      <label>Message (optional)</label>
      <textarea
        rows={4}
        name="message"
        placeholder="Send a message with your invite"
        className="form-control"
        value={message}
        onChange={handleMessage}
      ></textarea>
      {error ? (
        <div className="mt-3 alert alert-warning">{error.message}</div>
      ) : null}
      <button
        type="button"
        disabled={loading}
        className="btn btn-danger btn-block mt-4 green_contain_green"
        onClick={sendReferer}
      >
        {loading ? "Sending..." : "Send Invites"}
      </button>
    </form>
  </div>
);

type InviteFormProps = {
  handleType: any;
  addReferer: any;
  index: number;
  showPlus: boolean;
  referral: Referral;
};
export const InviteForm: React.FC<InviteFormProps> = ({
  handleType,
  index,
  referral,
  addReferer,
  showPlus,
}) => (
  <>
    <div className=" relative">
      <div className="form-inline referrer_email ">
        <div className="form-group">
          <input
            type="text"
            value={referral.name || ""}
            data-type="name"
            data-index={index}
            className="form-control"
            placeholder="Your friend's name"
            onChange={handleType}
          />
        </div>
        <div className="form-group ml-2">
          <input
            type="email"
            data-type="email"
            value={referral.email || ""}
            data-index={index}
            className="form-control"
            placeholder="Email"
            onChange={handleType}
          />
        </div>
        {showPlus ? (
          <button
            type="button"
            className="btn btn-success ml-2"
            onClick={addReferer}
          >
            <i className="fa fa-plus" aria-hidden="true"></i>
          </button>
        ) : null}
      </div>
      <span className="text-danger opacity_0">
        <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>{" "}
        Invalid Email Address
      </span>
    </div>
  </>
);
