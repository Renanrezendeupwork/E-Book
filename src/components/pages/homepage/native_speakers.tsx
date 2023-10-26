import React from "react";
import { Link } from "react-router-dom";

const NativeSpeakers: React.FC = () => (
  <div className="section section_02" id="section_02">
    <div
      className="container-fluid background_image"
      style={{
        backgroundImage: `url(${
          process.env.REACT_APP_CDN_IMG + "panel-bg-with-effect.png"
        })`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6 col_left">
            <h3 className="text-left">
              Follow Along with Audio by Native Speakers
            </h3>
            <p>
              Every book includes AUDIO read by native speakers. PLUS your
              students can control how fast or slow the narrator speaks.
              <br />
              <br />
              Plus, you'll find video clips, a hover-over glossary, and more—all
              included!
            </p>
            <Link to="/signup" className="btn btn-primary mt-5 ">
              Start Your Free Trial{" "}
            </Link>
          </div>
          <div className="col-md-6 col_right">
            <img
              src={process.env.REACT_APP_CDN_IMG + "girl-with-headphones.png"}
              className="img-fluid"
              alt="girl-with-headphones.png"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default NativeSpeakers;
