import React from "react";

const Section1: React.FC = () => (
  <div className="container section">
    <h3>Stream Comprehensible Readers on Demand for Today's Remote Learners</h3>
    <div className="row">
      <div className="col-md-5 col-md-offset-1">
        <p>
          Flangoo is a web-based service that streams World Language digital
          readers to your students at home. Subscriptions work with any device,
          from laptops to desktops, tablets to smartphones. Wherever your
          students are, Flangoo is at their fingertips.
        </p>
        <p>
          How does it work? You, the teacher, purchase the subscription for a
          low monthly fee and get access to the entire Flangoo library for
          yourself and up to 180 of your students. Students get unique passcodes
          and individual access to read the books. You choose the books or make
          it your online FVR library and let your students choose what they
          read. Think of it like our version of Netflix® for readers!
        </p>
      </div>

      <div className="col-md-5">
        <img
          src={`${process.env.REACT_APP_CDN_IMG}on-devices-2.png`}
          className="img-fluid"
          alt="On devices"
        />
      </div>
    </div>
  </div>
);

export default Section1;
