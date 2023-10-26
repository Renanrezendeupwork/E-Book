import React, { useEffect, useState } from "react";
import { useQuery, useMutation } from "@apollo/client";

import { CheckBox } from "../../common/inputs";
import { NotiSettings } from "../../../models/user";
import { GET_NOTI_SETTINGS, SETNOTIFPREFF } from "./queries";

const Notifications: React.FC = () => {
  const [settings, setSettings] = useState({} as NotiSettings);
  const { data: user_data, loading } = useQuery<{
    getNotiSettings: NotiSettings;
  }>(GET_NOTI_SETTINGS, {
    fetchPolicy: "no-cache",
  });

  const [setNotiPreff] = useMutation(SETNOTIFPREFF);

  useEffect(() => {
    if (user_data) {
      setSettings({ ...user_data.getNotiSettings });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const setting = e.target.id as keyof NotiSettings;
    let value = e.target.checked;
    const reverted = e.target.getAttribute("data-reverted");
    if (reverted === "true") {
      value = !value;
    }
    updateNotification(setting, value);
  };
  const updateNotification = (setting: keyof NotiSettings, value: any) => {
    setSettings({ ...settings, [setting]: value });
    ///run mutation to update settings
    setNotiPreff({
      variables: { pref_value: value.toString(), pref_key: setting },
    });
  };
  return (
    <div className="text-white">
      <h4>Email preferences</h4>
      <CheckBox
        label="Retake requests"
        id="retakes"
        disabled={loading}
        handleChange={handleChange}
        checked={settings.retakes === undefined ? true : settings.retakes}
        classes="mb-3"
        help="Enable email notifications for student retake requests on book pages."
      />
      <CheckBox
        label="New Achievement"
        id="achievements"
        disabled={loading}
        handleChange={handleChange}
        checked={
          settings.achievements === undefined ? true : settings.achievements
        }
        classes="mb-3"
        help="Enable email notifications for unlocked achievements."
      />
      {/* <CheckBox
        label="New Book Releases"
        id="new_books"
        disabled={loading}
        handleChange={handleChange}
        checked={settings.new_books === undefined ? true : settings.new_books}
        classes="mb-3"
        help="Get an email notification every time we release a new book."
      /> */}
    </div>
  );
};

export default Notifications;
