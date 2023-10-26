import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { passwordStrength } from "check-password-strength";
import { UserEditItem, UserItem } from "../../../models/user";
import { FormGroup } from "../../common/inputs";
import { ErrorColors, ErrorType } from "../../../models/errors";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../editprofile/queries";

type PasswordsPageProps = {
  userData: UserItem;
};

const Passwords: React.FC<PasswordsPageProps> = ({ userData }) => {
  const { reset_password } = useParams<{ reset_password: string }>();

  const [user, setUser] = useState<UserEditItem>({
    ...(userData as UserEditItem),
  });
  const [error, setError] = useState<ErrorType | false>(false);
  const [success, setSuccess] = useState<string | false>(false);
  const [updateUser, { loading: updating, error: mutaion_error }] =
    useMutation(UPDATEUSER);

  useEffect(() => {
    if (mutaion_error) {
      setError({
        message: mutaion_error.graphQLErrors[0].message,
        reason: "general",
        stop: true,
      });
    }
  }, [mutaion_error]);

  const handleType = (ev: { currentTarget: HTMLInputElement }) => {
    const value = ev.currentTarget.value;
    const id = ev.currentTarget.id as keyof UserEditItem;
    if (!id) return;
    const set_user = { ...user };
    //@ts-ignore next line;
    set_user[id] = value;
    setUser(set_user);
    if (id === "new_password" && value) {
      const password_response = passwordStrength(value);
      let color: ErrorColors = "text-danger";
      switch (password_response.id) {
        case 0:
        case 1:
          color = "text-danger";
          break;
        case 2:
          color = "text-warning";
          break;
        case 3:
          color = "text-success";
          break;

        default:
          color = "text-danger";
          break;
      }
      setError({
        message: `Password security is: ${password_response.value}`,
        reason: "password",
        color,
      });
    }
  };

  const handleUpdate = async () => {
    //validate password security
    const variables = {
      name: user.name,
      new_password: "",
      old_password: "",
      email: user.new_email,
    };
    if (user.new_password) {
      if (!user.old_password) {
        setError({
          reason: "general",
          message: "Please enter your current password",
        });
        return;
      }
      variables.new_password = user.new_password;
      variables.old_password = user.old_password;
    }
    setError(false);
    try {
      await updateUser({ variables });
      const newUser = { ...userData, ...user };
      delete newUser.new_password;
      delete newUser.new_password_reenter;
      delete newUser.old_password;
      localStorage.setItem("user", JSON.stringify(newUser));
      setSuccess("Password updated successfully");
      setUser(newUser);
    } catch (error) {
      console.log("index.js:132 | error", error);
    }
  };
  const comparePasswords = () => {
    const is_equal = user.new_password === user.new_password_reenter;
    if (!is_equal) {
      setError({
        message: "Passwords does not match",
        reason: "password_copy",
        color: "text-danger",
        stop: true,
      });
    }
  };
  return (
    <div className="setting_panel">
      <h4>Change password</h4>
      <div className="row">
        <div className="col-md-5">
          {success ? (
            <div className="alert alert-success">
              <i className="fas fa-check mr-2"></i>
              {success}
            </div>
          ) : null}
          {error && error.reason !== "password" ? (
            <div className="alert alert-danger ">
              <i className="fas fa-exclamation mr-2"></i>
              {error.message}
            </div>
          ) : null}
          {reset_password ? null : (
            <FormGroup
              value={user.old_password || ""}
              type="password"
              classes={`text-white animate_all`}
              id="old_password"
              label="Old password"
              autoComplete={false}
              handleChange={handleType}
            />
          )}
          {reset_password ? (
            <>
              <h3>Reset Password</h3>
              <p>Enter your new password and click save</p>
            </>
          ) : (
            <>
              <FormGroup
                value={user.new_password || ""}
                id="new_password"
                label="New password"
                autoComplete={false}
                classes="text-white"
                type="password"
                handleChange={handleType}
                help={
                  error && error.reason === "password"
                    ? { txt: error.message, classes: error.color }
                    : {
                        txt: "Must be at least 15 characters OR at least 8 characters including a number and a lowercase letter.",
                      }
                }
              />
              <FormGroup
                value={user.new_password_reenter || ""}
                id="new_password_reenter"
                label="Confirm new password"
                autoComplete={false}
                classes="text-white"
                type="password"
                onBlur={comparePasswords}
                handleChange={handleType}
                help={
                  error && error.reason === "password_copy"
                    ? { txt: error.message, classes: error.color }
                    : false
                }
              />
            </>
          )}
          <button
            className="btn btn-success ml-auto d-block"
            onClick={handleUpdate}
            disabled={updating}
          >
            Update password{" "}
            {updating ? <i className="far fa-circle-notch fa-spin"></i> : null}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Passwords;
