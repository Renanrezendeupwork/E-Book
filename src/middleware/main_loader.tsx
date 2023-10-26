import React, { useEffect, useContext, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import BarLoader from "react-spinners/BarLoader";
import ClipLoader from "react-spinners/ClipLoader";
import SyncLoader from "react-spinners/SyncLoader";

import { GET_PLANS, INITIAL_FETCH } from "./queries";
import tips_file from "../data/tips.json";
import { DataContext } from "../context/data-context";
import { UserItem, UserSettings } from "../models/user";
import { smartRedirect, useQueryParams } from "./common-functions";
import {
  LOGIN_MUTATION,
  STUDENT_MUTATION,
} from "../components/pages/login/queries";
import { CatItem, ReaderItem } from "../models/reader";
import { LangItem } from "../models/lang";

interface LoaderOptions {
  show?: boolean;
}

type TipType = {
  txt: string;
  type: TipTypes;
};

type TipTypes = "student" | "teacher" | "general";

export const FullPageLoader: React.FC<LoaderOptions> = ({ show = true }) => {
  const { page } = useParams<{ page?: string }>();
  const params = useQueryParams(window.location);
  const autologin_token = params.get("t");
  const user_type = params.get("type");
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const tips = tips_file as TipType[];
  const dataContext = useContext(DataContext);
  const [tip, setTip] = useState<TipType | false>(false);
  const history = useHistory();
  const [login, { data: login_data, called: login_called, error: loginError }] =
    useMutation(LOGIN_MUTATION);
  const [
    student_login,
    { data: student_login_data, error: loginErrorStudent },
  ] = useMutation(STUDENT_MUTATION);

  const [getAllData, { data: db_data, error: query_error }] = useLazyQuery<{
    categories: CatItem[];
    books: ReaderItem[];
    languages: LangItem[];
    getSettings: UserSettings;
  }>(INITIAL_FETCH);
  const [getPlans, { data: plans_data }] = useLazyQuery(GET_PLANS);
  const local_settings: UserSettings = JSON.parse(
    localStorage.getItem("settings") || "{}"
  );
  useEffect(() => {
    if (user.id && !autologin_token) {
      getAllData({
        variables: {
          lang_id: user.lang_id,
          class_id: user?.class_id || null,
          active: true,
        },
      });
    } else {
      if (autologin_token) {
        if (!login_called) {
          debugger;
          autologinHandler();
        }
      } else {
        getPlans();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const login_error = query_error || loginError || loginErrorStudent;
    if (login_error !== undefined && login_error) {
      if (login_error.graphQLErrors) {
        const e_message = login_error.graphQLErrors[0].message;
        if (!e_message) {
          localStorage.clear();
          return;
        }
        if (e_message !== "INACTIVE") {
          localStorage.clear();
        } else {
          dataContext.setLoaded(true);
        }
      } else {
        localStorage.clear();
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginError, loginErrorStudent, query_error]);

  useEffect(() => {
    let tip_type: TipTypes = "general";
    if (user.token) {
      tip_type = user.is_teacher ? "teacher" : "student";
    }
    const filter_tips = tips.filter(
      (t) => t.type === tip_type || t.type === "general"
    );
    const random = Math.floor(Math.random() * filter_tips.length);
    const set_tip = filter_tips.find((t, k) => {
      return k === random;
    });
    if (set_tip && tip === false) {
      setTip(set_tip);
    }
  }, [user, tips, tip]);

  useEffect(() => {
    if (plans_data) {
      localStorage.setItem("plans_data", JSON.stringify(plans_data.plans));
      dataContext.setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plans_data]);

  useEffect(() => {
    if (db_data) {
      localStorage.setItem(
        "local_languages",
        JSON.stringify(db_data.languages)
      );
      localStorage.setItem("settings", JSON.stringify(db_data.getSettings));

      const order_readers = db_data.books.sort(
        (a: ReaderItem, b: ReaderItem) => {
          // Sort by is_new (if exists)
          if (a.is_new && !b.is_new) {
            return -1;
          } else if (!a.is_new && b.is_new) {
            return 1;
          }
          // Sort by coming_soon
          if (a.coming_soon && !b.coming_soon) {
            return -1;
          } else if (!a.coming_soon && b.coming_soon) {
            return 1;
          }
          // Sort by rank
          return a.rank > b.rank ? 1 : -1;
        }
      );
      localStorage.setItem("local_readers", JSON.stringify(order_readers));
      ///remove empty categories
      const local_categories = db_data.categories.filter((cat) => {
        return order_readers.find(
          (reader) =>
            !reader.coming_soon &&
            (reader.level.id === cat.id ||
              reader.categories.find((c) => c.id === cat.id))
        );
      });
      localStorage.setItem(
        "local_categories",
        JSON.stringify(local_categories)
      );
      dataContext.setSettings(db_data.getSettings);
      dataContext.setLoaded(true);
      const url = window.location.href;
      if (url.search("library") >= 0) {
        history.push({
          pathname: `/`,
        });
      } else {
        const redirect_to = page ? smartRedirect(page) : false;
        if (redirect_to) {
          history.push({
            pathname: redirect_to,
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_data]);

  useEffect(() => {
    if (login_data && login_data.login) {
      const set_user = login_data.login;
      set_user.type = "teacher";
      set_user.is_teacher = true;
      console.log(set_user);

      localStorage.setItem("user", JSON.stringify(set_user));
      dataContext.setUser(set_user);
      getAllData({
        variables: {
          lang_id: set_user.lang_id,
          class_id: set_user?.class_id || null,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [login_data]);

  useEffect(() => {
    if (student_login_data && student_login_data.studentLogin) {
      debugger;
      const user = student_login_data.studentLogin;
      user.type = "student";
      user.is_teacher = false;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("logoutType");
    }
  }, [student_login_data]);

  const autologinHandler = async () => {
    if (autologin_token === "signin") {
      dataContext.setLoaded(true);
      return;
    }
    if (user.token === autologin_token) {
      const redirect_to = page ? smartRedirect(page) : false;
      if (redirect_to) {
        history.push({
          pathname: page ? redirect_to : "/",
        });
        dataContext.setLoaded(true);
      }
      return;
    } else if (user.token) {
      localStorage.removeItem("user");
    }
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    try {
      if (user_type && user_type === "student") {
        ////student login
        await student_login({
          variables: { token: autologin_token, timezone: time_zone },
        });
      } else {
        await login({
          variables: { token: autologin_token, timezone: time_zone },
        });
      }
    } catch (error) {
      console.log("index.tsx:53 | error", error);
    }
  };
  return (
    <main className={(local_settings.theme ? local_settings.theme + " " : "") + "full_page_loader"}>
      <img
        src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
        alt="Flangoo Logo"
      />
      <p>{tip ? tip.txt : "..."}</p>
      <BarLoader color={"#fff"} loading={show} />
    </main>
  );
};

type LoaderDotsProps = {
  size?: number;
  standAlone?: boolean;
  full?: boolean;
};
export const LoaderDots: React.FC<LoaderDotsProps> = ({
  size = 50,
  full = false,
  standAlone,
}) => {
  if (standAlone) {
    return (
      <main className="first-container">
        <div className="container text-center my-4">
          <SyncLoader size={size} color={"#bdbdbd"} />
        </div>
      </main>
    );
  }
  return <SyncLoader size={size} color={"#bdbdbd"} />;
};

type LoaderSpinProps = {
  size?: number;
  standAlone?: boolean;
  full?: boolean;
  align?: "center" | "left" | "right";
};
export const LoaderSpin: React.FC<LoaderSpinProps> = ({
  size = 50,
  full = false,
  standAlone,
  align = "center",
}) => {
  if (standAlone) {
    return (
      <main className="first-container">
        <div className="container text-center my-4">
          <ClipLoader size={size} color={"#bdbdbd"} />
        </div>
      </main>
    );
  }
  if (full) {
    return (
      <div className={`loader_full ${align}`}>
        <ClipLoader size={size} color={"#bdbdbd"} />
      </div>
    );
  }
  return <ClipLoader size={size} color={"#bdbdbd"} />;
};
