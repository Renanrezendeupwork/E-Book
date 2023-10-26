import React from "react";
import { Helmet } from "react-helmet";

const ContactPage: React.FC = () => (
  <div className="contact_page front_face container">
    <Helmet title="Contact Flangoo" />
    <div className="row">
      <div className="col-md-6">
        <h1>How Can We Help You?</h1>
        <p>
          At Flangoo your satisfaction is our main goal. Do you have questions?
          Having trouble adding student accounts? Or do you just want to know
          more about what Flangoo is? We are here to help! Please contact us
          using the provided form and we will respond to you typically within
          one business day or less. If you have an immediate concern and want to
          talk to us right away, call Customer Service at 1-800-TEACHER or use
          the LiveChat icon at the bottom-right of your browser.
        </p>
        <p>
          Prefer a hands-on approach? Schedule a 15-minute guided tour of
          Flangoo! In just 15 minutes we'll help you get set up, show you where
          all the buttons and features are, answer your questions, and get you
          up and running quickly so you can make the most of your account.
        </p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          <a
            href="https://calendly.com/teachers-discovery/flangoo-15-minute-tour"
            className="text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Schedule a Tour in English
          </a>
        </p>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          <a
            href="https://calendly.com/ricardo-marrufo/15min"
            className="text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Schedule a Tour in Spanish
          </a>
        </p>
      </div>
      <div className="col-md-6">
        <form
          method="POST"
          action="https://teachersdiscovery.activehosted.com/proc.php"
          id="_form_65_"
          className="_form _form_65 _inline-form  "
        >
          <input type="hidden" name="u" value="65" />
          <input type="hidden" name="f" value="65" />
          <input type="hidden" name="s" />
          <input type="hidden" name="c" value="0" />
          <input type="hidden" name="m" value="0" />
          <input type="hidden" name="act" value="sub" />
          <input type="hidden" name="v" value="2" />
          <div className="_form-content">
            <div className="form-group _x39791529 _full_width ">
              <label className="_form-label">First Name*</label>
              <div className="_field-wrapper">
                <input
                  className="form-control"
                  type="text"
                  name="firstname"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="form-group _x02680186 _full_width ">
              <label className="_form-label">Last Name*</label>
              <div className="_field-wrapper">
                <input
                  className="form-control"
                  type="text"
                  name="lastname"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="form-group _x59776706 _full_width ">
              <label className="_form-label">Email*</label>
              <div className="_field-wrapper">
                <input
                  className="form-control"
                  type="text"
                  name="email"
                  placeholder=""
                  required
                />
              </div>
            </div>
            <div className="form-group _x18374413 _full_width ">
              <label className="_form-label">Phone (Optional)</label>
              <div className="_field-wrapper">
                <input
                  className="form-control"
                  type="text"
                  name="phone"
                  placeholder=""
                />
              </div>
            </div>
            <div className="form-group _field26 _full_width ">
              <label className="_form-label">How Can We Help You?*</label>
              <div className="_field-wrapper">
                <textarea
                  name="field[26]"
                  className="form-control"
                  rows={4}
                  placeholder=""
                  required
                ></textarea>
              </div>
            </div>
            <div className="_button-wrapper _full_width">
              <button id="_form_65_submit" className="_submit" type="submit">
                Submit
              </button>
            </div>
            <div className="_clear-element"></div>
          </div>
          <div className="_form-thank-you d-none"></div>
        </form>
      </div>
    </div>
  </div>
);

export default ContactPage;
