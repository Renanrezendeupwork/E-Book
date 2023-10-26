import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ClassItem } from "../../../models/classes";
import { UserItem } from "../../../models/user";
import { CopyButton } from "../../common/buttons";
import { GET_CLASSES } from "./queries";

const HowStudentSignup: React.FC = () => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [class_id, setClassId] = useState("");
  const [signupUrl, setSignupUrl] = useState(
    `${process.env.REACT_APP_URL}/studentsignup/${user.id}`
  );
  const { data: classes_db } = useQuery<{ classes: ClassItem[] }>(GET_CLASSES, {
    fetchPolicy: "no-cache",
  });

  const handleType = (ev: { target: HTMLSelectElement }): void => {
    const value = ev.target.value;
    setClassId(value);
    const set_url = `${process.env.REACT_APP_URL}/studentsignup/${user.id}${
      value !== "0" ? `/${value}` : ""
    }`;
    setSignupUrl(set_url);
  };

  return (
    <main className="first-container last-container py-5">
      <div className="container">
        <h3>How to Have Your Students Sign Up</h3>
        <br />
        <h3>Add Students to class</h3>
        <div className="row">
          <div className="col-md-4">
            {classes_db && classes_db.classes ? (
              <div className={`form-group `}>
                <label className="text-white green_dark">
                  {" "}
                  Select if you want to add students to a class
                </label>
                <select
                  className="form-control"
                  data-type="class_id"
                  id="class_id"
                  onChange={handleType}
                  value={class_id}
                >
                  <option value={0}>Let Students Decide</option>
                  {classes_db.classes.map((item, key) => (
                    <option
                      key={`classes_db.classes_${item.value}`}
                      value={item.value}
                    >
                      Add to: {item.txt}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>
        </div>
        <h4>
          OPTION 1: Post the link to your Learning Management System (LMS)
        </h4>
        <p>
          <CopyButton classes="green_dark" text={signupUrl} showimg={true}>
            <span id="signupUrl">{signupUrl}</span>
          </CopyButton>
        </p>
        <p>
          When students sign up, they will only be asked their full name,
          hour/period, and to create a password. They will immediately be added
          to your student panel and given a login code.
          <br />
          <b>
            NOTE: When you send them the link above, make sure you remind them
            to save their login code and password for future use.
          </b>
        </p>

        <h4>OPTION 2: Email your students</h4>
        <p>Copy the below text for a mass email to your students.</p>
        <p>______________________</p>
        <p>
          Good morning, Spanish students,
          <br />
          I have recently purchased a subscription to Flangoo.com, a
          Netflix-type site of Spanish digital readers.
          <br />
          Please click the link below and register your name and class period.
          <br />
          NOTE: You must write down your login code and password
          <br />
          so that you do not forget it!
          <br />
          {signupUrl}
        </p>
        <p>
          After you register, I will let you know what readers we will start
          reading soon. Thank you.
        </p>
        <p>______________________</p>
        <br />
        <br />

        <Link to="/students" className="btn btn-danger mb-4">
          {" "}
          Back to Student List{" "}
        </Link>
      </div>
    </main>
  );
};

export default HowStudentSignup;
