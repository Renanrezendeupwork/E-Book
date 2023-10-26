import React, { useState } from "react";
import { UserItem, UserSettings } from "../models/user";
import { getAuth, signOut } from "firebase/auth";

import axios from "../middleware/axios_gql";

type DataProps = {
  loaded: boolean;
  lang_id: string;
  setLoaded: any;
  setLang: any;
  user: UserItem | false;
  setUser: any;
  setSettings: any;
  removeData: any;
};

type LogoutType = false | "kickout" | "inactive_teacher";

export const DataContext = React.createContext<Partial<DataProps>>({
  loaded: false,
  lang_id: "1",
  user: false,
  setUser: (user: UserItem) => {},
  setSettings: (settings: UserSettings) => {},
  setLoaded: (loaded: boolean) => {},
  setLang: (lang: string) => {},
  removeData: (type: LogoutType = false) => {},
});

const DataContextProvider: React.FC = ({ children }) => {
  const local_user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [is_loaded, setLoaded] = useState(false);
  const [user, setUser] = useState<UserItem | false>(
    local_user.token ? local_user : false
  );
  const [lang_id, setLang_id] = useState(local_user.lang_id || "1");
  const setLoadedHandler = (set_loaded = "email") => {
    setLoaded(Boolean(set_loaded));
  };

  const setUserHandler = (set_user: UserItem) => {
    setUser(set_user);
  };
  const setSettingsHandler = (settings: UserSettings) => {
    if (!user) {
      return;
    }
    const set_user = { ...user };
    set_user.settings = settings;
    setUser(set_user);
  };

  const setLangHandler = (get_lang_id: string = "1") => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    user.lang_id = get_lang_id;
    localStorage.setItem("user", JSON.stringify(user));
    setTimeout(() => {
      setLang_id(get_lang_id);
    }, 500);
  };

  const removeDataHandler = async (type: LogoutType = false) => {
    const firebaseToken = localStorage.getItem("ntt");
    if (firebaseToken) {
      await removeUserFcmToken(firebaseToken);
    }
    localStorage.clear();
    try {
      const auth = getAuth();
      signOut(auth);
    } catch (error) {
      console.log("data-context.tsx:64 | error", error);
      debugger;
    }

    if (type) {
      switch (type) {
        case "kickout":
          localStorage.setItem(
            "logoutType",
            "Your session has expired or you logged into your account on another device. Please sign in again"
          );
          break;
        case "inactive_teacher":
          localStorage.setItem(
            "logoutType",
            "Your Teacher's Membership to Flangoo is Inactive"
          );
          break;
      }
    }

    window.location.href = "/";
  };
  const removeUserFcmToken = async (token: string) => {
    const data = {
      query: "mutation removeFcm($token: String!){\nlogout(token:$token)\n}",
      variables: { token: token },
      operationName: "removeFcm",
    };
    try {
      await axios.post("", data);
      return true;
    } catch (error) {
      console.log("firebase.ts:72 | error ", error);
      return false;
    }
  };
  return (
    <DataContext.Provider
      value={{
        loaded: is_loaded,
        lang_id,
        setLoaded: setLoadedHandler,
        setLang: setLangHandler,
        user: user,
        removeData: removeDataHandler,
        setUser: setUserHandler,
        setSettings: setSettingsHandler,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataContextProvider;
