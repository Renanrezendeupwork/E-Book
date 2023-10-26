import React from "react";
import { UserSettings } from "../../../models/user";
import { CheckBox } from "../../common/inputs";

type StudentsProps = {
  settings: UserSettings;
  setSettings: any;
};
const Students: React.FC<StudentsProps> = ({ settings, setSettings }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.target.id as keyof UserSettings;
    let value = e.target.checked;
    const reverted = e.target.getAttribute("data-reverted");
    if (reverted) {
      value = !value;
    }
    setSettings(setting, value);
  };
  return (
    <div className="setting_panel">
      <h4>Students Preferences</h4>
      <div className="row">
        <div className="col-md-7 text-white">
          <CheckBox
            handleChange={handleChange}
            label="Show achievements to students"
            id="hide_achievements"
            reverted={true}
            checked={settings.hide_achievements}
            classes="mb-3"
            help="If you disable this option, students will no longer have access to view their own or their classmates' achievements, but their progress will still be tracked."
          />
          <CheckBox
            handleChange={handleChange}
            label="Allow students to change their own passwords"
            id="block_password_change"
            checked={settings.block_password_change}
            reverted
            classes="mb-3"
            help="If you disable this option, students will be unable to change their passwords. The password they entered for the first time or the one set up by you will be the only one used."
          />
        </div>
      </div>
    </div>
  );
};

export default Students;
