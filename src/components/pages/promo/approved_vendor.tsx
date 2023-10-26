import React from "react";
import getMainCtas from "../../../middleware/main_ctas";

type ApprovedVendorProps = {
  remove_ctas: boolean;
};
const ApprovedVendor: React.FC<ApprovedVendorProps> = ({ remove_ctas }) => {
  const main_ctas = getMainCtas();
  return (
    <div className="section approved_vendor bg_gray py-3">
      <div className="container">
        <h3>We May Already Be an Approved Vendor</h3>
        <p className="small">Flangoo is a subscription service provided by</p>
        <img
          src={`${process.env.REACT_APP_CDN_IMG}td-logo.png`}
          alt="TD Logo"
        />
        <p className="small">
          Trusted by teachers and education professionals for over 40 years!
        </p>

        <p className="mt-5">
          Check to see if Teacher's Discovery is on your approved vendor list.
          You can also purchase Flangoo yearly subscriptions directly from our
          website or catalog the same way you would purchase any of our
          resources.
        </p>
        <p>Item # 1B7050SUB1Y</p>
        {!remove_ctas ? (
          <div className="ctas">
            <a href="/signup" className="main_cta btn btn-danger btn-lg">
              {main_ctas.main}
              <small>{main_ctas.sub}</small>
            </a>
            <a
              href="https://www.teachersdiscovery.com/product/flangoo-spanish-digital-readers-subscription/spanish"
              target="_blank"
              rel="noreferrer"
              className="main_cta btn btn-danger btn-lg buy_btn"
            >
              Buy Flangoo Now at Teacher's Discovery
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ApprovedVendor;
