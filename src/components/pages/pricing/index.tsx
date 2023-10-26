import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import getMainCtas from "../../../middleware/main_ctas";
import { PlanItem } from "../../../models/user";

const PricingPage: React.FC = () => {
  const plans_data: PlanItem[] = JSON.parse(
    localStorage.getItem("plans_data") || "{}"
  );
  const main_ctas = getMainCtas();
  const monthly_plan = plans_data.find((plan) => plan.id === "1");
  return (
    <div className="pricing_page">
      <Helmet title="Pricing Page" />
      <div
        className="hero"
        style={{
          backgroundImage: `url('${process.env.REACT_APP_CDN_IMG}flangoo-bg-books-image.png?v=1')`,
        }}
      ></div>
      <div className="pricing_page front_face">
        <div className="container ">
          <div className="row justify-content-center">
            <div className="col-md-10">
              <h1 className="text-center">
                Try first and upgrade later. No credit card required.
              </h1>
              <div className="text-center">
                <img
                  src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo-Price-Grid_2023.jpg"
                  className="img-fluid w-75"
                  alt="Flangoo Prices"
                />
              </div>
              <br />
              <br />

              <p>
                1-Month Subscription available for ${monthly_plan?.price_amount}
                . Does not auto-renew.
              </p>

              <h2>Flangoo Gives You Instant Access to:</h2>

              <ul style={{ fontSize: "16px", color: "#fff" }}>
                <li>
                  <b>Spanish, French, and German readers</b> with more being
                  added all the time
                </li>
                <li>
                  <b>Native-spoken audio</b> for every title
                </li>
                <li>
                  <b>Mouse-over glossary</b> for the tough words in Levels 1 and
                  2
                </li>
                <li>
                  <b>Various levels</b> to meet your students'
                  needs&mdash;Levels Pre-1, 1, 2, and 3+
                </li>
                <li>
                  <b>Best-selling authors</b> Blaine Ray, Mira Canion, Jennifer
                  Degenhardt, Fabiola Canale, Deb Navarre, Tom Alsop, and many
                  more
                </li>
                <li>
                  <b>Comprehension questions</b> included for every chapter of
                  every book
                </li>
                <li>
                  <b>Enhanced™ Readers</b> featuring video, audio, cultural
                  notes, and comprehension questions
                </li>
                <li>
                  <b>Engaging titles</b> and features being added every month!
                </li>
                <li>
                  <b>One account</b> supports up to 180 of your students at no
                  additional cost!
                </li>
                <li>
                  <b>New reporting features</b> give you detailed information
                  about your students' reading time
                </li>
                <li>
                  <b>Coming this fall:</b> auto-graded questions, hover-over
                  glossary words, app for student access, badges, and more!
                </li>
              </ul>

              <h2>It Starts with a Free Trial.</h2>

              <p>
                There's no credit card required and no strings attached. We just
                want you to try it for yourself, because we feel confident that
                once you try it, you and your students are going to love it.
              </p>
              <p>
                When you're ready to purchase Flangoo, simply click “Upgrade
                Membership” in your Flangoo account settings, or you can
                purchase your subscription through Teacher's Discovery. Our
                customer support team is ready to assist you, and you can cancel
                your subscription at any time.
              </p>

              <div className="ctas">
                <Link to="/signup" className="main_cta btn btn-danger btn-lg">
                  {main_ctas.main}
                  <small>{main_ctas.sub}</small>
                </Link>
                <a
                  href="https://www.teachersdiscovery.com/product/flangoo-spanish-digital-readers-subscription/spanish"
                  target="_blank"
                  rel="noreferrer"
                  className="main_cta btn btn-danger btn-lg buy_btn"
                >
                  Buy Flangoo Now at Teacher's Discovery
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
