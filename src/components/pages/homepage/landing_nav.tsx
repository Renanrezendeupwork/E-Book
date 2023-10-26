import React, { useState } from "react";
import { Link } from "react-router-dom";

const Nav: React.FC = () => {
  const [show, setShow] = useState(false);

  const toggle = () => setShow(!show);
  return (
    <nav className="navbar navbar-fixed-top nav_dark landing_nav px-4 py-3">
      <Link to="/" className="navbar-brand">
        <img
          src={process.env.REACT_APP_CDN_IMG + "flangoo-logo-button.png"}
          alt="nav logo"
        />
      </Link>
      <div>
        {" "}
        <a
          className="btn btn-link "
          target={"_blank"}
          href="https://flangoo-cdn.s3.us-east-2.amazonaws.com/docs/ESSER_Facts_E-Book.pdf"
          rel="noreferrer"
        >
          <span>ESSER Grant</span>
        </a>
        <a
          className="btn btn-danger mr-3"
          target={"_blank"}
          rel="noreferrer"
          href="https://docs.google.com/forms/d/e/1FAIpQLSeUWuSiPyHQ-R966d4SNFgOx3_GJuXLFXQ3Vn5Eo3ulfqTFug/viewform"
        >
          <span>
            Become an Author <i className="fas fa-pen-alt text-white"></i>
          </span>
        </a>
        <div className="btn-group login_ctas">
          <Link to="/student_signin" className="btn btn-primary">
            {" "}
            Student Sign-In{" "}
          </Link>
          <button
            type="button"
            onMouseEnter={toggle}
            onClick={toggle}
            className="btn btn-primary dropdown-toggle dropdown-toggle-split no_focus"
            data-toggle="dropdown"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle Dropdown</span>
          </button>
          <div
            onMouseLeave={toggle}
            className={`dropdown-menu dropdown-menu-right bg-light ${
              show ? "show" : ""
            } `}
          >
            <Link to="/signin" className="dropdown-item" onClick={toggle}>
              {" "}
              Teacher Sign-In
            </Link>
            <div className="dropdown-divider"></div>
            <Link className="dropdown-item" to="/signup" onClick={toggle}>
              Create Teacher Account
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
