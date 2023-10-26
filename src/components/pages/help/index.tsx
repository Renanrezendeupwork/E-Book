import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useMutation } from "@apollo/client";
import YouTube from "react-youtube";

import HelpForm from "./helpForm";
import { LoaderBar } from "../../../middleware/loaders";
import videos from "./videos.json";
import join_fb_img from "../../assets/FB-Join-Our-Group.png";
import { SENDHELP } from "./queries";
import { SAVEACHIEVEMENT } from "../achievements/queries";
import { UserItem } from "../../../models/user";

type formType = {
  sended: boolean;
  type?: string;
  message?: string;
};

declare global {
  interface Window {
    Calendly: any;
  }
}

const HelpPage = () => {
  const [form, setForm] = useState<formType>({
    sended: false,
  });
  const [sendHelp, { data: response, loading }] = useMutation(SENDHELP);
  const [saveAchievementMutation] = useMutation(SAVEACHIEVEMENT);

  useEffect(() => {
    if (response && response.helpSupport) {
      const currentForm = { ...form };
      currentForm.sended = true;
      setForm(currentForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const handleChange = (ev: {
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  }) => {
    const value = ev.target.value;
    const type = ev.target.dataset.type;
    const currentForm = { ...form };
    //@ts-ignore next line
    currentForm[type] = value;
    setForm(currentForm);
  };

  const handleSubmit = () => {
    if (!form.type || !form.message) return;
    sendHelp({ variables: { topic: form.type, message: form.message } });
  };

  const saveAchievement = (id: string) => {
    saveAchievementMutation({ variables: { id } });
  };
  const onpenCalendly = () => {
    const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
    saveAchievement("15");
    if (typeof window.Calendly !== "undefined") {
      window.Calendly.initPopupWidget({
        url: "https://calendly.com/teachers-discovery?primary_color=ff2800&background_color=ffffff",
        // parentElement: document.getElementById("calendly_popup_widget"),
        prefill: {
          name: user.name,
          email: user.email,
        },
      });
    }
  };

  return (
    <main className="first-container py-5 help_page">
      <Helmet>
        <link
          href="https://assets.calendly.com/assets/external/widget.css"
          rel="stylesheet"
        />
        <script
          src="https://assets.calendly.com/assets/external/widget.js"
          type="text/javascript"
          async
        ></script>
      </Helmet>
      {loading ? <LoaderBar fixed /> : null}
      <div className="container py-3">
        <div className="row">
          <div className="col-md-6 text-right">
            <h1>Support Page</h1>
            <h4>How can we help you?</h4>
            {/*  Calendly link widget begin */}
            <button
              className=" main_cta btn btn-danger btn-lg"
              onClick={onpenCalendly}
            >
              <i className="fa fa-calendar-o" aria-hidden="true"></i>
              Schedule a 15-Minute Tour
            </button>
            {/*  Calendly link widget end */}
            <a
              href="https://www.facebook.com/groups/flangooteacherslounge"
              className="btn btn_facebook mt-4 "
              target="_blank"
              rel="noreferrer"
              onClick={() => saveAchievement("26")}
            >
              <img
                src={join_fb_img}
                className="img-fluid"
                alt="Facebook Group invite"
              />
            </a>
          </div>
          <div className="col-md-6">
            <HelpForm
              form={form}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              sent={form.sended}
              loading={loading}
            />
          </div>
        </div>
        <h1>Video Tutorials</h1>
        <br />
        {videos.map((item, key) => (
          <div className="text-center">
            <h3 className="mt-3 mb-2">{item.title}</h3>
            <YouTube
              key={`youtube_${key}`}
              videoId={item.id} // defaults -> null
              onEnd={() => {
                saveAchievement("16");
              }}
              id={item.id} // defaults -> null
            />
          </div>
        ))}
      </div>
    </main>
  );
};

export default HelpPage;
