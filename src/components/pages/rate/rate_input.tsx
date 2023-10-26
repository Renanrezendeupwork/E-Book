import React from "react";
import { RateDataType } from "../../../models/reader";

type RateInputProps = {
  error?: string;
  loading: boolean;
  data: RateDataType;
  handleSelect: any;
  handleHover: any;
  handleHoverOut: any;
  handleSave: any;
  handleTypeMessage: any;
};

const RateInput: React.FC<RateInputProps> = ({
  error,
  data,
  handleSelect,
  handleHover,
  handleSave,
  handleHoverOut,
  handleTypeMessage,
  loading,
}) => {
  const star_values = [1, 2, 3, 4, 5];
  return (
    <div className="">
      <h1>Tell us what you think about this book</h1>
      <div className="raiting_item">
        <h3>Overall rating</h3>

        <div className="star_buttons">
          {star_values.map((star_value) => (
            <button
              className={`btn no_focus rate-btn ${
                data.hovered >= star_value ? "hover" : ""
              } 
              ${data.selected >= star_value ? "text_gold " : ""}`}
              onMouseEnter={handleHover}
              onMouseLeave={handleHoverOut}
              onClick={handleSelect}
              data-value={star_value}
              key={`star_value_${star_value}`}
            >
              <i
                className={`btn rate-btn ${
                  data.selected >= star_value ? "fas" : "far"
                } fa-star`}
                aria-hidden="true"
              ></i>
            </button>
          ))}
        </div>
      </div>

      <div className="raiting_item last-child">
        <h3>What is your opinion on this book?</h3>

        <textarea
          value={data.message}
          className="form-control"
          onChange={handleTypeMessage}
          rows={5}
          placeholder="Optional"
        ></textarea>
      </div>

      {error && (
        <div className="alert alert-danger text-right mt-3">{error}</div>
      )}

      <button
        className="btn btn-danger btn-lg d-block ml-auto mt-4 green_contain_green"
        onClick={handleSave}
      >
        {loading ? (
          <b>Saving...</b>
        ) : (
          <b>
            <i className="fa fa-star" aria-hidden="true"></i> Rate this Book
          </b>
        )}
      </button>
    </div>
  );
};

export default RateInput;
