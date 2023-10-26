import React, { useEffect, useRef, useState } from "react";
import { Button, ButtonGroup } from "reactstrap";
import { passwordStrength } from "check-password-strength";
import * as email_validator from "email-validator";
import { useMutation } from "@apollo/client";
import { Link } from "react-router-dom";

import axios from "../../../middleware/axios_api";
import { FormGroup } from "../../common/inputs";
import { UPDATELANG } from "../profile/queries";
import { LangItem } from "../../../models/lang";
import { UserEditItem, UserItem } from "../../../models/user";
import { ErrorColors, ErrorType } from "../../../models/errors";
import { UPDATEUSER } from "../editprofile/queries";

type ProfilePageProps = {
  userData: UserItem;
  profile_pic: string;
};
const ProfilePage: React.FC<ProfilePageProps> = ({ userData, profile_pic }) => {
  const [loadingImage, setLoading] = useState<boolean>(false);
  const local_languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "{}"
  );
  const image = useRef<HTMLInputElement>(null);

  const [error, setError] = useState<ErrorType | false>(false);
  const [user, setUser] = useState<UserEditItem>({
    ...userData,
  } as UserEditItem);
  const [langs, setLangs] = useState(local_languages);
  const [updateLangs] = useMutation(UPDATELANG);
  const [updateUser, { called: updating, error: mutaion_error }] =
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

  const updateLangsFun = (ev: { currentTarget: HTMLButtonElement }) => {
    const set_langs = [...langs];
    const lang_id = ev.currentTarget.dataset.lang_id;
    const active = ev.currentTarget.dataset.active === "true" ? false : true;
    if (!lang_id) {
      return;
    }
    const index_of = set_langs.findIndex((l: LangItem) => l.id === lang_id);
    if (index_of < 0) {
      return;
    }
    set_langs[index_of].active = active;

    const active_langs = set_langs
      .filter((item) => item.active)
      .map((item) => item.id);
    updateLangs({ variables: { langs: active_langs } });
    localStorage.setItem("local_languages", JSON.stringify(set_langs));
    setLangs(set_langs);
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
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.log("index.js:132 | error", error);
    }
  };
  const promtImage = () => {
    if (loadingImage) {
      setError({
        message: "We're updating your profile image, plase wait...",
        reason: "general",
      });
      setTimeout(() => {
        setError(false);
      }, 5000);
      return;
    }
    image.current?.click();
  };
  const handleUploadImage = async () => {
    if (
      loadingImage ||
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
    } catch (request_err: any) {
      setLoading(false);
      if (request_err.response && request_err.response.data) {
        console.log(
          "profile.tsx:212 | request_err.response",
          request_err.response
        );
        const error_message = request_err.response.data.errors.profile_image[0];
        setError({
          message: error_message,
          reason: "general",
        });
      } else if (request_err.request) {
        setError({
          message: "Your image is too large, try with a smaller one (max 1mb)",
          reason: "general",
        });
      } else {
        setError({
          message:
            "There's something wrong with your image, we can't upload it",
          reason: "general",
        });
      }
    }
  };
  return (
    <div className="setting_panel">
      {error ? (
        <div className="alert alert-danger ">
          <i className="fas fa-exclamation mr-2"></i>
          {error.message}
        </div>
      ) : null}
      <h4>Your Profile</h4>
      <div className="row">
        <div className="col-md-6">
          <label htmlFor="name" className="">
            Your Name
          </label>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={handleType}
              value={user.name}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary green_contain_green"
                type="button"
                id="button-addon2"
                onClick={handleUpdate}
              >
                {updating ? (
                  <i className="far fa-circle-notch fa-spin"></i>
                ) : (
                  " Update"
                )}
              </button>
            </div>
          </div>
          <FormGroup
            value={user.email}
            classes="text-white mb-0"
            input_classes="mb-1"
            id="email"
            autoComplete={false}
            disabled
            readonly
            label="Current Email"
          />{" "}
          <small className="help mb-3 d-block">
            You can manage verified email addresses in your{" "}
            <Link to="/settings/emails" className="text-primary">
              email settings
            </Link>
            .
          </small>
          <p>What Subject Do You Teach? (check all that apply)</p>
          <Languages languages={langs} updateLangs={updateLangsFun} />
          <br />
          <small className="help">
            We want to send you only the news that is related to the languages
            you currently teach.
          </small>
        </div>
        <div className="col-md-3">
          <div
            className={`change_profile img_btn ${
              loadingImage ? "loading" : ""
            }`}
            onClick={promtImage}
          >
            {loadingImage ? (
              <i className="fad fa-spinner-third fa-spin"></i>
            ) : (
              <i className="fas fa-image-polaroid"></i>
            )}

            <img src={profile_pic} alt="User Profile" className="img-fluid" />
            <input
              type="file"
              accept="image/png, image/jpeg"
              ref={image}
              onChange={handleUploadImage}
            />
          </div>
          <span
            className="text-muted small text-center d-block"
            onClick={promtImage}
          >
            Click to Change Profile Picture
          </span>
        </div>
      </div>
    </div>
  );
};

type LanguagesProps = {
  languages: LangItem[];
  updateLangs: any;
};
const Languages: React.FC<LanguagesProps> = ({ languages, updateLangs }) => (
  <ButtonGroup>
    {languages && languages.length > 0
      ? languages.map((lang) => (
          <Button
            color="primary green_contain_green"
            className="no_focus"
            active={lang.active}
            key={`Button_${lang.id}`}
            data-lang_id={lang.id}
            data-active={lang.active ? "true" : "false"}
            onClick={updateLangs}
          >
            <i
              className={`fal mr-2 ${
                lang.active ? "fa-check-square" : "fa-square"
              }`}
            ></i>
            {lang.name}
          </Button>
        ))
      : null}
  </ButtonGroup>
);

export default ProfilePage;
