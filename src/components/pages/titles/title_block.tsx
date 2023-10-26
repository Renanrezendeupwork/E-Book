import React from "react";
import { BooksTitlesType } from ".";
import coming_soon_img from "../../assets/coming-soon.png";

type TitleBlockProps = {
  bookTitle: BooksTitlesType;
};
const TitleBlock: React.FC<TitleBlockProps> = ({ bookTitle }) => (
  <div className="relative">
    <img src={bookTitle.images.thumb} alt={bookTitle.title} />
    {bookTitle.coming_soon ? (
      <div style={{ position: "absolute", top: "0px", left: "0px" }}>
        <img
          src={coming_soon_img}
          className="coming_soon"
          alt="Coming This Soon"
        />
      </div>
    ) : null}
  </div>
);

export default TitleBlock;
