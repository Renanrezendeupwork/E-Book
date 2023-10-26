import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";

import { SENDHELP } from "../help/queries";
import HelpForm, { FormType } from "../help/helpForm";

const SupportPage: React.FC = () => {
  const [form, setForm] = useState<FormType>({
    sended: false,
  });
  const [sendHelp, { data: response, loading }] = useMutation(SENDHELP);

  useEffect(() => {
    const document_body = document.getElementsByTagName("body")[0];
    if (document_body) {
      document_body.classList.add("white_bg");
    }
    return () => {
      document_body.classList.remove("white_bg");
    };
  }, []);

  const handleChange = (ev: {
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  }) => {
    const value = ev.target.value;
    const type = ev.target.dataset.type;
    const currentForm = { ...form };
    // @ts-ignore next-line
    currentForm[type] = value;
    setForm(currentForm);
  };

  const handleSubmit = () => {
    if (!form.type || !form.message) return;
    sendHelp({
      variables: {
        topic: form.type,
        message: form.message,
        email: form.email,
        name: form.name,
      },
    });
  };

  return (
    <div className="container support_page front_face first-container">
      <div className="row">
        <div className="col-md-8">
          <h1 className="black_text mt-3 ">Contact Us/Support</h1>
          <h3>Five ways to get help!</h3>
          <p>
            At Teacher's Discovery®, your satisfaction is our main goal. If you
            have a question or concern about Flangoo or need help and want to
            talk to us, choose an option below.
          </p>

          <h4>1) BY PHONE</h4>
          <p>
            Feel free to contact Customer Service by phone at 1-800-TEACHER. We
            are available Monday through Friday, from 9:00 a.m. to 5:00 p.m. ET.
          </p>

          <h4>2) BY LIVE CHAT</h4>
          <p>
            Go to{" "}
            <a href="https://teachersdiscovery.com">
              www.teachersdiscovery.com
            </a>{" "}
            OR if you have a Flangoo account, there is a live chat option there,
            too. Available Monday through Friday, from 9:00 a.m. to 5:00 p.m.
            ET.
          </p>

          <h4>3) BY EMAIL</h4>
          <p>
            help@teachersdiscovery.com <br />
            (Note: Emails received outside of business hours might delay a
            response until the next business day.)
          </p>

          <h4>4) BY ZOOM APPOINTMENT</h4>
          <p>
            Go{" "}
            <a href="https://calendly.com/teachers-discovery/flangoo-15-minute-tour">
              here
            </a>{" "}
            and find a 15-minute block that works for your schedule. A real
            person will share their screen and walk you through Flangoo or any
            issue that you might have.
          </p>

          <h4>5) BY FILLING OUT THE FORM BELOW</h4>
          <div className="my-4">
            {response ? (
              <div
                className="alert alert-dismissible alert-success"
                style={{ margin: "30px" }}
              >
                Message sent!
              </div>
            ) : (
              <HelpForm
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                sent={form.sended}
                loading={loading}
              />
            )}
          </div>

          <p>
            Technically, you can always mail us, too. <br />
            Teacher's Discovery® / Flangoo.com <br />
            2741 Paldan Drive, Auburn Hills, Michigan 48326
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
