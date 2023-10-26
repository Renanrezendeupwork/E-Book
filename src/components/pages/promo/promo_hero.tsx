import React from "react";
import { Wholesaler } from "../../../models/wholesaler";
import SignupForm from "../signup/signupForm";

type Props = {
  wholesaler?: Wholesaler;
  loading?: boolean;
};
const PromoHero: React.FC<Props> = ({ wholesaler, loading }) => {
  const image = wholesaler
    ? `${process.env.REACT_APP_SITE_URL}/${wholesaler?.cover}`
    : `${process.env.REACT_APP_CDN_IMG}flangoo-bg-books-image.png`;
  return (
    <div
      className="hero"
      style={{
        backgroundImage: loading ? "" : `url(${image})`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-6 col-sm-12">
            {wholesaler ? null : <InfoBlock />}
          </div>
          <div className=" col-md-6">
            <div className="material_shadows_3 invitation_form">
              <h4 className="black_text">Start Your 14-Day Free Trial</h4>
              <p className="text-dark">
                No Credit Card • No Obligation • No Student Information
              </p>
              <SignupForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoBlock: React.FC = () => (
  <>
    <img
      src={`${process.env.REACT_APP_CDN_IMG}flangoo-logo-4_1.png`}
      alt="Flangoo Logo"
    />
    <h1>Online Spanish, French, and German Readers and Short Stories</h1>
    <h4>200+ Titles, with More on the Way!</h4>
    <h4>Levels 1, 2, and 3+</h4>
    <h4>One Account Covers Up to 180 Students</h4>
    <h4>Use with Computers, Tablets, or Smartphones</h4>
  </>
);

export default PromoHero;
