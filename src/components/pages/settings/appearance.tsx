import React from "react";
import { UserItem } from "../../../models/user";
import { Themes } from "../../../models/pageSettings";

type AppearanceProps = {
  setSettings: any;
};
const Appearance: React.FC<AppearanceProps> = ({ setSettings }) => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const handleChange = (theme_id: Themes) => {
    setSettings("theme", theme_id);
  };

  return (
    <div className="setting_panel">
      <h4>Theme preferences</h4>
      <p>
        Choose how Flangoo looks to you.
        {user.is_teacher ? (
          <span>
            {" "}
            The theme you select will be applied to you and not to your
            students.
          </span>
        ) : null}
      </p>
      <div className="themes_cont">
        <ThemeBox
          theme="dark_theme"
          text="Dark Theme"
          handleChange={handleChange}
        />
        <ThemeBox
          theme="green_theme"
          text="Green Theme"
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};
type ThemeBoxProps = {
  theme: Themes;
  text: string;
  handleChange: any;
};
const ThemeBox: React.FC<ThemeBoxProps> = ({ theme, text, handleChange }) => (
  <div
    className="theme_item"
    onClick={() => {
      handleChange(theme);
    }}
  >
    <div className={`theme_box ${theme}`}>
      <div className="nav"></div>
      <div className="body"></div>
      <div className="footer"></div>
    </div>
    <small>{text}</small>
  </div>
);

export default Appearance;
