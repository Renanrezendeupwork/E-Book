import React, { useState, useEffect, useRef, useContext } from "react";
import { isMobile } from "react-device-detect";
import ReCAPTCHA from "react-google-recaptcha";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  getRedirectResult,
  signInWithRedirect,
} from "firebase/auth";

import { SIGNUPMUTATION } from "../signup/queries";
import { ErrorType } from "../../../models/errors";
import {
  validateEmail,
  validatePassword,
} from "../../../middleware/common-functions";
import { useMutation } from "@apollo/client";
import { FormGroup } from "../../common/inputs";
import { GoggleSignup } from "../../common/buttons";
import { AnalyticsContext } from "../../../context/analytics-context";

const auth = getAuth();

type SignupFormProps = {
  button_txt?: string;
  referral?: boolean;
  promocode?: boolean | string;
};

type NewUser = {
  email: string;
  password?: string;
  firebase_id?: string;
  firebase_token?: string;
  name: string;
};
const SignupForm: React.FC<SignupFormProps> = ({
  button_txt,
  referral,
  promocode,
}) => {
  const [error, setError] = useState<ErrorType | null>(null);
  const analyticsContext = useContext(AnalyticsContext);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [signupMutation, { data: signup_data, loading }] =
    useMutation(SIGNUPMUTATION);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    promocode:
      promocode === true || promocode === false ? "" : promocode?.toString(),
    how: "",
    langs: [] as string[],
  });

  useEffect(() => {
    ///login with Firebase on refresh
    getRedirectResult(auth)
      .then((result) => {
        if (!result) {
          return;
        }
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          setError({
            message: "Something went wrong. Please try again.",
          });
          return;
        }
        // The signed-in user info.
        const new_user: NewUser = {
          firebase_id: result.user.uid,
          email: result.user.email!,
          name: result.user.displayName!,
          firebase_token: credential.accessToken,
        };
        signupFunction(new_user);
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
    if (signup_data && signup_data.teacherSignup) {
      const user = signup_data.teacherSignup;
      user.type = "teacher";
      user.is_teacher = true;
      if (user.admin === 0) {
        delete user.admin;
      }
      localStorage.setItem("user", JSON.stringify(user));
      ///save event to google analytics
      const event = {
        category: "User",
        action: "Account",
        label: `Create`,
        value: 1,
      };
      analyticsContext.event(event);
      window.location.href = "/thankyou";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signup_data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const type = e.target.id;
    const value = e.target.value;
    const set_form = { ...form, [type]: value };
    setForm(set_form);
  };

  const onChangeCaptcha = (value: any) => {
    console.log("signupForm.tsx:63 | value", value);
  };

  const handleGoogleSignup = async (
    e: React.ChangeEvent<HTMLButtonElement>
  ) => {
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (!credential) {
          setError({
            message: "Something went wrong. Please try again.",
          });
          return;
        }

        // The signed-in user info.
        const new_user: NewUser = {
          firebase_id: result.user.uid,
          email: result.user.email!,
          name: result.user.displayName!,
          firebase_token: credential.accessToken,
        };
        signupFunction(new_user);
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
    const provider = new GoogleAuthProvider();

    signInWithRedirect(auth, provider);
  };

  const triggerCaptcha = async (): Promise<false | string> => {
    if (!recaptchaRef || !recaptchaRef.current) {
      return false;
    }
    try {
      const token = await recaptchaRef.current.executeAsync();
      recaptchaRef.current.reset();
      return token || false;
    } catch (e) {
      console.log("signupForm.tsx:85 | error", e);
      return false;
    }
  };

  const signupFunction = async (new_user: NewUser) => {
    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const captcha_token =
      process.env.REACT_APP_PROD === "true"
        ? await triggerCaptcha()
        : "NOTOKEN";
    if (!captcha_token) {
      setError({
        message: "Something went wrong. Please try again.",
      });
      return;
    }

    try {
      const utm_source = getCookie("utm_source");
      const wholesaler_code = getCookie("wholesaler_code");
      await signupMutation({
        variables: {
          token: captcha_token,
          utm_source: utm_source,
          wholesaler: wholesaler_code || "",
          promocode: form.promocode || "",
          user: {
            email: new_user.email,
            firebase_id: new_user.firebase_id,
            firebase_token: new_user.firebase_token,
            password: new_user.password,
            name: new_user.name,
            timezone: time_zone,
          },
        },
      });
      try {
        //@ts-ignore next-line
        fbq("trackCustom", "Completed Registration");
      } catch (error) {
        console.log("signupForm.tsx:156 | error", error);
      }
      document.cookie =
        "utm_source=; wholesaler_code=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } catch (error: unknown) {
      console.log("index.tsx:53 | error", error);
      // @ts-ignore next-line
      if (error.graphQLErrors[0].message) {
        setError({
          // @ts-ignore next-line
          message: error.graphQLErrors[0].message,
        });
      }
    }
  };
  const signupHandler = async () => {
    const email_val = form.email;
    const password_val = form.password;
    const user_name = form.name;
    if (user_name.length < 4) {
      setError({
        message: "Please add your Full Name (At least 4 characters) ",
      });
      return;
    }
    if (!validateEmail(email_val)) {
      setError({ message: "Please add a valid email address" });
      return;
    }
    if (!validatePassword(password_val)) {
      setError({
        message:
          password_val.length === 0
            ? "Password is required"
            : "Password must be at least 6 characters",
      });
      return;
    }
    setError(null);
    const new_user: NewUser = {
      password: password_val,
      email: email_val!,
      name: user_name,
    };
    signupFunction(new_user);
  };

  return (
    <>
      {promocode ? (
        <>
          <FormGroup
            handleChange={handleChange}
            label="Invitation Code"
            value={form.promocode || ""}
            type="text"
            id="promocode"
          />
          <hr />
        </>
      ) : null}
      <GoggleSignup
        txt="Sign up"
        fun={isMobile ? handleGoogleSignupMob : handleGoogleSignup}
      />
      <p className="text-center my-2 text-muted">
        <small>Or</small>
      </p>
      <FormGroup
        handleChange={handleChange}
        label="Full Name"
        value={form.name}
        type="text"
        id="name"
      />
      <FormGroup
        handleChange={handleChange}
        label="Email Address"
        value={form.email}
        type="email"
        id="email"
        autoComplete={false}
      />
      <FormGroup
        handleChange={handleChange}
        label="Password"
        help={{ txt: "(Must be at least 6 characters)" }}
        value={form.password}
        type="password"
        id="password"
        autoComplete={false}
      />

      <ReCAPTCHA
        // @ts-ignore next-line
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.REACT_APP_RECAPTCHA_KEY!}
        onChange={onChangeCaptcha}
      />
      {error && !loading ? (
        <div className="alert alert-warning mt-2">
          <i className="fas fa-exclamation-triangle shake_anim"></i>{" "}
          {error.message}
        </div>
      ) : null}
      <button
        className="btn btn-primary btn-block py-3"
        id="signup_button"
        onClick={signupHandler}
        disabled={loading}
      >
        {button_txt ? button_txt : "Create Teacher Account"}
      </button>
    </>
  );
};

function getCookie(cname: string) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return undefined;
}

export default SignupForm;
