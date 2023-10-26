import React, { RefObject } from "react";

type ToggleSwitchProps = {
  disabled: "neutral" | boolean;
  click: any;
  id: string;
  lables?: boolean;
  classes?: string;
  colored?: boolean;
  small?: boolean;
  inline?: boolean;
  lables_txt?: {
    disabled: string;
    enabled: string;
  };
};
export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  disabled,
  click,
  id,
  lables = true,
  colored = true,
  small = false,
  inline = false,
  lables_txt,
  classes,
}) => (
  <div
    className={`switch_text ${classes ? classes : ""}   ${
      small ? "small" : ""
    } ${inline ? "inline" : ""} ${activeStatus(disabled)}`}
  >
    {lables && (
      <span className={`text ${disabled ? "on" : "off"}`}>
        {lables_txt ? lables_txt.disabled : "Off"}
      </span>
    )}
    <label
      className={`switch ${colored ? "" : "un_colored"} ${activeStatus(
        disabled
      )} `}
      data-action={disabled ? "active" : "deactive"}
    >
      <input type="checkbox" onClick={click} data-id={id} />
      <span className="slider round"></span>
    </label>
    {lables && (
      <span className={`text ${disabled ? "off" : "on"}`}>
        {lables_txt ? lables_txt.enabled : "On"}
      </span>
    )}
  </div>
);

type SelectGroupProps = {
  id: string;
  title: string;
  changeFun: any;
  selected?: string;
  view_all?: boolean;
  options: { value: string; txt: string }[];
  col?: string;
  placeholder?: string;
};
export const SelectGroup: React.FC<SelectGroupProps> = ({
  id,
  title,
  changeFun,
  selected,
  options = [],
  col = "col-md-4",
  placeholder = "Select an option",
  view_all = false,
}) => (
  <div className={`${col}`}>
    <h5>{title}</h5>
    <select
      className="form-control rounded-pill"
      name="hours"
      onChange={changeFun}
      value={selected}
    >
      {!selected || view_all ? (
        <option value="false">{placeholder}</option>
      ) : null}
      {options.map((item, key) => (
        <option value={item.value || item.txt} key={`select_${id}_${key}`}>
          {item.txt}
        </option>
      ))}
    </select>
  </div>
);

export function activeStatus(status: "neutral" | boolean) {
  switch (status) {
    case "neutral":
      return "neutral";
    case true:
      return "deactive";
    default:
      return "active";
  }
}

type ThSortProps = {
  title: string;
  id: string;
  style?: {};
  ref?: RefObject<HTMLTableCellElement> | null;
  handle_sort?: any;
  colSpan?: number;
  className?: string;
  type?: "asc" | "desc";
};
export const ThSort: React.FC<ThSortProps> = ({
  title,
  type,
  id,
  handle_sort,
  children,
  className,
  colSpan,
  style,
  ref,
}) => (
  <th
    className={`sort_th hovered ${className ? className : ""}`}
    data-id={id}
    ref={ref}
    onClick={handle_sort}
    colSpan={colSpan}
    style={style}
  >
    {title} {type ? <SortArrow type={type} /> : null}
    {children}
  </th>
);

type SortArrowProps = {
  type: "asc" | "desc";
};
export const SortArrow: React.FC<SortArrowProps> = ({ type }) => (
  <i
    className={`sort_arrow far fa-chevron-${
      type === "asc" ? "down" : "up"
    } small opacity_7`}
  ></i>
);
