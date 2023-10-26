import { useDrag } from "@use-gesture/react";
import React, { useState, Children, useRef } from "react";

type CarouselProps = {
  containerClass?: string;
  children: React.ReactNode;
  arrowNav: (y_val: number, x_val: number, direction: "left" | "right") => void;
  rowNum: number;
};
const Carousel: React.FC<CarouselProps> = ({
  containerClass = "",
  children,
  arrowNav,
  rowNum,
}) => {
  const thisRow = useRef<HTMLDivElement>(null);
  const [x_value, setXvalue] = useState(0);
  const bind = useDrag((state) => handleTouchScroll(state), {
    axis: "x",
    preventScroll: true,
  });
  const [scrollValue, setScrollValue] = useState<number>(0);
  const triggerScroll = (ev: { currentTarget: HTMLElement }) => {
    const max_x = Children.count(children);
    let set_x = x_value;
    ev.currentTarget.blur();
    const direction = ev.currentTarget.dataset.direction as "left" | "right";
    if (!direction) return;
    if (direction === "left") {
      set_x = set_x - 1;
    } else {
      set_x = set_x + 1;
    }
    if (set_x > max_x) {
      set_x = max_x - 1;
    } else if (set_x < 0) {
      set_x = 0;
    }
    const body = document.body;
    body.classList.add("scroll_lock_mob");
    setTimeout(() => {
      body.classList.remove("scroll_lock_mob");
    }, 200);
    arrowNav(rowNum, x_value, direction);

    setXvalue(set_x);
  };

  const handleTouchScroll = (state: any) => {
    if (!thisRow || !thisRow.current) return;
    const active_book_width = thisRow.current.offsetWidth + 10;
    const window_width = window.innerWidth;
    const { direction, first } = state;
    const images = thisRow.current.getElementsByClassName("reader_block_item");
    const image = images[0] as HTMLImageElement;
    let width = 260;
    if (image) {
      ///get with
      width = image.offsetWidth + 10;
    }
    const x = width;
    const x_direction = direction[0];
    let set_x = x_direction === 1 ? scrollValue - x : scrollValue + x;
    if (set_x > active_book_width - window_width) {
      set_x = active_book_width - window_width + width;
    } else if (set_x < 0) {
      set_x = 0;
    }
    if (first) {
      setScrollValue(set_x);
    }
  };

  return (
    <div className={`library_carousel ${containerClass}`}>
      <div className="library_carousel_row_container">
        <div
          ref={thisRow}
          className="library_carousel_row"
          {...bind()}
          style={{
            transform: `translateX(-${scrollValue}px)`,
          }}
        >
          {children}
        </div>
      </div>
      <div className="arrow_area arrow_area_left">
        <button
          onClick={triggerScroll}
          data-direction="left"
          aria-label="Go to previous slide"
          className="btn arrow arrow_left"
        >
          <i className="fal fa-angle-left"></i>
        </button>
      </div>
      <div className="arrow_area arrow_area_right">
        <button
          onClick={triggerScroll}
          data-direction="right"
          aria-label="Go to next slide"
          className="btn arrow arrow_right"
        >
          <i className="fal fa-angle-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Carousel;
