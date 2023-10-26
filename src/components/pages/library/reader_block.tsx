import React from "react";
import { ReaderItem } from "../../../models/reader";
import coming_soon_img from "../../assets/coming-soon.png";
import new_img from "../../assets/new-icon.png";

type ReaderBlockProps = {
  reader: ReaderItem;
  slectActiveReader?: any;
  activeReader: string | false;
  cat_id?: string;
  rowNum: number;
  xval: number;
  xselected?: boolean;
};

const ReaderBlock: React.FC<ReaderBlockProps> = ({
  reader,
  slectActiveReader,
  activeReader,
  cat_id,
  rowNum,
  xval,
  xselected,
}) => {
  return (
    <div
      onClick={slectActiveReader}
      data-id={reader.id}
      data-cat_id={cat_id}
      data-rownum={rowNum}
      data-xval={xval}
      className={`reader_block_item ${
        activeReader === reader.id ? "active" : ""
      } ${xselected ? "selected" : ""}`}
    >
      {reader.coming_soon ? (
        <img src={coming_soon_img} className="coming_soon" alt="Coming soon" />
      ) : reader.is_new ? (
        <img src={new_img} className="is_new" alt="Coming soon" />
      ) : reader.categories.findIndex((c) => c.id === "19") >= 0 ? (
        <img
          src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/LimTime.png?v=4"
          className="is_new"
          alt="Coming soon"
          style={{ border: "1px solid white", margin: "5px" }}
        />
      ) : null}
      <div className="bg-img">
        {reader.images ? <img src={reader.images?.cover} alt="" /> : null}
      </div>
    </div>
  );
};

export default ReaderBlock;
