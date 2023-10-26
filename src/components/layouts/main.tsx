import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useLocation } from "react-router-dom";
import { Link, useHistory } from "react-router-dom";

import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { LangItem } from "../../models/lang";
import { SETLANG } from "./queries";
import SearchInput from "./search";

import nav_data from "./nav.json";
import nav_side from "./nav_side.json";
import Notifications from "./notifications";
import { getUserImage } from "../../middleware/common-functions";
import { UserSettings } from "../../models/user";

const hide_nav = ["reader"];

export const Header: React.FC = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const local_settings: UserSettings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );
  const history = useHistory();
  const [setLang] = useMutation(SETLANG);
  const languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "{}"
  );
  const [show_header, setshow_header] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location) {
      const page = location.pathname.split("/")[1];

      if (hide_nav.find((i) => i === page)) {
        setshow_header(false);
      } else if (!show_header) {
        setshow_header(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!show_header) {
    return null;
  }

  const handleChangeLang = (ev: { currentTarget: HTMLButtonElement }) => {
    const { lang_id, to } = ev.currentTarget.dataset;
    console.log("main.tsx:56 | lang_id", lang_id);
    if (!lang_id) return false;
    setLang({ variables: { lang_id } });
    history.push({
      pathname: to,
    });
  };
  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar className="hidden-print navbar nav_dark navbar-expand-lg navbar-dark main_nav">
      <Link className="navbar-brand" to="/" id="main_logo_btn" />
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav navbar className=" w-100">
          {languages && languages.length > 0
            ? languages.map((lang) => (
                <NavItem
                  className={`nav-item align-items-center d-flex ${
                    user.lang_id === lang.id ? "active" : ""
                  }`}
                  key={`nav_item_lang${lang.id}`}
                >
                  {user.lang_id === lang.id ? (
                    <Link className="nav-link" to="/">
                      {lang.name} Library
                    </Link>
                  ) : (
                    <button
                      className="btn nav-link"
                      onClick={handleChangeLang}
                      data-lang_id={lang.id}
                      data-to={`/library/${lang.name.toLocaleLowerCase()}`}
                    >
                      {lang.name} Library
                    </button>
                  )}
                </NavItem>
              ))
            : null}
          {nav_data.map((item) => {
            if (item.teacher_only && !user.is_teacher) return null;
            if (!item.to) return null;
            return (
              <NavItem
                className="nav-item  align-items-center d-flex"
                onClick={toggle}
                key={`nav_item_${item.to}`}
              >
                <Link className="nav-link" to={item.to}>
                  {item.txt}
                </Link>
              </NavItem>
            );
          })}

          <SearchInput />
          <Notifications />
          <UncontrolledDropdown className="nav-item dropdown mr-2">
            <DropdownToggle nav caret id="user_nav">
              <img
                src={
                  user.profile_pic
                    ? getUserImage(user.profile_pic)
                    : "https://cdn.flangoo.com/assets/global/thumb1.png"
                }
                className="profile_img"
                alt="User Profile"
              />{" "}
              {user.name}
            </DropdownToggle>
            <DropdownMenu right>
              {nav_side.map((item) => {
                if (item.teacher_only && !user.is_teacher) return null;
                if (item.student_only && user.is_teacher) return null;
                if (item.admin && !user.admin) return null;
                if (!user.is_teacher) {
                  if (
                    item.priv &&
                    local_settings.hide_achievements &&
                    local_settings.hide_achievements === true
                  )
                    return null;
                }
                if (item.type === "link") {
                  return (
                    <DropdownItem key={`nav_side_${item.to}`}>
                      <a
                        className="nav-link"
                        href={item.to}
                        target="_blank"
                        id={`nav_item${item.to.split("/").join("_")}`}
                        rel="noreferrer"
                      >
                        {item.txt}
                      </a>
                    </DropdownItem>
                  );
                }
                return (
                  <DropdownItem key={`nav_side_${item.to}`}>
                    <Link
                      className="nav-link"
                      to={item.to}
                      onClick={toggle}
                      id={`nav_item_${item.to.split("/").join("_")}`}
                    >
                      {item.txt}
                    </Link>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  );
};

export const Footer = () => {
  const [show_footer, setshow_footer] = useState<boolean | "live">(true);
  const location = useLocation();
  const date = new Date();
  const year = date.getFullYear();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (location) {
      const page = location.pathname.split("/")[1];
      if (page === "live") {
        setshow_footer("live");
      } else if (hide_nav.find((i) => i === page)) {
        setshow_footer(false);
      } else if (show_footer !== true) {
        setshow_footer(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (!show_footer) {
    return null;
  }
  if (show_footer === "live") {
    return (
      <footer className="hidden-print ">
        <div className="container ">
          <div className="row justify-content-end">
            <div className="col-md-6">
              <img
                src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
                className="fb_footer ml-3"
                alt="Flangoo logo"
              />
              <img
                src="https://cdn.flangoo.com/assets/global/td-logo.png"
                className="fb_footer ml-3"
                alt="Teacher's discovery logo"
              />
              <img
                src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/mex_logo.png"
                className="fb_footer ml-3"
                alt="Mexico logo"
              />
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="hidden-print ">
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <img
              src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white120.png"
              alt="Logo"
              className="ftr-logo"
            />
            <ul className="list-inline">
              <li className="list-inline-item mr-4">
                <Link to={`/faq`}>FAQ</Link>
              </li>
              <li className="list-inline-item mr-4">
                <Link to={`/general/privacypolicy`}>Privacy Policy</Link>
              </li>
              <li className="list-inline-item mr-4">
                <Link to={`/general/refundpolicy`}>Refund Policy</Link>
              </li>
              <li className="list-inline-item mr-4">
                <Link to="/refer_friend">Refer a Friend</Link>
              </li>
              {user.is_teacher ? (
                <li className="list-inline-item mr-4">
                  <a
                    target={"_blank"}
                    rel="noreferrer"
                    href="https://docs.google.com/forms/d/e/1FAIpQLSeUWuSiPyHQ-R966d4SNFgOx3_GJuXLFXQ3Vn5Eo3ulfqTFug/viewform"
                  >
                    <span>Become an Author</span>
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div className="col-lg-5">
            <a
              href="https://www.facebook.com/SpanishFlangoo/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="https://cdn.flangoo.com/assets/global/facebook_nav.png"
                className="fb_footer"
                alt="Facbook logo"
              />
            </a>
            <a
              href="https://www.teachersdiscovery.com/"
              rel="noreferrer"
              target="_blank"
            >
              <img
                src="/td.png"
                alt="Teacher's discovery logo"
                style={{ width: "157px", height: "75px" }}
              />
            </a>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div className="ftr-copy">
              <p>
                Copyright © 2005-{year} Teacher's Discovery®, a division of
                American Eagle Co., Inc. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
