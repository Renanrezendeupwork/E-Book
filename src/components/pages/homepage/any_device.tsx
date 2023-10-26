import React from "react";
import { Link } from "react-router-dom";

const AnyDevice: React.FC = () => (
  <div className="section section_05" id="section_05">
    <div className="container">
      <div className="row">
        <div className="col-md-7 col_right">
          <img
            src={process.env.REACT_APP_CDN_IMG + "devices.png"}
            className="img-fluid"
            alt="devices"
          />
        </div>
        <div className="col-md-5 col_left">
          <h3 className="text-left">Flangoo Works on Any Device</h3>
          <p>COMPUTER</p>
          <ul>
            <li>Windows PC</li>
            <li>macOS</li>
            <li>Chrome OS</li>
          </ul>
          <p>MOBILE & TABLET</p>
          <ul>
            <li>Amazon Fire Tablets</li>
            <li>Android Phones & Tablets</li>
            <li>iPhone & iPad</li>
          </ul>
          <Link to="/signup" className="btn btn-warning mt-5 ">
            {" "}
            Start Your Free Trial{" "}
          </Link>
        </div>
      </div>
    </div>
  </div>
);

export default AnyDevice;
