import React, { useEffect, useState } from "react";
import * as email_validator from "email-validator";
import { UserEditItem, UserItem } from "../../../models/user";
import { FormGroup } from "../../common/inputs";
import { ErrorType } from "../../../models/errors";
import { useMutation } from "@apollo/client";
import { UPDATEUSER } from "../editprofile/queries";
import EmailPref from "./emails_pref";
type EmailsPageProps = {
  userData: UserItem;
};

const Emails: React.FC<EmailsPageProps> = ({ userData }) => {
  const [user, setUser] = useState<UserEditItem>({
    ...(userData as UserEditItem),
  });
  const [error, setError] = useState<ErrorType | false>(false);
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
  };
  const handleUpdate = async () => {
    //validate email
    if (user.new_email && !email_validator.validate(user.new_email)) {
      setError({ reason: "general", message: "Please enter a valid email" });
      return;
    }
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
      localStorage.setItem("user", JSON.stringify(newUser));
      setTimeout(() => {
        window.location.href = "youraccount";
      }, 500);
    } catch (error) {
      console.log("index.js:132 | error", error);
    }
  };
  return (
    <div className="setting_panel">
      <div className="row">
        <div className="col-md-5">
          <h4>Emails </h4>
          {error ? (
            <div className="alert alert-danger ">
              <i className="fas fa-exclamation mr-2"></i>
              {error.message}
            </div>
          ) : null}
          <FormGroup
            value={user.email}
            classes="text-white mb-4"
            input_classes="mb-1"
            id="email"
            autoComplete={false}
            disabled
            readonly
            label="Current Email"
          />{" "}
          <FormGroup
            value={user.new_email || ""}
            id="new_email"
            classes="text-white "
            placeholder="Enter address"
            help={{
              txt: "Enter a new email address to update your account.",
            }}
            autoComplete={false}
            label="Update Email Address"
            handleChange={handleType}
          />
          <FormGroup
            value={user.main_contact || ""}
            id="main_contact"
            classes="text-white "
            placeholder="Enter address"
            help={{
              txt: "Used in case your main account email is not working",
            }}
            autoComplete={false}
            label="Recovery Email Address"
            handleChange={handleType}
          />
          <button
            className="btn btn-success ml-auto d-block"
            onClick={handleUpdate}
            disabled={updating}
          >
            Update email preferences{" "}
            {updating ? <i className="far fa-circle-notch fa-spin"></i> : null}
          </button>
        </div>
        <div className="col-md-7">
          <EmailPref />
        </div>
      </div>
    </div>
  );
};

export default Emails;
