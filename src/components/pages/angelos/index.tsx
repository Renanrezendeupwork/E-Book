import React from "react";

const quest_data = {
  number: "4",
  title: "Sandboarding Samalayuca Dunes in Chihuahua",
  subtitle: "Sandboarding in Samalayuca Dunes in Chihuahua",
  when: "Tuesday, February 28, 2023",
  time: "9 a.m. ~ 1 p.m. ET",
  blog_url:
    "https://teachersdiscovery.blog/angelos-mexico-quest-livestream-adventure-for-spanish-students-interactive-event-learn-spanish/",
};

const AngelosPage: React.FC = () => (
  <main
    className="first-container mt-0 angelos_page"
    style={{
      backgroundImage:
        "url(https://teachersdiscovery.blog/wp-content/uploads/2022/08/angelos-mexico-quest-bg-overlay-zoom-reduced.jpg)",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "cover",
    }}
  >
    <div className="container p-5">
      <div className="row">
        <div className="col-md-8">
          <img
            src="https://teachersdiscovery.blog/wp-content/uploads/2022/12/flangoo-logo.png"
            alt="Flangoo Logo"
            className="flangoo-logo"
            style={{
              width: "80px",
            }}
          />
          <h1 className="mb-0">Join Angelo's Quest</h1>
          <h4 className="mb-4">
            An Immersive Education Adventure for Spanish Students
          </h4>
          <h3 className="mb-0">Upcoming Quest:</h3>
          <h6 className="mb-4">Quest #{quest_data.number}</h6>
          <h2>
            <i>{quest_data.title}</i>
          </h2>
          <a
            href={quest_data.blog_url}
            className="cta p-1 mt-0"
            style={{
              color: "#fff",
              maxWidth: "200px",
            }}
            target="_blank"
            rel="noreferrer"
          >
            See Full Details
          </a>
          {/* <h6 className="mb-4">
            Los Matachines & El Día de la Virgen de Guadalupe
          </h6> */}
          <h5 className="mb-0">When:</h5>
          <h4 className="mb-0">{quest_data.when}</h4>
          <h6 className="mb-4">{quest_data.time}</h6>
          <h5 className="mb-0">Where:</h5>
          <h4 className="mb-4">Flangoo.com/live</h4>
          <p>
            <a
              href={quest_data.blog_url}
              className="text_none_decoration"
              target="_blank"
              rel="noreferrer"
            >
              Read the full blog post here.
            </a>
          </p>
          <p>
            Current Flangoo subscribers can{" "}
            <a href="https://flangoo.com/signin">log in</a> and follow along for
            free.
          </p>
          <p>
            <i>Not a Flangoo subscriber yet?</i>{" "}
            <a href="/purchaseplan">Get a Flangoo Subscription!</a>
          </p>
          <p className="text-bold">
            We have an{" "}
            <a
              href="https://teachersdiscovery.blog/angelos-mexico-quest-livestream-adventure-for-spanish-students-interactive-event-learn-spanish/"
              target="_blank"
              rel="noreferrer"
            >
              entire line up of quests
            </a>{" "}
            scheduled!
          </p>
          <p>
            A full-year Flangoo subscription is only $169 -{" "}
            <b>with 180 students free.</b> <br />
            Save up to 57% with a multi-year subscription. <br />
            A month of Flangoo for just $29.99. <br />
            No risk. No ongoing obligation.
          </p>
          <h4>All subscriptions include:</h4>
          <ul>
            <li>
              Access to all Angelo's Quest programming and special teaching
              resources
            </li>
            <li>
              <b>Access for you and up to 180 students</b> - enjoy immersive
              native language and culture
            </li>
            <li>
              <b>
                Flangoo.com digital reader library including time-saving teacher
                controls
              </b>{" "}
              for the length of your subscription! Did we mention 180 student
              accounts are included?
            </li>
          </ul>
        </div>
        <div className="col-md-4 text-center">
          <p>
            Once you have an active subscription, click the{" "}
            <b className="darker">Angelo's Quest</b> selection in the main
            navigation. You'll see the programming.
          </p>
          <a href="/purchaseplan" className="cta">
            Select Subscription
          </a>
          <p>
            Why not? You'll have a blast with your class on Angelo's Quest and
            discover what a Flangoo subscription can do for you too.
          </p>
          <p>
            Over 350,000 students are learning with Flangoo.com today. It's fun
            and it works.
          </p>
          <p className="mb-5">
            Join the adventure! Engage your students. Get a real-world,
            educational experience. <br />
            <a href="purchaseplan">Get Angelo and Flangoo</a>
          </p>
          <h3 className="mt-5 pt-4">Already a subscriber?</h3>
          <h4>
            <a href="signin">Sign in</a>
          </h4>
          <small>Subscribers watch for free.</small>
        </div>
      </div>
      <h4>Technical Note:</h4>
      <p>
        Angelo's Livestream will be broadcast with the help of the YouTube®
        platform. If you plan to watch Angelo's Quest livestream, please talk to
        your IT person or tech department to ensure they allow videos from our
        <b>Teacher's Discovery YouTube® Channel</b> through your school's
        firewall. You can check to see if it works beforehand by going to{" "}
        <b>flangoo.com/live</b>
        (from the device you intend to use for viewing) and playing the video.
      </p>
    </div>
  </main>
);

export default AngelosPage;
