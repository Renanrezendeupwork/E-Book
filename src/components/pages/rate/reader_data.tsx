import React from "react";
import { ReaderItem } from "../../../models/reader";

type BookResumeProps = {
  reader: ReaderItem;
};

const BookResume: React.FC<BookResumeProps> = ({ reader }) => (
  <div className="reader_data">
    <img src={reader.images!.poster} className="img-fluid" alt="Book Cover" />
    <h2>{reader.title}</h2>
    <p dangerouslySetInnerHTML={{ __html: reader.description_short }} />
  </div>
);

export default BookResume;
