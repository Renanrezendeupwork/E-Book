import React from "react";
import { ReaderItem } from "../../../models/reader";
import ReadersRow from "./row";

type RenderComingSoonPrps = {
  readers: ReaderItem[];
  rowNum: number;
  arrowNav: (y_val: number, x_val: number, direction: "left" | "right") => void;
};
const RenderComingSoon: React.FC<RenderComingSoonPrps> = ({
  readers,
  rowNum,
  arrowNav,
}) => {
  const coming_soon_readers = readers.filter((reader) => reader.coming_soon);
  return (
    <ReadersRow
      arrowNav={arrowNav}
      is_trending={false}
      is_continue_reading={true}
      is_first={true}
      rowNum={rowNum}
      activeReader={false}
      title="Coming Soon"
      cat_id="coming_soon"
      readers={coming_soon_readers}
    />
  );
};

export default RenderComingSoon;
