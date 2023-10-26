import React from "react";
import { SettingPage } from "../../../models/pageSettings";

type SideNavProps = {
  active: string;
  settings: SettingPage[];
  handleActiveSection: (section: string) => void;
};
const SideNav: React.FC<SideNavProps> = ({
  active,
  settings,
  handleActiveSection,
}) => {
  return (
    <div className="list-group transparent">
      {settings.map((setting) => (
        <button
          type="button"
          onClick={() => handleActiveSection(setting.id)}
          aria-current="true"
          key={setting.id}
          className={`btn-sm list-group-item list-group-item-action py-2 py-md-1 ${
            setting.id === active ? "active" : ""
          } `}
        >
          <i className={`${setting.icon} fa-fw mr-2`}></i>
          {renderName(setting.name)}
        </button>
      ))}
    </div>
  );
};

function renderName(string: string) {
  ///split string into array and the rest of the string
  const [first] = string.split(" ");
  return (
    <span>
      <span className="d-md-none">{first}</span>
      <span className="xs_hidden">{string}</span>
    </span>
  );
}

export default SideNav;
