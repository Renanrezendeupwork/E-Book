import React from "react";
import { CheckBox } from "../../common/inputs";
import { UserSettings } from "../../../models/user";

type GradesQuizzesProps = {
  settings: UserSettings;
  setSettings: any;
};
const GradesQuizzes: React.FC<GradesQuizzesProps> = ({
  settings,
  setSettings,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.target.id as keyof UserSettings;
    let value = e.target.checked;
    const reverted = e.target.getAttribute("data-reverted");
    if (reverted === "true") {
      value = !value;
    }
    setSettings(setting, value);
  };
  return (
    <div className="setting_panel">
      <h4>Grades & Quizzes Preferences</h4>
      <div className="row">
        <div className="col-md-7 text-white">
          <CheckBox
            label="Show auto-graded quizzes to students"
            id="hide_quizzes"
            handleChange={handleChange}
            checked={settings.hide_quizzes}
            reverted
            classes="mb-3"
            help="This option enables you to choose whether to show or hide auto-graded quizzes from your students. If you disable this option, students will no longer be able to view auto-graded quizzes in books. Please note that this setting applies to all your groups."
          />
          <CheckBox
            label="Automatically Allow Retakes"
            id="allow_retakes"
            handleChange={handleChange}
            checked={settings.allow_retakes}
            classes="mb-3"
            help="This option enables your students to start a retake automatically without requiring manual approval from you. Please note that this setting applies to all your groups."
          />
        </div>
      </div>
    </div>
  );
};

export default GradesQuizzes;
