import React from "react";
import { UserItem } from "../../../models/user";
import { IconJumbotron } from "../../common/icons";
export type FormType = {
  type?: string;
  name?: string;
  email?: string;
  message?: string;
  sended: boolean;
};
type HelpFormProps = {
  form: FormType;
  handleChange: (ev: {
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  }) => void;
  handleSubmit: () => void;
  sent: boolean;
  loading: boolean;
};

const HelpForm: React.FC<HelpFormProps> = ({
  form,
  handleChange,
  handleSubmit,
  sent,
  loading,
}) => {
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className={`material_shadows_3 card ${sent ? "py-5" : ""}`}>
      {sent ? (
        <IconJumbotron
          txt="Message sent!"
          icon="fas fa-envelope-open-text text-success"
          txt_classes="black_text mt-4"
          help_txt_classes="black_text"
          help_text="We'll be in touch as soon as possible"
        />
      ) : (
        <div className="card-body">
          <h3 className="black_text mt-0">Need Help?</h3>
          {!user.id ? (
            <UserData form={form} handleChange={handleChange} />
          ) : null}
          <div className="form-group">
            <label htmlFor="teacher_name">What can we help with?</label>
            <select
              className="form-control"
              name="type"
              value={form.type}
              onChange={handleChange}
              data-type="type"
            >
              <option value="false">Select a topic</option>
              <option value="general">General Inquiries</option>
              <option value="technical">I have a technical issue</option>
              <option value="billing">I need help with my billing</option>
            </select>
          </div>
          <label>Message </label>
          <textarea
            rows={4}
            name="message"
            placeholder="How can we help you?"
            className="form-control"
            data-type="message"
            onChange={handleChange}
            value={form.message}
          ></textarea>
          <button
            className="btn btn-danger btn-block mt-2 green_contain_green"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
};

type UserDataProps = {
  form: FormType;
  handleChange: (ev: {
    target: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
  }) => void;
};

const UserData: React.FC<UserDataProps> = ({ form, handleChange }) => (
  <div className="">
    <div className="form-group">
      <label htmlFor="teacher_name">Your Name</label>
      <input
        type="text"
        className="form-control"
        value={form.name}
        onChange={handleChange}
        data-type="name"
      />
    </div>
    <div className="form-group">
      <label htmlFor="teacher_name">Your email</label>
      <input
        type="text"
        className="form-control"
        value={form.email}
        onChange={handleChange}
        data-type="email"
      />
    </div>
  </div>
);

export default HelpForm;
