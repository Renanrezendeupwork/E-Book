import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "reactstrap";
import { TooltipPossitionTypes } from "./buttons";

interface IconJumbotronProps {
  icon: string;
  id?: string;
  txt: string;
  classes?: string;
  txt_classes?: string;
  help_text?: string;
  help_txt_classes?: string;
  cta?: {
    classes?: string;
    link?: string;
    href?: string;
    txt?: string;
    function?: () => void;
  };
}

interface RatingStarsProps {
  id: string;
  value: number | string;
  classes?: string;
  gold?: boolean;
  max?: number;
}

export const IconJumbotron: React.FC<IconJumbotronProps> = ({
  icon = "",
  id = "",
  txt = "",
  classes = "",
  txt_classes = "",
  help_text = "",
  help_txt_classes = "",
  cta = {},
}) => (
  <div className="icon_jumbotron" id={id}>
    <i className={`${icon} ${classes}`} aria-hidden="true"></i>
    <h1 className={txt_classes}>{txt}</h1>
    <p className={help_txt_classes}>{help_text}</p>
    {cta.link || cta.function ? (
      cta.link ? (
        <Link className={`btn ${cta.classes}`} to={cta.link}>
          {cta.txt}
        </Link>
      ) : cta.href ? (
        <a className={`btn ${cta.classes}`} href={cta.href}>
          {cta.txt}
        </a>
      ) : (
        <button className={`btn ${cta.classes}`} onClick={cta.function}>
          {cta.txt}
        </button>
      )
    ) : null}
  </div>
);

export const RatingStars: React.FC<RatingStarsProps> = ({
  id,
  value,
  classes = "",
  gold = true,
  max = 5,
}) => {
  const result = [];
  value = Number(value);
  for (let i = 1; i <= max; i++) {
    result.push(
      <i
        className={`mr-1 ${i <= value ? "fas" : "far"} fa-star ${
          gold ? "text_gold" : ""
        }`}
        aria-hidden="true"
        key={`${id}_rating_${i}`}
      ></i>
    );
  }
  return <div className={`rating_stars ${classes}`}>{result}</div>;
};

type IconTootipProps = {
  id: string;
  icon: string;
  tooltip_txt: string;
  position?: TooltipPossitionTypes;
};

export const IconTootip: React.FC<IconTootipProps> = ({
  id,
  icon,
  tooltip_txt,
  position = "top",
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      <i id={id} className={icon}></i>
      <Tooltip
        placement={position}
        isOpen={tooltipOpen}
        target={id}
        delay={{ show: 500, hide: 200 }}
        toggle={toggle}
      >
        {tooltip_txt}
      </Tooltip>
    </>
  );
};

type PasswordInputProps = {
  handleType: any;
  placeholder?: string;
  value?: string;
  id?: string;
  onKeyPress?: any;
  data_type: string;
};
export const PasswordInput: React.FC<PasswordInputProps> = ({
  handleType,
  placeholder,
  value,
  onKeyPress,
  data_type,
  id,
}) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  };

  return (
    <>
      <div className="input-group mb-3">
        <input
          type={show ? "text" : "password"}
          className="form-control"
          id={id}
          onChange={handleType}
          placeholder={placeholder}
          data-type={data_type}
          value={value}
          onKeyPress={onKeyPress}
          autoComplete="new-password"
        />
        <div className="input-group-append">
          <button className="btn no_focus" type="button" onClick={handleShow}>
            <i className={`fal fa-fw fa-eye${show ? "" : "-slash"}`}></i>
          </button>
        </div>
      </div>
    </>
  );
};
