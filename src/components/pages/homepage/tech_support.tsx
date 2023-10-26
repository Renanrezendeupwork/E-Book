import React from "react";
import { Link } from "react-router-dom";

const TechSupport: React.FC = () => (
  <div className="section section_06" id="section_06">
    <div className="container">
      <div className="row">
        <div className="col-md-7 col_left">
          <h3 className="text-left">FREE Tech Support. Always!</h3>
          <p>
            If you ever get stuck, we have live people to help you. <br />
            Call the toll-free number, use the LiveChat screen, schedule
            15-minute live-person guided tours, or even talk to a current World
            Language teacher about how they use Flangoo in their class! And we
            always answer emails the same day, too!
          </p>
          <Link to="/contact" className="btn btn-primary mt-5 ">
            {" "}
            Sign Up for Walkthrough
          </Link>
        </div>
        <div className="col-md-5 col_right">
          <img
            src={process.env.REACT_APP_CDN_IMG + "help-bubbles.png"}
            className="img-fluid"
            alt="Help bubbles"
          />
          <p className="text-center mt-3">
            <small>
              <i>"Talk to a LIVE Person for Assistance."</i>
            </small>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TechSupport;
