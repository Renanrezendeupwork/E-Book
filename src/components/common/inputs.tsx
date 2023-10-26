import React from "react";

type FormGroupProps = {
  id: string;
  label: string;
  type?: string;
  classes?: string;
  input_classes?: string;
  placeholder?: string;
  handleChange?: any;
  value: string;
  autoComplete?: boolean;
  onBlur?: any;
  disabled?: boolean;
  readonly?: boolean;
  help?: HelpType | false;
};
type HelpType = {
  classes?: string;
  txt?: string;
};
export const FormGroup: React.FC<FormGroupProps> = ({
  id,
  label,
  type = "text",
  classes = "",
  input_classes = "",
  placeholder,
  handleChange,
  value,
  autoComplete,
  onBlur,
  disabled = false,
  readonly = false,
  help = false,
}) => (
  <div className={`form-group ${classes}`}>
    {label && <label htmlFor={id}>{label}</label>}
    {readonly ? (
      <p className={` ${input_classes}`}>{value}</p>
    ) : (
      <input
        type={type}
        id={id}
        onChange={handleChange}
        onBlur={onBlur}
        autoComplete={autoComplete === false ? "new-password" : undefined}
        disabled={disabled}
        className={`form-control ${input_classes}`}
        placeholder={placeholder}
        value={value}
      />
    )}
    {help ? (
      <small className={`help form-text ${help.classes}`}>{help.txt}</small>
    ) : null}
  </div>
);

type CheckBoxProps = {
  id: string;
  label: string;
  checked?: boolean;
  classes?: string;
  value?: string;
  input_classes?: string;
  handleChange?: any;
  disabled?: boolean;
  reverted?: boolean;
  help?: string;
};
export const CheckBox: React.FC<CheckBoxProps> = ({
  id,
  label,
  classes = "",
  input_classes = "",
  handleChange,
  value,
  disabled = false,
  checked = false,
  reverted = false,
  help,
}) => {
  let is_checked = false;
  if (reverted && typeof checked === "boolean") {
    is_checked = !checked;
  } else if (reverted && checked === null) {
    is_checked = true;
  } else {
    is_checked = checked;
  }
  return (
    <div className={`form-check ${classes}`}>
      <input
        className={`form-check-input ${input_classes}`}
        data-reverted={reverted}
        type="checkbox"
        value={value || id}
        checked={is_checked}
        onChange={handleChange}
        id={id}
        disabled={disabled}
      />
      <label className="form-check-label" htmlFor={id}>
        {label}
      </label>
      {help ? <small className="form-text opacity_8">{help}</small> : null}
    </div>
  );
};
