import React from "react";
import ReaderBlock from "./reader_block";
import ReaderFavorite from "./reader_block_favorite";

import Carousel from "./carousel";

import { ReaderItem } from "../../../models/reader";

type ReadersRowProps = {
  title: string;
  slectActiveReader?: any;
  arrowNav: (y_val: number, x_val: number, direction: "left" | "right") => void;
  disableActiveRow?: () => void;
  activeReader: string | false;
  hiddenRow?: boolean;
  keyNav?: { y: number; x: number; view: boolean; keyboard: boolean } | false;
  readers: ReaderItem[];
  cat_id: string;
  is_first: boolean;
  is_trending: boolean;
  rowNum: number;
  is_continue_reading?: boolean;
};
const ReadersRow: React.FC<ReadersRowProps> = ({
  title,
  readers,
  arrowNav,
  cat_id,
  is_first,
  activeReader,
  disableActiveRow,
  hiddenRow = false,
  is_trending,
  slectActiveReader,
  rowNum,
  keyNav,
  is_continue_reading = false,
}) => {
  const inactiveRow =
    rowNum >= -1 && keyNav && keyNav.y !== rowNum && keyNav.keyboard
      ? true
      : false;

  const renderReaderBlock = (lap: number) => {
    const lap_index = lap > 0 ? readers.length * lap : 0;
    return readers.map((reader, index: number) => {
      const x_position = index + lap_index;
      if (is_trending) {
        return (
          <ReaderFavorite
            key={`reader_${cat_id}_${reader.id}_${x_position}`}
            xselected={
              inactiveRow !== true &&
              keyNav &&
              keyNav.x === x_position &&
              (keyNav.view || keyNav.keyboard)
                ? true
                : false
            }
            xval={x_position}
            cat_id={cat_id}
            activeReader={activeReader}
            slectActiveReader={slectActiveReader}
            reader={reader}
            rowNum={rowNum}
            is_first={is_first}
            num={x_position + 1}
          />
        );
      }
      return (
        <ReaderBlock
          key={`reader_${cat_id}_${reader.id}_${x_position}`}
          xselected={
            inactiveRow !== true &&
            keyNav &&
            keyNav.x === x_position &&
            (keyNav.view || keyNav.keyboard)
              ? true
              : false
          }
          reader={reader}
          rowNum={rowNum}
          xval={x_position}
          cat_id={cat_id}
          activeReader={activeReader}
          slectActiveReader={slectActiveReader}
        />
      );
    });
  };

  return (
    <div
      className={`rowNum_${rowNum} level_group ${
        is_first ? "first-child" : " "
      } ${is_trending ? "is_trending" : " "} ${hiddenRow ? "opacity_0" : ""}`}
      id={cat_id}
      data-catlength={readers.length}
      onClick={inactiveRow ? disableActiveRow : undefined}
    >
      <h3 className={`${is_continue_reading ? "" : "cat_h3"}`}>{title}</h3>
      <Carousel
        containerClass={`carousel ${inactiveRow ? "notactive" : ""} ${
          keyNav && keyNav.keyboard ? "keyboard_active" : ""
        }`}
        arrowNav={arrowNav}
        rowNum={rowNum}
      >
        {renderReaderBlock(0)}
      </Carousel>
    </div>
  );
};

export default ReadersRow;
