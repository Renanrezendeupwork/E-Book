import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Tooltip } from "reactstrap";
import copybutton from "../assets/copy-link-button.png";

type ButtonTypes =
  | "link"
  | "primary"
  | "secondary"
  | "muted"
  | "disabled"
  | "danger"
  | "success"
  | "dark"
  | "transparent"
  | "outline-primary"
  | "outline-secondary"
  | "outline-muted"
  | "outline-disabled"
  | "outline-danger"
  | "outline-dark"
  | "outline-info"
  | "outline-success";

export type TooltipPossitionTypes =
  | "auto"
  | "auto-start"
  | "auto-end"
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end";

type ButtonTootipProps = {
  id: string;
  tooltip_txt?: string;
  link?: string | false;
  type?: ButtonTypes;
  position?: TooltipPossitionTypes;
  className?: string;
  children?: any;
  onClick?: any;
  data_value?: string;
  disabled?: boolean;
  focuseable?: boolean;
};

export const ButtonTootip: React.FC<ButtonTootipProps> = ({
  id,
  children,
  type,
  tooltip_txt,
  position = "top",
  link = false,
  focuseable = false,
  className,
  onClick,
  data_value,
  disabled,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  return (
    <>
      {link ? (
        <Link
          className={`btn btn-${type} ${className} ${
            disabled ? "disabled" : ""
          } `}
          id={id}
          to={link}
        >
          {children}
        </Link>
      ) : (
        <button
          className={`btn btn-${type} ${className} ${
            focuseable ? "" : "no_focus"
          }`}
          id={id}
          onClick={onClick}
          disabled={disabled}
          data-type={data_value}
        >
          {children}
        </button>
      )}
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

type CoppyButtonProps = {
  text: string;
  classes?: string;
  showimg?: boolean;
};
export const CopyButton: React.FC<CoppyButtonProps> = ({
  text,
  children,
  classes,
  showimg,
}) => {
  const [state, setState] = useState(true);
  const copy = () => {
    const el = document.createElement("textarea");
    if (!text) return false;
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    setState(false);
    setTimeout(() => {
      setState(true);
    }, 1000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={`btn-copy btn p-0 text-white ${classes}`}
    >
      {children}
      {state ? (
        showimg ? (
          <img src={copybutton} alt="coppy button" />
        ) : (
          <i className="far fa-clone ml-2" aria-hidden="true"></i>
        )
      ) : (
        <small className="ml-2">Copied!</small>
      )}
    </button>
  );
};

type ButtonGroupProps = {
  children: any;
  className?: string;
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  className,
}) => (
  <div
    className={`btn-group ${className}`}
    role="group"
    aria-label="Basic example"
  >
    {children}
  </div>
);

type CheckoutButtonProps = {
  txt: string;
  onClick?: any;
  checked?: boolean;
  value?: string;
  id?: string;
  type?: "button" | "submit" | "reset";
  size?: "small" | "normal" | "large";
  className?: string;
};

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  txt,
  checked,
  value,
  id,
  onClick,
  type = "button",
  size = "normal",
  className = "btn-primary",
}) => (
  <button
    type={type}
    className={`btn ${checked ? "active" : ""} ${className} ${renderSize(
      size
    )} `}
    id={id}
    data-checked={checked}
    value={value || txt.toLocaleLowerCase().split(" ").join("_")}
    onClick={onClick}
  >
    <i className={`fal ${checked ? "fa-check-square" : "fa-square"} `}></i>{" "}
    {txt}
  </button>
);

type GoggleSignupProps = {
  txt: string;
  fun: any;
  disalbed?: boolean;
};
export const GoggleSignup: React.FC<GoggleSignupProps> = ({
  txt,
  fun,
  disalbed,
}) => (
  <button
    disabled={disalbed}
    type="button"
    className={`login-with-google-btn btn-block ${disalbed ? "disalbed" : ""}`}
    onClick={fun}
  >
    <img
      src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48cGF0aCBkPSJNMTcuNiA5LjJsLS4xLTEuOEg5djMuNGg0LjhDMTMuNiAxMiAxMyAxMyAxMiAxMy42djIuMmgzYTguOCA4LjggMCAwIDAgMi42LTYuNnoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjxwYXRoIGQ9Ik05IDE4YzIuNCAwIDQuNS0uOCA2LTIuMmwtMy0yLjJhNS40IDUuNCAwIDAgMS04LTIuOUgxVjEzYTkgOSAwIDAgMCA4IDV6IiBmaWxsPSIjMzRBODUzIiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNNCAxMC43YTUuNCA1LjQgMCAwIDEgMC0zLjRWNUgxYTkgOSAwIDAgMCAwIDhsMy0yLjN6IiBmaWxsPSIjRkJCQzA1IiBmaWxsLXJ1bGU9Im5vbnplcm8iLz48cGF0aCBkPSJNOSAzLjZjMS4zIDAgMi41LjQgMy40IDEuM0wxNSAyLjNBOSA5IDAgMCAwIDEgNWwzIDIuNGE1LjQgNS40IDAgMCAxIDUtMy43eiIgZmlsbD0iI0VBNDMzNSIgZmlsbC1ydWxlPSJub256ZXJvIi8+PHBhdGggZD0iTTAgMGgxOHYxOEgweiIvPjwvZz48L3N2Zz4="
      alt="Google Logo"
    />
    {txt} with Google
  </button>
);

function renderSize(size: "small" | "normal" | "large") {
  switch (size) {
    case "small":
      return "btn_sm";
    case "large":
      return "btn_lg";
    default:
      return "";
  }
}
