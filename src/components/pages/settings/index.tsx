import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router";
import { useQuery, useMutation } from "@apollo/client";

import { getUserImage } from "../../../middleware/common-functions";
import { UserItem, UserSettings } from "../../../models/user";
import settingsNav from "./settings.json";
import SideNav from "./sidenav";
import Profile from "./profile";
import Email from "./emails";
import Appearance from "./appearance";
import Passwords from "./passwords";
import Student from "./students";
import GradesQuizzes from "./gradesquizzes";
import { SETPREFF } from "../profile/queries";
import { GET_USER } from "./queries";
import { DataContext } from "../../../context/data-context";

const SettingsPage: React.FC = () => {
  const dataContext = useContext(DataContext);
  const history = useHistory();
  const location = useLocation();
  const { section = "profile" } = useParams<{ section: string }>();
  const set_user = dataContext.user as UserItem;
  const local_settings = set_user.settings as UserSettings;
  const [settings, setSettings] = useState(local_settings as UserSettings);
  const [activeSection, setActiveSection] = useState(section);
  const [user, setUser] = useState<UserItem>({
    ...set_user,
  });
  const { data: user_data, called: user_data_called } = useQuery<{
    user: UserItem;
    getSettings: UserSettings;
  }>(GET_USER, {
    fetchPolicy: "no-cache",
    skip: !set_user.is_teacher,
  });
  const [setPreff] = useMutation(SETPREFF);

  const profile_pic = user.profile_pic
    ? getUserImage(user.profile_pic)
    : "https://cdn.flangoo.com/assets/global/thumb1.png";

  useEffect(() => {
    if (!set_user.is_teacher) {
      window.location.href = "/student";
    }
    if (user_data && !user_data_called) {
      localStorage.setItem(
        "user",
        JSON.stringify({ ...set_user, ...user_data.user })
      );
      setUser({ ...set_user, ...user_data.user });
      localStorage.setItem(
        "settings",
        JSON.stringify({ ...local_settings, ...user_data.getSettings })
      );
      setSettings({ ...local_settings, ...user_data.getSettings });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user_data, user_data_called]);

  useEffect(() => {
    const path = location.pathname;
    const sections = path.split("/");
    const section = sections[sections.length - 1];
    setActiveSection(section);
  }, [location]);

  useEffect(() => {
    if (settings) {
      console.log("Running effect");
      dataContext.setSettings(settings);
    }
    // eslint-disable-next-line
  }, [settings]);

  const handleActiveSection = (section: string) => {
    let url = section.toLocaleLowerCase();
    ///update url with section name using history
    history.push(`/settings/${url}`);
  };

  const handleUpdateSetting = (setting: keyof UserSettings, value: any) => {
    setSettings({ ...settings, [setting]: value });
    ///run mutation to update settings
    setPreff({
      variables: {
        pref_value: value.toString(),
        pref_key: setting,
        is_global: true,
      },
    });
  };

  const renderSection = () => {
    switch (activeSection) {
      case "profile":
        return <Profile userData={user} profile_pic={profile_pic} />;
      case "emails":
        return <Email userData={user} />;
      case "students":
        return (
          <Student settings={settings} setSettings={handleUpdateSetting} />
        );
      case "gradesquizzes":
        return (
          <GradesQuizzes
            settings={settings}
            setSettings={handleUpdateSetting}
          />
        );
      case "security":
        return <Passwords userData={user} />;
      case "appearance":
        return <Appearance setSettings={handleUpdateSetting} />;
      default:
        return <Profile userData={user} profile_pic={profile_pic} />;
    }
  };

  return (
    <main className="settings_page">
      <div className="container-fluid first-container last-container">
        {" "}
        <h1>Settings</h1>
        <div className="row">
          <div className="col-md-3 mb-4 mb-md-0">
            <div className="row">
              <div className="col col-md-12 order-md-2">
                <SideNav
                  active={activeSection}
                  settings={settingsNav}
                  handleActiveSection={handleActiveSection}
                />
              </div>
              <div className="col-7 col-md-12 order-md-1">
                <UserBlock user={user} profile_pic={profile_pic} />
              </div>
            </div>
          </div>
          <div className="col">{renderSection()}</div>
        </div>
      </div>
    </main>
  );
};

const UserBlock: React.FC<{ user: UserItem; profile_pic: string }> = ({
  user,
  profile_pic,
}) => {
  return (
    <div className="user_data">
      <img src={profile_pic} alt="User Profile" className="img-fluid" />
      <div>
        <h5>{user.name}</h5>
        <p>Your teacher account</p>
      </div>
    </div>
  );
};

export default SettingsPage;
