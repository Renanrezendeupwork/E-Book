import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";

import { UserItem, UserSettings } from "../../../models/user";
import AngelosComponent from "../angelos/angelosComponent";
import AngelosPref from "../profile/angelosPref";
import { GET_USER } from "../profile/queries";
import Page404 from "../page_404";
import VideoComponent from "./video";
import { prevVideoType } from "./models";
import Rewatch from "./previous";

const prevVideos: prevVideoType[] = [
  {
    to: "https://youtu.be/KTw6SzqMRYs",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_one.jpeg",
    title: "Angelo's day in Guanajuato",
    date: "October 27, 2022",
  },
  {
    to: "https://youtu.be/p1Pz3GG2E54",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_3.jpeg",
    title: "Angelo's day in Dia de los Muertos Parade",
    date: "October 29, 2022",
  },
  {
    to: "https://youtu.be/CHBS_DjdWPY",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_4.jpeg",
    title: "Angelo's day Chaultepec Castle and Cablebus Ride",
    date: "October 30, 2022",
  },
  {
    to: "https://youtu.be/W_CC08-yZfY",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_5.webp",
    title: "Angelo's day in the Mercados selling flowers",
    date: "October 31, 2022",
  },
  {
    to: "https://youtu.be/PDiDB0NqC2U",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_6.webp",
    title: "Angelo's day at the cemetery and Mexican Halloween",
    date: "November 1, 2022",
  },
  {
    to: "https://youtu.be/vEfuxaHWBOQ",
    image: "https://flangoo-cdn.s3.us-east-2.amazonaws.com/Angelosday_7.png",
    title: "Angelo's last day in Mexico City!",
    date: "November 2, 2022",
  },
];

const LivePage: React.FC = () => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [allowedYT, setAllowedYT] = useState(true);
  const settings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  ) as UserSettings;

  const { data: teacher_data } = useQuery<{ user: UserItem }>(GET_USER, {
    variables: {
      id: user.teacher_id,
    },
    fetchPolicy: "no-cache",
    skip: user.is_teacher,
  });
  useEffect(() => {
    checkYoutube();
  }, []);

  const checkYoutube = () => {
    let image = new Image();
    image.onload = function () {
      setAllowedYT(true);
      return true;
    };
    image.onerror = function () {
      console.log(
        "Please allow the Teacher's Discovery Youtube® channel through your school's firewall 🙏 they want to see Angelo's videos quest in Mexico!"
      );
      setAllowedYT(false);
      return false;
    };
    image.src = "https://youtube.com/favicon.ico";
    return true;
  };

  if (
    !user.is_teacher &&
    (teacher_data?.user?.plan?.plan_id === "2" || !settings.angelos_show)
  ) {
    return <Page404 />;
  } else if (
    user.is_teacher &&
    (!user.plan?.plan_id || user.plan.plan_id === "2")
  ) {
    return <AngelosComponent />;
  }

  return (
    <main className="live_page">
      <div className="container-fluid first-container last-container ">
        <div className="row my-2 justify-content-between">
          <div className="col-md-9">
            {user.is_teacher ? <Activities /> : null}
            {!allowedYT ? <YoutubeBlocked /> : null}{" "}
            <VideoComponent url={false} />
          </div>
          <div className="col-md-3">
            {user.is_teacher ? <AngelosPref toggleOnly={true} /> : null}
            <br />
            <AngelosBio />
          </div>
        </div>
        <hr
          className="my-5"
          style={{
            borderColor: "#fff",
          }}
        ></hr>
        {prevVideos.length ? (
          <Rewatch
            prevVideos={prevVideos}
            title="Archived Angelo’s Quest"
            subtitle="El Día de los Muertos, October/November 2022"
          />
        ) : null}
      </div>
    </main>
  );
};

const AngelosBio = () => (
  <div className="card">
    <div className="card-body bg-dark rounded">
      <img
        src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/AngelosQuest_sandboarding.png?v=2"
        alt="Angelos Profile"
        className="img-fluid"
      />
      <h5 className="card-title ">Meet Your Guide!</h5>
      <p className="card-text ">
        Hi, I’m Angelo! I am a native Chihuahuan and traveled extensively around
        Mexico before becoming a Spanish teacher. Come watch me while I learn to
        sandboard the Samalayuca Dunes in Chihuahua. I hope to show you my
        culture, meet many different people, and answer your questions while you
        watch my encounters. My goal is for you to experience my beautiful
        country and learn Spanish at the same time. Tune in to this unique,
        live-recorded event and ask me questions via chat while you are
        watching!
      </p>
    </div>
  </div>
);

const YoutubeBlocked: React.FC = () => (
  <div className="row youtubeblocked bg-warning rounded p-2 mb-2 mx-1">
    <div className="col-1">
      <span className="fa-stack fa-2x">
        <i className="fas fa-ban fa-stack-2x " style={{ color: "Tomato" }}></i>
        <i className="fab fa-youtube fa-stack-1x opacity_9"></i>
      </span>
    </div>
    <div className="col d-flex align-items-center">
      <p className="text-dark m-0">
        Uh-oh! It looks like you have this YouTube® channel blocked. Contact
        your IT department to allow the Teacher's Discovery YouTube channel
        through your school's firewall <u>before</u> Thursday, October 27.
      </p>
    </div>
  </div>
);

const Activities = () => (
  <div className="col-12 py-2 text-right text-white">
    <a
      href="https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/Angelos_Quest_4_Viewing_Activity.zip"
      className="btn btn-danger"
    >
      <i className="fas fa-file-download mr-2"></i> Activities{" "}
      <span className="caret"></span>
    </a>
  </div>
);

export default LivePage;
