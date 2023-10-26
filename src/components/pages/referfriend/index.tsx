import React, { useState } from "react";
import { useMutation } from "@apollo/client";

import { SENDREFERERS } from "./queries";
import { Referral } from "../../../models/referers";
import { ReferCard } from "./components";
import { ErrorType } from "../../../models/errors";
import { validateEmail } from "../../../middleware/common-functions";
import { IconJumbotron } from "../../common/icons";

const ReferFriend = () => {
  const [sendRefererMutation, { loading, called }] = useMutation(SENDREFERERS);
  const [referers, setReferers] = useState<Referral[]>([
    { name: "", email: "" },
  ]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<ErrorType | false>(false);

  const sendReferer = () => {
    setError(false);
    const filtered = referers.filter((r) => r.name.length > 0);
    if (filtered.length === 0) {
      setError({
        message: "Please add at least one friend's email and their names",
      });
      return;
    }
    let valid = true;
    //validate emails
    filtered.forEach((r) => {
      if (validateEmail(r.email) === false) {
        setError({
          message: `Please add a valid email address for ${r.name}`,
        });
        valid = false;
        return;
      }
    });
    if (!valid) return;
    sendRefererMutation({ variables: { referrals: filtered, message } });
  };

  const addReferer = () => {
    const set_referers = [...referers];
    set_referers.push({ name: "", email: "" });
    setReferers(set_referers);
  };

  const handleType = (ev: { target: HTMLInputElement }) => {
    const value = ev.target.value;
    const type = ev.target.dataset.type as keyof Referral;
    const index = ev.target.dataset.index;
    if (!index) return;
    const set_referers = [...referers];
    set_referers[parseInt(index)][type] = value;
    setReferers(set_referers);
  };

  const handleMessage = (ev: { target: HTMLTextAreaElement }) => {
    const value = ev.target.value;
    setMessage(value);
  };
  return (
    <main className="first-container last-container">
      <Hero />
      <div className="container">
        <div className="row">
          <div className="col-md-6 py-4">
            <h4>Here's how it works:</h4>
            <p>
              Type in the information here. We will send your colleague an email
              on your behalf telling them to try Flangoo free. If your colleague
              purchases a one-month or one-year subscription, you’ll get a $30
              Teacher's Discovery eGift Card as our way of saying thank you for
              the referral. Only one $30 referral per school.
            </p>
            <p>Who are you going to invite? </p>
          </div>
          <div className="col-md-6">
            {called ? (
              <div className="material_shadows_3 friends_emails">
                <IconJumbotron
                  icon="fad fa-check-double text-success"
                  txt="Referral emails sent!"
                  txt_classes="text-dark mt-2"
                  help_text="We'll let you know when your friends make a purchase"
                  help_txt_classes="text-dark mt-2"
                  cta={{ txt: "Go Home", link: "/" }}
                />
              </div>
            ) : (
              <ReferCard
                sendReferer={sendReferer}
                handleType={handleType}
                referers={referers}
                addReferer={addReferer}
                loading={loading}
                message={message}
                handleMessage={handleMessage}
                error={error}
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const Hero = () => (
  <div
    className="cover_img"
    style={{
      backgroundImage: `url(https://cdn.flangoo.com/assets/frontend/flixer/images/refer_a_friend_30.jpg?v=2)`,
    }}
  >
    <div className="text_container">
      <div className="container"></div>
    </div>
  </div>
);
export default ReferFriend;
