import React from "react";
import { Link } from "react-router-dom";

const LimitedOffer: React.FC = () => (
  <div className="container section text-center limited">
    <h3>FOR A LIMITED TIME</h3>
    <div className="text-center">
      <img
        src={`${process.env.REACT_APP_CDN_IMG}40-off-big.png`}
        className="img-fluid"
        alt="40% Offer"
      />
    </div>
    <h3>Subscribe to Flangoo now and get Flangoo locked in at 40% off.</h3>
    <Link to="/pricing" className="main_cta btn btn-danger btn-lg buy_btn">
      See Pricing for <br />
      more details
    </Link>
    <p className="mt-5">
      Limited time offer. Certain restrictions may apply. No promo code needed.{" "}
      <br />
      For more information, email{" "}
      <a href="mailto:help@flangoo.com">help@flangoo.com</a>.
    </p>
  </div>
);

export default LimitedOffer;
