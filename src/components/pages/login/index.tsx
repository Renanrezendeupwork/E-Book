import React, { useEffect, useRef, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import { isMobile } from "react-device-detect";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";

import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import { LOGIN_MUTATION, STUDENT_MUTATION } from "./queries";
import { ErrorType } from "../../../models/errors";
import {
  smartRedirect,
  validateEmail,
} from "../../../middleware/common-functions";
import { GoggleSignup } from "../../common/buttons";

const provider = new GoogleAuthProvider();
const auth = getAuth();

const LoginPage: React.FC = () => {
  const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const email = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const history = useHistory();
  const { autologin_token, type, page } = useParams<{
    autologin_token: string;
    type?: string;
    page?: string;
  }>();
  const [error, setError] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [userType, setUserType] = useState<"teacher" | "student">("teacher");
  const password = useRef<HTMLInputElement>(null);
  const [
    login,
    { data: login_data, loading: loading_user, error: loginError },
  ] = useMutation(LOGIN_MUTATION);
  const [
    student_login,
    {
      data: student_login_data,
      loading: loading_student,
      error: loginErrorStudent,
    },
  ] = useMutation(STUDENT_MUTATION);

  useEffect(() => {
    ///login with Firebase on refresh
    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          return;
        }
        const user = result.user;

        //@ts-ignore next-line
        const firebase_token = user.accessToken;
        if (firebase_token) {
          loginFunction(firebase_token);
        } else {
          setError({
            message: "Something went wrong. Please try again.",
          });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setError({
          message: "Something went wrong. Please try again.",
          reason: `${errorMessage} | Code: ${errorCode}`,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const login_error = localStorage.getItem("logoutType");
    const set_user_type =
      location.pathname === "/student_signin" ? "student" : "teacher";
    setUserType(set_user_type);
    if (login_error) {
      setError({
        message: login_error,
      });
    }
    if (autologin_token) {
      autologinHandler();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (loading_student || loading_user) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [loading_student, loading_user]);

  useEffect(() => {
    if (login_data && login_data.login) {
      const user = login_data.login;
      user.type = "teacher";
      user.is_teacher = true;
      if (user.admin === 0) {
        delete user.admin;
      }
      localStorage.setItem("user", JSON.stringify(user));
      const redirect_to = page ? smartRedirect(page) : false;
      if (type) {
        switch (type) {
          case "reset":
            window.location.href = "/editprofile/reset";
            break;
          case "redirect":
            window.location.href = redirect_to ? redirect_to : "/";
            break;

          default:
            window.location.href = "/";
            break;
        }
      } else {
        window.location.href = "/";
      }
    }
  }, [login_data, type, page]);

  useEffect(() => {
    if (loginError) {
      const set_error: ErrorType = {
        message: loginError.graphQLErrors[0].message,
      };
      setError(set_error);
    } else if (loginErrorStudent) {
      const set_error: ErrorType = {
        message: loginErrorStudent.graphQLErrors[0].message,
      };
      setError(set_error);
    }
  }, [loginError, loginErrorStudent]);

  useEffect(() => {
    if (student_login_data && student_login_data.studentLogin) {
      const user = student_login_data.studentLogin;
      const password_val = password.current!.value;
      user.type = "student";
      user.is_teacher = false;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("logoutType");
      if (password_val === "changeme") {
        window.location.href = "/student";
      } else {
        window.location.href = "/";
      }
    }
  }, [student_login_data]);

  const loginHandler = async () => {
    const email_val = email.current!.value;
    const password_val = password.current!.value;
    setError(null);
    if (validateEmail(email_val)) {
      try {
        await login({
          variables: {
            email: email_val,
            pass: password_val,
            timezone: time_zone,
          },
        });
      } catch (error) {
        console.log("index.tsx:53 | error", error);
      }
    } else {
      try {
        await student_login({
          variables: {
            login_code: email_val,
            pass: password_val,
            timezone: time_zone,
          },
        });
      } catch (error) {
        console.log("index.tsx:53 | error", error);
      }
    }
  };

  const autologinHandler = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user.token === autologin_token) {
      const redirect_to = page ? smartRedirect(page) : false;
      window.location.href = redirect_to || "/";
      return;
    } else if (user.token) {
      localStorage.removeItem("user");
    }
    try {
      await login({ variables: { token: autologin_token } });
    } catch (error) {
      history.push({
        pathname: `/signin`,
      });
    }
  };

  const enterPressed = (ev: React.KeyboardEvent): void => {
    var code = ev.keyCode || ev.which;
    if (code === 13) {
      //13 is the enter keycode
      loginHandler();
    }
  };

  const handleGoogleSignup = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        //@ts-ignore next-line
        const firebase_token = user.accessToken;

        if (firebase_token) {
          loginFunction(firebase_token);
        } else {
          setError({
            message: "Something went wrong. Please try again.",
          });
        }
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        setError({
          message: "Something went wrong. Please try again.",
          reason: `${errorMessage} | Code: ${errorCode}`,
        });
      });
  };

  const handleGoogleSignupMob = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    signInWithRedirect(auth, provider);
  };

  const loginFunction = async (firebase_token: string) => {
    if (userType === "teacher") {
      try {
        await login({ variables: { timezone: time_zone, firebase_token } });
      } catch (error) {
        history.push({
          pathname: `/signin`,
        });
      }
    } else {
      try {
        await student_login({
          variables: { timezone: time_zone, firebase_token },
        });
      } catch (error) {
        console.log("index.tsx:53 | error", error);
      }
    }
  };

  return (
    <main className="signin-page">
      <Helmet title={`${userType} Sign-In`} />
      {loading ? <LoaderBar fixed /> : null}
      <div className="container login_div">
        <div className="row justify-content-center form_cont  min-vh-100">
          <div className="col-10 col-sm-5 col-lg-4">
            <div className="row text-center justify-content-center">
              <div className="col-10 col-md-8">
                <img
                  src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
                  className="img-fluid"
                  alt="Flangoo Logo"
                />
              </div>
              <div className="col-12 my-3">
                <h1 className="text-capitalize">{userType} Sign-In</h1>
              </div>
            </div>

            <GoggleSignup
              txt="Login"
              fun={isMobile ? handleGoogleSignupMob : handleGoogleSignup}
            />
            <p className="text-center my-2 text-muted">
              <small>Or</small>
            </p>

            <div className={`form-group ${autologin_token ? "d_none" : ""}`}>
              <label className="text-white">
                {userType === "teacher"
                  ? `Enter email`
                  : "Enter Student Login Code"}
              </label>
              <input
                type="text"
                name="login_data"
                className="form-control"
                id="login_data"
                ref={email}
                placeholder={
                  userType === "teacher"
                    ? `Teacher Email`
                    : "Student Login Code"
                }
                onKeyPress={enterPressed}
              />
            </div>
            <div className={`form-group ${autologin_token ? "d_none" : ""}`}>
              <label className="text-white">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control"
                ref={password}
                placeholder="Password"
                onKeyPress={enterPressed}
              />
            </div>
            {error && !loading_user ? (
              <div className="alert alert-warning">
                <i className="fas fa-exclamation-triangle shake_anim"></i>{" "}
                {error.message}
              </div>
            ) : null}
            <button
              type="button"
              id="login-button"
              className="btn btn-raised btn-danger btn-block btn_xs_lg py-3"
              disabled={loading}
              onClick={loginHandler}
            >
              {loading ? (
                <LoaderDots
                  // size="15"
                  color="#333a40"
                  centered={false}
                  display="p-0"
                />
              ) : (
                "Sign-In"
              )}
            </button>
            {!autologin_token ? (
              <p>
                {userType === "teacher" ? (
                  <small className="d-flex justify-content-around mt-3">
                    <Link to="/forget">Forget Password?</Link> |
                    <Link to="/signup">Sign-Up</Link> |
                    <Link to="/student_signin">Student Sign-in</Link>
                  </small>
                ) : (
                  <small className="d-flex justify-content-around mt-3">
                    <Link to="/signin">Teacher Sign-in</Link>
                  </small>
                )}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
