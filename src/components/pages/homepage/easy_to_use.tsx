import React from "react";
import { Link } from "react-router-dom";

const EasyToUse: React.FC = () => (
  <div className="section section_04" id="section_04">
    <div className="container">
      <h3 className="text-left">Unbelievably Easy to Use!</h3>
      <div className="row">
        <div className="col-md-6">
          <p>
            The teacher dashboard is set up so simply, you will hit the ground
            running from day one. You can manage students more easily than ever.
            Have students add themselves to the group or class of your choice.
            You have control to allow classes access to just one title, several
            titles, or the whole library. See the time students spent reading,
            how far they have read, who is reading what title, and of course,
            how well they are comprehending.
          </p>
          <Link to="/signup" className="btn btn-primary mt-5 ">
            {" "}
            Start Your Free Trial{" "}
          </Link>
        </div>
        <div className="col-md-6">
          <img
            src={process.env.REACT_APP_CDN_IMG + "Easy-to-Use.png"}
            className="img-fluid"
            alt="Easy to Use"
          />
        </div>
      </div>
    </div>
  </div>
);

export default EasyToUse;
