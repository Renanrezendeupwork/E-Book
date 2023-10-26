import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import getMainCtas from "../../../middleware/main_ctas";
import { PlanItem } from "../../../models/user";

const AboutPage: React.FC = () => {
  const main_ctas = getMainCtas();
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const yearly = plans_data.find((plan) => plan.id === "3");
  return (
    <div className="about_page front_face">
      <Helmet title="About Flangoo" />
      <div
        className="hero"
        style={{
          backgroundImage: `url('${process.env.REACT_APP_CDN_IMG}flangoo-bg-books-image.png?v=1')`,
        }}
      ></div>
      <div className="container first-container last-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-10 col-md-offset-2">
              <h1>What Is Flangoo?</h1>
              <img
                src={`${process.env.REACT_APP_CDN_IMG}our-version-of-netflix.png`}
                className="img-fluid"
                alt="Our version of Netflix"
              />

              <p className="first-child">
                Flangoo is a subscription-based service for digital World
                Language readers!! A sister company of Teacher's Discovery®,
                Flangoo creates an affordable solution for World Language
                teachers who want to offer students a wide range of readers. One
                Flangoo account gives you and up to 180 students access to an
                entire virtual Free Voluntary Reading (FVR) library.
              </p>

              <h5>Selection of World Language Readers</h5>
              <p>
                Flangoo has titles from well-known authors such as Mira Canion,
                Jennifer Degenhardt, Tom Alsop, and Paula Twomey—just to name a
                few. Each language is organized by difficulty level, so students
                can find a selection of titles targeted to their skill level.
              </p>

              <h5>Competitive Prices</h5>
              <p>
                No more buying packs of $6-$12 paperback readers for a class of
                students. Just ${yearly?.price_amount} gives you and up to 180
                students unlimited access for an entire year. With a growing
                library of titles, varying difficulty levels, and native-speaker
                audio for each story, you save money while gaining value.
              </p>

              <h5>
                Made for Synchronous and Asynchronous Learning Environments
              </h5>
              <p>
                We want you to be prepared. Flangoo works anywhere on any
                device, including laptops, tablets, and smartphones. No software
                or special apps required. Whether you are in class, at home, on
                Google Classroom, or even on the moon, your students can still
                access an entire library of World Language readers.
              </p>

              <p>
                Disclaimer: We don't actually know what the Wi-Fi coverage is on
                the moon.
              </p>

              <h5>Upgrades? Heck Yeah!</h5>
              <p>
                We are continuously adding new features to Flangoo as we get
                feedback from teachers AND students! We are working on adding
                comprehensive chapter questions that are easy to add to Google
                Classroom, full chapter audio by native speakers, more titles
                for your students' enjoyment, and more!
              </p>

              <h5>Other Benefits</h5>
              <p>
                We don't ask for student info. There is no training required to
                use Flangoo, but support is always available if you need it. The
                trial is free and doesn't ask for a credit card. The paid
                version is available month-to-month, or save nearly 60% by
                purchasing annually. You can cancel your subscription at any
                time. Annual accounts do not auto-renew. Call us for custom
                quotes on multi-teacher licenses!
              </p>
              <p>Try it today. You and your students are going to love it.</p>

              <div className="row">
                <div className="col-md-6 center_btn text_xs_center">
                  <Link to="/signup" className="main_cta btn btn-danger btn-lg">
                    {main_ctas.main}
                    <small>{main_ctas.sub} </small>
                  </Link>
                </div>
                <div className="col-md-6">
                  <img
                    src={`${process.env.REACT_APP_CDN_IMG}on-devices@2x.png`}
                    className="img-fluid"
                    alt="on all devices"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
