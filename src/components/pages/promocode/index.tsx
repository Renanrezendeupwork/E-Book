import React from "react";
import { Link, useParams } from "react-router-dom";
import SignupForm from "../signup/signupForm";

const PromoCodePage: React.FC = () => {
  const { promocode } = useParams<{ promocode: string }>();
  return (
    <div
      className="cover_img "
      style={{
        backgroundImage: `url(${process.env.REACT_APP_CDN_IMG}invited_bg.jpg)`,
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-md-7"></div>
          <div className="col-md-5 ">
            <div className="material_shadows_3 invitation_form">
              <h4 className="black_text">
                Redeem Your Invitation Code and Enjoy Your Special Free Trial
              </h4>
              <p className="black_text">No credit card required.</p>
              <SignupForm
                button_txt="Redeem Gift"
                promocode={promocode ? promocode.toLocaleUpperCase() : true}
              />
              <br />
              <p className="black_text">
                Already have an account?{" "}
                <Link to="/signin" className="text-primary">
                  Sign In
                </Link>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCodePage;
