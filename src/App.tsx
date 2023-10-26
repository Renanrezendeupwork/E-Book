import React, { useState, useEffect, useContext } from "react";
import * as Sentry from "@sentry/react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import { ToastContainer, toast } from "react-toastify";
import ApolloClient from "apollo-boost";

import ScrollToTop from "./middleware/scrollTop";
import { DataContext } from "./context/data-context";
import {
  getToken,
  onMessageListener,
  NotificationPayload,
} from "./middleware/firebase";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./css/font-awesome.css";
import "./css/font-awesome-pro.css";
import "./css/app.css";

////main components
import { Header, Footer } from "./components/layouts/main";

///pages
import { FullPageLoader } from "./middleware/main_loader";
import PWAOfflineStatus from "./components/common/offline";
import LoginPage from "./components/pages/login";
import Library from "./components/pages/library";
import ReaderPage from "./components/pages/readerpage";
import RatePage from "./components/pages/rate";
import Reader from "./components/pages/reader";
import StudentsPage from "./components/pages/students";
import TransferStudents from "./components/pages/transfer_students";
import AddStudent from "./components/pages/addstudents";
import HowStudentSignup from "./components/pages/howstudentsignup";
import GradesPage from "./components/pages/grades";
import Student from "./components/pages/student";
import BooksPage from "./components/pages/books";
import ProfilePage from "./components/pages/profile";
import AssignmentsPage from "./components/pages/assignments";
import EditAssignmentsPage from "./components/pages/new_assignments";
import AnswerKeys from "./components/pages/answerkeys";
import HelpPage from "./components/pages/help";
import EditProfilePage from "./components/pages/editprofile";
import Notifications from "./components/pages/notifications";
import SearchPage from "./components/pages/search_page";
import ForgotPage from "./components/pages/forgot";
import ReferFriend from "./components/pages/referfriend";
import { Helmet } from "react-helmet";
import CancelPlan from "./components/pages/cancelplan";
import StudentsSelfSignup from "./components/pages/students_signup";
import AssignmentPage from "./components/pages/assignment";
import AchievementsPage from "./components/pages/achievements";
import HomePage from "./components/pages/homepage";
import TitlesPage from "./components/pages/titles";
import Nav from "./components/pages/homepage/landing_nav";
import FooterHome from "./components/pages/homepage/footer";
import PricingPage from "./components/pages/pricing";
import ContactPage from "./components/pages/contact";
import FaqsPage from "./components/pages/faqs";
import GeneralPages from "./components/pages/general";
import AboutPage from "./components/pages/about";
import SupportPage from "./components/pages/support";
import TeacherSignup from "./components/pages/signup";
import PromoPage from "./components/pages/promo";
import PromoCodePage from "./components/pages/promocode";
import PurchasePlan from "./components/pages/purchaseplan";
import ThankyouPage from "./components/pages/thankyou";
import Page_404 from "./components/pages/page_404";
import SmartRedirect from "./components/pages/smart_redirect";
import SettingsPage from "./components/pages/settings";
import { UserSettings } from "./models/user";

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [isTokenFound, setTokenFound] = useState(false);
  const [notification, setNotification] = useState<NotificationPayload>(
    {} as NotificationPayload
  );
  const dataContext = useContext(DataContext);
  const graph_url = process.env.REACT_APP_GRAPH_URL;
  const user = dataContext.user;
  const api = new ApolloClient({
    uri: graph_url,
    request: (operation) => {
      if (user && user.token) {
        operation.setContext({
          headers: {
            authorization: user.token ? `Bearer ${user.token}` : "",
            version: process.env.REACT_APP_BUILD_VERSION || false,
            type: user.is_teacher ? "teacher" : "student",
          },
        });
      }
    },
    onError: (q_error) => {
      if (q_error.graphQLErrors) {
        const e_message = q_error.graphQLErrors[0].message;
        if (!e_message) return;
        if (e_message === "NOLOGGEDUSER") {
          localStorage.clear();
          setTimeout(() => {
            window.location.reload();
          }, 500);
        } else if (e_message === "FORCERELOAD") {
          window.location.reload();
        } else if (
          e_message === "INACTIVE" &&
          window.location.pathname !== "/youraccount" &&
          window.location.pathname !== "/sign_out" &&
          window.location.pathname !== "/purchaseplan"
        ) {
          if (user && user.is_teacher) {
            window.location.href = "/youraccount";
          } else if (user && !user.is_teacher) {
            localStorage.clear();
            localStorage.setItem(
              "logoutType",
              "Your Teacher's Membership to Flangoo is Inactive"
            );
            setTimeout(() => {
              window.location.href = "/student_signin";
            }, 500);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (notification.show) {
      switch (notification.type) {
        case "danger":
          toast.error(notification.title);
          break;
        case "success":
          toast.success(notification.title);
          break;
        case "warning":
          toast.warn(notification.title);
          break;
        case "info":
          toast.info(notification.title);
          break;
        default:
          toast(notification.title);
          break;
      }
    }
  }, [notification]);
  useEffect(() => {
    if (user && user.token && !isAuth) {
      setIsAuth(true);
      if ("Notification" in window) {
        getToken(setTokenFound, user.token);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);
  useEffect(() => {
    if (isTokenFound) {
      ////save token to DB
      console.log("App.tsx:71 | isTokenFound", isTokenFound);
    }
  }, [isTokenFound]);

  if ("Notification" in window) {
    onMessageListener()
      .then((payload: any) => {
        const notification_data: NotificationPayload = payload.notification;
        setNotification({
          show: true,
          title: notification_data.title,
          body: notification_data.body,
          type: notification_data.type,
          icon: notification_data.icon,
        });
        console.log(payload);
      })
      .catch((err) => console.log("failed: ", err));
  }

  const logoutFun = () => {
    dataContext.removeData();
    return <div className=""></div>;
  };

  const validateSettings = (
    priv: keyof UserSettings,
    reverted: boolean = false,
    type: "student" | "teacher" = "student"
  ): boolean => {
    if (type === "student") {
      if (user && !user.is_teacher) {
        if (reverted) {
          return (
            user.settings[priv] !== true || user.settings[priv] === undefined
          );
        } else {
          return (
            user.settings[priv] === true || user.settings[priv] === undefined
          );
        }
      }
    }

    return true;
  };

  const layout = () => {
    if (isAuth === false) {
      return (
        <div className={`front_pages `}>
          <Nav />
          <Switch>
            <Route
              path="/signin/:autologin_token?/:type?/:page?"
              component={LoginPage}
            />
            <Route
              path="/stduent_signin/:autologin_token?/:type?/:page?"
              component={LoginPage}
            />
            <Route
              path="/student_signin/:autologin_token?/:type?/:page?"
              component={LoginPage}
            />
            <Route
              path="/studentsignup/:token?/:group_id?"
              component={StudentsSelfSignup}
            />
            <Route
              path="/student_signin/:token?/:group_id?"
              component={StudentsSelfSignup}
            />
            <Route path="/forget" component={ForgotPage} />
            <Route path="/signup" component={TeacherSignup} />
            <Route
              path={["/promo", "/invite/:wholesaler_code?"]}
              component={PromoPage}
            />
            <Route path="/titles" component={TitlesPage} />
            <Route path="/home/titles" component={TitlesPage} />
            <Route path="/pricing" component={PricingPage} />
            <Route
              path={[
                "/home/invitation/:promocode?",
                "/invitation/:promocode?",
                "/home/inviteonly/:promocode?",
                "/inviteonly/:promocode?",
              ]}
              component={PromoCodePage}
            />
            <Route path="/home/pricing" component={PricingPage} />
            <Route path="/contact" component={ContactPage} />
            <Route path="/home/contact" component={ContactPage} />
            <Route path="/faq" component={FaqsPage} />
            <Route path="/general/faq" component={FaqsPage} />
            <Route path="/about" component={AboutPage} />
            <Route path="/support" component={SupportPage} />
            <Route path="/general/support" component={SupportPage} />
            <Route path="/home/about" component={AboutPage} />

            <Route path="/general/:setting_name" component={GeneralPages} />
            <Route path="/" exact component={HomePage} />
            <Route component={SmartRedirect} />
          </Switch>
          <FooterHome />
        </div>
      );
    } else if (isAuth) {
      return (
        <React.Fragment>
          <ToastContainer />
          <Header />
          <Switch>
            <Route
              path="/signin/:autologin_token?/:type?/:page?"
              component={LoginPage}
            />
            <Route
              path="/bookdetails/:reader_url/:reader_id"
              component={ReaderPage}
            />
            <Route path="/contact" component={ContactPage} />
            <Route path="/rate/:reader_name/:reader_id" component={RatePage} />
            <Route path="/support" component={SupportPage} />
            <Route path="/general/support" component={SupportPage} />
            <Route path="/general/:setting_name" component={GeneralPages} />
            <Route
              path="/reader/:reader_name/:reader_id/:page?"
              component={Reader}
            />
            <Route path="/faq" component={FaqsPage} />
            <Route path="/general/faq" component={FaqsPage} />
            <Route path="/notifications" component={Notifications} />
            <Route
              path="/books/:group_id?/:language_id?"
              component={BooksPage}
            />
            <Route path="/help" component={HelpPage} />
            <Route
              path="/editprofile/:reset_password?"
              component={EditProfilePage}
            />
            <Route path="/assignments/:group_id?" component={AssignmentsPage} />
            <Route
              path="/achievements/:class_id?"
              component={
                validateSettings("hide_achievements", true)
                  ? AchievementsPage
                  : Page_404
              }
            />
            <Route path="/search/:search_string?" component={SearchPage} />
            <Route path="/sign_out" render={logoutFun} />
            <Route exact path="/library/:lang_name" component={Library} />
            <Redirect from="/index.php" to="/" />
            <Route exact path="/" component={Library} />
            <Route exact path="/settings/:section?" component={SettingsPage} />
            {user && user.is_teacher ? (
              <>
                <Route path="/students/:class_id?" component={StudentsPage} />
                <Route path="/transferstudents" component={TransferStudents} />
                <Route
                  path="/grades/:class_id?/:book_id?"
                  component={GradesPage}
                />
                <Route path="/refer_friend" component={ReferFriend} />
                <Route path="/addstudents/:class_id?" component={AddStudent} />
                <Route path="/howstudentsignup" component={HowStudentSignup} />
                <Route
                  path="/student/:student_id?/:section?/:id?"
                  component={Student}
                />
                <Route path="/youraccount" component={ProfilePage} />
                <Route path="/cancelplan" component={CancelPlan} />
                <Route path="/answerkeys" component={AnswerKeys} />
                <Route path="/purchaseplan" component={PurchasePlan} />
                <Route path="/thankyou" component={ThankyouPage} />

                <Route
                  path="/assignment/:class_id/:assignment_id"
                  component={AssignmentPage}
                />
                <Route
                  path="/new_assignment/:class_id?"
                  component={EditAssignmentsPage}
                />
                <Route
                  path="/edit_assignment/:class_id?/:assignment_id?"
                  component={EditAssignmentsPage}
                />
              </>
            ) : (
              <Route path="/student" exact component={Student} />
            )}
            <Route component={Page_404} />
          </Switch>
          <Footer />
          {!user || user.is_teacher ? (
            <Helmet>
              {/* <!-- Start of LiveChat (www.livechatinc.com) code -->  */}
              <script src={process.env.PUBLIC_URL + "/live_chat.js"} />{" "}
            </Helmet>
          ) : null}
        </React.Fragment>
      );
    } else {
      return <div className="">error</div>;
    }
  };
  return (
    <BrowserRouter>
      <ScrollToTop>
        {
          // @ts-ignore
          <ApolloProvider client={api}>
            {dataContext.loaded ? (
              <div
                className={
                  user ? user.settings.theme + " theme_panel" : "theme_panel"
                }
              >
                {layout()}
              </div>
            ) : (
              <Route path="/:page?" component={FullPageLoader} />
            )}
          </ApolloProvider>
        }
      </ScrollToTop>
      <PWAOfflineStatus />
    </BrowserRouter>
  );
};

export default Sentry.withProfiler(App);
