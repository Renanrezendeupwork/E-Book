import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
import * as email_validator from "email-validator";
import { passwordStrength } from "check-password-strength";

import { LoaderBar } from "../../../middleware/loaders";
import axios from "../../../middleware/axios_api";
import { FormGroup } from "../../common/inputs";
import { UPDATEUSER } from "./queries";
import { UserEditItem } from "../../../models/user";
import { ErrorColors, ErrorType } from "../../../models/errors";
import { useRef } from "react";
import { getUserImage } from "../../../middleware/common-functions";

const EditProfile = () => {
  const userData: UserEditItem = JSON.parse(
    localStorage.getItem("user") || "{}"
  );
  const image = useRef<HTMLInputElement>(null);
  const { reset_password } = useParams<{ reset_password: string }>();
  const [error, setError] = useState<ErrorType | false>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserEditItem>({ ...userData });
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

  const updatePassword = async () => {
    if (
      !user.new_password ||
      !user.new_password_reenter ||
      (error && error.stop)
    ) {
      return;
    }
    if (!reset_password && !user.old_password) {
      setError({
        message: "Please add your old password",
        reason: "general",
        stop: true,
      });
      return;
    }
    try {
      await updateUser({
        variables: {
          new_password: user.new_password,
          old_password: reset_password ? userData.token : user.password,
        },
      });
      setTimeout(() => {
        window.location.href = "/youraccount";
      }, 500);
    } catch (error) {
      console.log("index.js:98 | error", error);
    }
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

  const promtImage = () => {
    image.current?.click();
  };

  const handleUploadImage = async () => {
    if (
      !image.current ||
      !image.current.files ||
      image.current.files.length < 1
    ) {
      return;
    }
    setLoading(true);
    const upload_image = image.current.files[0];
    const data = new FormData();
    data.append("profile_image", upload_image);

    try {
      const response = await axios.post("/user_img", data);
      const set_user = { ...user };
      const set_local_user = JSON.parse(localStorage.getItem("user") || "{}");
      set_user.profile_pic = response.data.image_name;
      set_local_user.profile_pic = response.data.image_name;
      localStorage.setItem("user", JSON.stringify(set_local_user));
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.log("index.tsx:162 | error ", error);
    }
  };

  return (
    <main className="first-container last-container">
      {updating || loading ? <LoaderBar fixed /> : null}
      <div className="container">
        <div className="row justify-content-center my-5">
          <div className="col-md-6">
            <h1>Edit Profile</h1>
            <div className="row">
              <div className="col-md-4">
                <div className="change_profile img_btn" onClick={promtImage}>
                  <i className="fas fa-image-polaroid"></i>
                  <img
                    src={
                      user.profile_pic
                        ? getUserImage(user.profile_pic)
                        : "https://cdn.flangoo.com/assets/global/thumb1.png"
                    }
                    alt="User Profile"
                    className="img-fluid"
                  />
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    ref={image}
                    onChange={handleUploadImage}
                  />
                </div>
                <span className="text-muted small text-center d-block">
                  Click to Change Profile Picture
                </span>
              </div>
              <div className="col-md-8 text-white">
                {reset_password ? (
                  <>
                    <h3>Reset Password</h3>
                    <p>Enter your new password and click save</p>
                  </>
                ) : (
                  <>
                    {" "}
                    <FormGroup
                      value={user.name}
                      id="name"
                      label="Your Name"
                      handleChange={handleType}
                    />
                    <hr />
                    <FormGroup
                      value={user.email}
                      id="email"
                      autoComplete={false}
                      disabled
                      readonly
                      label="Current Email"
                    />
                    <FormGroup
                      value={user.new_email || ""}
                      id="new_email"
                      autoComplete={false}
                      label="New Email"
                      handleChange={handleType}
                    />
                  </>
                )}
                <FormGroup
                  value={user.new_password || ""}
                  id="new_password"
                  label="New Password"
                  autoComplete={false}
                  type="password"
                  handleChange={handleType}
                  help={
                    error && error.reason === "password"
                      ? { txt: error.message, classes: error.color }
                      : false
                  }
                />
                <FormGroup
                  value={user.new_password_reenter || ""}
                  id="new_password_reenter"
                  label="Confirm Password"
                  autoComplete={false}
                  type="password"
                  onBlur={comparePasswords}
                  handleChange={handleType}
                  help={
                    error && error.reason === "password_copy"
                      ? { txt: error.message, classes: error.color }
                      : false
                  }
                />
                {reset_password ? null : (
                  <FormGroup
                    value={user.old_password || ""}
                    type="password"
                    disabled={
                      !user.new_password && !user.new_email ? true : false
                    }
                    classes={`${
                      !user.new_password && !user.new_email ? "opacity_4" : ""
                    } animate_all`}
                    id="old_password"
                    label="Current Password"
                    handleChange={handleType}
                  />
                )}
              </div>
              <div className="col-12 ">
                <hr />
                {error && error.reason === "general" ? (
                  <div className="alert alert-danger">{error.message}</div>
                ) : null}
              </div>
              <div className="col-12 d-flex justify-content-between">
                <Link to="/" className="btn btn-link mr-5">
                  Cancel
                </Link>
                <button
                  className="btn btn-danger px-5"
                  onClick={
                    reset_password
                      ? () => {
                          updatePassword();
                        }
                      : handleUpdate
                  }
                  disabled={updating}
                >
                  {updating ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditProfile;
