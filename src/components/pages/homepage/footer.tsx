import React from "react";
import { Link } from "react-router-dom";

const FooterHome: React.FC = () => {
  const footer_icons = ["ed2d.png", "access.png", "lock.png"];
  return (
    <footer className="hidden-print footer_home">
      <div className="container">
        <div className="row">
          <div className="col-lg-12 logos">
            <div>
              {footer_icons.map((icon) => (
                <img
                  src={`${process.env.REACT_APP_CDN_IMG}${icon}`}
                  key={`key_${icon}`}
                  alt="Footer icon"
                  className="fb_footer mb-2"
                />
              ))}
              <p>
                We're proud to have an accessible website. Flangoo is COPPA,
                FERPA, ED 2-D, <br /> and ADA compliant, and protected by Cyber
                Insurance Security.
              </p>
            </div>
            <div className="">
              <a
                href="https://www.facebook.com/SpanishFlangoo/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`${process.env.REACT_APP_CDN_IMG}facebook_nav.png`}
                  alt="facebook logo"
                  className="fb_footer"
                />
              </a>
              <a
                href="https://www.teachersdiscovery.com/"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={`${process.env.REACT_APP_CDN_IMG}td-logo.png`}
                  alt="teachers discovery logo"
                  className="img-fluid"
                />
              </a>
            </div>
          </div>
          <div className="col-lg-12">
            <h3>Helpful Links</h3>
            <ul className="list-unstyled">
              <li>
                <Link to="/titles">Included Titles</Link>
              </li>
              <li>
                <Link to="/pricing">Pricing</Link>
              </li>
              <li>
                <Link to="/contact">Get a Quote</Link>
              </li>
              <li>
                <a
                  href="https://www.teachersdiscovery.com/downloads/W9.pdf"
                  target="_blank"
                  rel="noreferrer"
                >
                  Download W-9{" "}
                </a>
              </li>
            </ul>
            <ul className="list-unstyled">
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/support">Support</Link>
              </li>
              <li>
                <Link to="/general/privacypolicy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/general/refundpolicy">Refund Policy</Link>
              </li>
            </ul>

            <ul className="list-unstyled">
              <li>
                <Link to="/contact">Get a Live-Person Guided Walkthrough</Link>
              </li>
              <li>
                <Link to="/about">About Flangoo</Link>
              </li>
              <li>
                <a
                  target={"_blank"}
                  rel="noreferrer"
                  href="https://docs.google.com/forms/d/e/1FAIpQLSeUWuSiPyHQ-R966d4SNFgOx3_GJuXLFXQ3Vn5Eo3ulfqTFug/viewform"
                >
                  <span>
                    Become an Author{" "}
                    <i className="fas fa-pen-alt text-white"></i>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div className="col-md-12 mt-3">
            <p>
              Copyright © 2005-{new Date().getFullYear()} Teacher's Discovery®,
              a division of American Eagle Co., Inc. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default FooterHome;
