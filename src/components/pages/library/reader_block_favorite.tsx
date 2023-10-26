import React from "react";
import { ReaderItem } from "../../../models/reader";

const ReaderBlock: React.FC<{
  reader: ReaderItem;
  is_first: boolean;
  slectActiveReader?: any;
  disableActiveRow?: any;
  activeReader: string | false;
  num?: number;
  cat_id?: string;
  rowNum: number;
  xval: number;
  xselected?: boolean;
}> = ({
  reader,
  is_first,
  num,
  slectActiveReader,
  disableActiveRow,
  activeReader,
  cat_id,
  rowNum,
  xval,
  xselected,
}) => (
  <div
    onClick={slectActiveReader}
    data-id={reader.id}
    data-cat_id={cat_id}
    data-rownum={rowNum}
    data-xval={xval}
    className={`effect-sadie pb-0  reader_block_item ${
      is_first ? "first-child" : ""
    } ${activeReader === reader.id ? "active" : ""} ${
      xselected ? "selected" : ""
    }`}
  >
    <div className="counter_cont">
      <h3 className="counter ">{num}</h3>
    </div>
    <img src={reader.images?.cover} alt={reader.title} />
  </div>
);

export default ReaderBlock;
