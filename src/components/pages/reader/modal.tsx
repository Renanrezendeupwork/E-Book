import React from "react";
import { Link } from "react-router-dom";
type BackDropProps = {
  show: boolean;
  setActive: any;
};

const BackDrop: React.FC<BackDropProps> = ({ show, setActive }) => (
  <div className={`unactive_backdrop ${show ? "active" : ""}`}>
    <h4>
      Are you still there? <br />
    </h4>
    <div className="ctas">
      <button className="btn btn-primary" onClick={setActive}>
        I'm here
      </button>
      <br />
      <Link to="/">Back to Readers </Link>
    </div>
  </div>
);

export default BackDrop;
