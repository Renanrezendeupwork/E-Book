import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";
import { LoaderBar, LoaderDots } from "../../../middleware/loaders";
import { RESET_PASS } from "./queries";
import { Helmet } from "react-helmet";

type ErrorType = {
  message: string;
  reason?: string;
};

const ForgotPage: React.FC = () => {
  const [error, setError] = useState<ErrorType | null>(null);
  const [email, setEmail] = useState<string>("");
  const [requestPass, { loading, error: request_error, data: request_data }] =
    useMutation(RESET_PASS);

  useEffect(() => {
    if (request_error) {
      const set_error: ErrorType = {
        message: request_error.graphQLErrors[0].message,
      };
      setError(set_error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [request_error]);

  const resetPassRequest = async () => {
    if (!email) return false;
    try {
      await requestPass({ variables: { email } });
    } catch (error) {
      console.log("index.tsx:35 | error", error);
    }
  };

  const handleType = (ev: { target: HTMLInputElement }) => {
    const set_email = ev.target.value;
    setEmail(set_email);
  };

  const enterPressed = (ev: React.KeyboardEvent): void => {
    var code = ev.keyCode || ev.which;
    if (code === 13) {
      //13 is the enter keycode
      resetPassRequest();
    }
  };

  return (
    <main>
      {loading ? <LoaderBar fixed /> : null}
      <div className="container login_div">
        <div className="row justify-content-center align-items-center min-vh-100">
          <div className="col-10 col-sm-5 col-lg-4">
            <div className="row text-center justify-content-center">
              <div className="col-10 col-md-10">
                <img
                  src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
                  className="img-fluid"
                  alt="Flangoo Logo"
                />
              </div>
              {request_data ? (
                <Success />
              ) : (
                <EmailForm
                  email={email}
                  handleType={handleType}
                  enterPressed={enterPressed}
                  error={error}
                  loading={loading}
                  resetPassRequest={resetPassRequest}
                />
              )}
              <div className="w-100">
                <hr />
              </div>
              <p>
                <small>
                  <Link to="/signin">Go to Sign-in</Link> |{" "}
                  <Link to="/signup">No account? Sign-Up</Link>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const Success = () => (
  <div className="success">
    <i className="fas fa-mailbox fa-5x my-4 text-white"></i>
    <p>
      Check you inbox, we've sent you an email with instructions on how to
      recover your password. <br />
      <i>If you don't see it in your inbox, check your spam folder too!</i>
    </p>
  </div>
);

type EmailFormProps = {
  email: string;
  error: ErrorType | null;
  loading: boolean;
  handleType: any;
  resetPassRequest: any;
  enterPressed: any;
};

const EmailForm: React.FC<EmailFormProps> = ({
  email,
  handleType,
  enterPressed,
  error,
  loading,
  resetPassRequest,
}) => {
  return (
    <div className="col-12 my-3">
      <Helmet title="Forgot Password" />
      <h1>Forgot Password</h1>
      <p>Enter your email address.We will send you instructions to Sign-in </p>

      <div className={`form-group `}>
        <input
          type="text"
          name="login_data"
          className="form-control"
          value={email}
          onChange={handleType}
          placeholder="Enter email (only for Teacher Accounts)"
          onKeyPress={enterPressed}
        />
      </div>
      {error ? (
        <div className="alert alert-warning">
          <i className="fas fa-exclamation-triangle shake_anim"></i>{" "}
          {error.message}
        </div>
      ) : null}
      <button
        type="button"
        className="btn btn-raised btn-primary btn-block btn_xs_lg py-3"
        disabled={loading}
        onClick={resetPassRequest}
      >
        {loading ? (
          <LoaderDots
            // size="15"
            color="#333a40"
            centered={false}
            display="p-0"
          />
        ) : (
          "Recover Password"
        )}
      </button>
    </div>
  );
};

export default ForgotPage;
