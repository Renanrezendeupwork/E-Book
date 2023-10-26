import React, { useEffect, useContext, useState } from "react";
import { isMobile } from "react-device-detect";
import KeyboardEventHandler from "@infinium/react-keyboard-event-handler";
import { useQuery } from "@apollo/client";
import { useParams, useHistory } from "react-router-dom";

import ReadersRow from "./row";
import { DataContext } from "../../../context/data-context";
import { LangItem } from "../../../models/lang";
import { CatItem, ReaderItem } from "../../../models/reader";
import FirstModal from "./student_modal";
import { UserItem } from "../../../models/user";
import { GETCONTINUE, GETASSIGNMENT } from "./queries";
import Assigment from "./assigment";
import StarterSteps from "./starter_steps";
import RenderComingSoon from "./coming_soon";
import { GET_READERS } from "../../../middleware/queries";
import BookInfo from "./bookInfo";
import { Helmet } from "react-helmet";

const Library: React.FC = () => {
  const history = useHistory();
  const user_local: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [user, setUser] = useState(user_local);
  const [x_arr, setXarr] = useState<number[]>([]);
  const [keyNav, setKeyNav] = useState<
    | {
        y: number;
        x: number;
        view: boolean;
        keyboard: boolean;
      }
    | false
  >(false);
  const [activeReader, setActiveReader] = useState<ReaderItem | false>(false);
  const [activeCat, setActiveCat] = useState<{
    id: string | false;
    books_num: number;
  }>({ id: false, books_num: 0 });
  const { lang_name } = useParams<{ lang_name: string }>();
  const { data: continue_reading } = useQuery<{
    getContinueReading: ReaderItem[];
    getRecentReading: ReaderItem[];
  }>(GETCONTINUE, {
    fetchPolicy: "cache-and-network",
  });
  const { data: get_assignment } = useQuery(GETASSIGNMENT, {
    fetchPolicy: "cache-and-network",
    skip: user.is_teacher,
    variables: { class_id: user.class_id, lang_id: user.lang_id },
  });
  const { data: get_readers } = useQuery(GET_READERS, {
    fetchPolicy: "no-cache",
    skip: user.is_teacher,
    variables: { class_id: user.class_id, lang_id: user.lang_id },
  });
  const dataContext = useContext(DataContext);
  const [readers, setReader] = useState<ReaderItem[]>(
    JSON.parse(localStorage.getItem("local_readers") || "[]")
  );
  const categories: CatItem[] = localStorage.getItem("local_readers")
    ? JSON.parse(localStorage.getItem("local_categories") || "{}")
    : [];
  const languages = JSON.parse(localStorage.getItem("local_languages") || "{}");

  useEffect(() => {
    setXarr(categories.map(() => 0));
    const selected_lang: LangItem = languages.find(
      (lang: LangItem) => lang.id === user.lang_id
    );
    if (selected_lang) {
      setUser({ ...user, lang_name: selected_lang.name });
    }
    const storage_key_nav = JSON.parse(localStorage.getItem("keyNav") || "{}");
    if (storage_key_nav.x !== undefined) {
      localStorage.removeItem("keyNav");
      setKeyNav({ ...storage_key_nav, view: false });
    }
    return () => {
      const body = document.body;
      body.classList.remove("scroll_lock");
      setActiveCat({ id: false, books_num: activeCat.books_num });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!activeReader) {
      const body = document.body;
      body.classList.remove("scroll_lock");
      setActiveCat({ id: false, books_num: activeCat.books_num });
    } else {
      if (isMobile) {
        ///save active reader to local storage
        localStorage.setItem("keyNav", JSON.stringify(keyNav));
        history.push(`/bookdetails/${activeReader.url}/${activeReader.id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeReader]);

  useEffect(() => {
    if (get_readers && get_readers.books) {
      const order_readers = get_readers.books.sort(
        (a: ReaderItem, b: ReaderItem) => {
          // Sort by coming_soon
          if (a.coming_soon && !b.coming_soon) {
            return -1;
          } else if (!a.coming_soon && b.coming_soon) {
            return 1;
          }
          // Sort by is_new (if exists)
          if (a.is_new && !b.is_new) {
            return -1;
          } else if (!a.is_new && b.is_new) {
            return 1;
          }
          // Sort by rank
          return a.rank > b.rank ? 1 : -1;
        }
      );
      localStorage.setItem("local_readers", JSON.stringify(order_readers));
      setReader(order_readers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get_readers]);

  useEffect(() => {
    if (lang_name) {
      const selected_lang: LangItem = languages.find(
        (lang: LangItem) => lang.name.toLocaleLowerCase() === lang_name
      );
      if (selected_lang) {
        dataContext.setLang(selected_lang.id);
        dataContext.setLoaded(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang_name]);

  useEffect(() => {
    if (keyNav) {
      if (keyNav.keyboard || keyNav.view) {
        scrollRow();
        slectActiveReaderKeyboard();
      } else {
        scrollRow();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyNav]);

  const discardFunction = () => {
    const set_user = { ...user };
    set_user.show_steps = false;
    localStorage.setItem("user", JSON.stringify(set_user));
    setUser(set_user);
  };

  const slectActiveReader = (ev: { currentTarget: HTMLElement }) => {
    const y_val = ev.currentTarget.dataset.rownum;
    const x_val = ev.currentTarget.dataset.xval;
    const set_key_nav = keyNav
      ? { ...keyNav }
      : { y: 0, x: 0, view: true, keyboard: false };
    if (y_val && x_val) {
      set_key_nav.y = parseInt(y_val);
      set_key_nav.x = parseInt(x_val);
    }
    set_key_nav.view = true;
    setKeyNav(set_key_nav);
  };

  const arrowNav = (
    y_val: number,
    x_val: number,
    direction: "left" | "right"
  ) => {
    const set_key_nav = keyNav
      ? { ...keyNav }
      : { y: 0, x: 0, view: false, keyboard: false };
    const steps = set_key_nav.view || activeCat.id === "is_trending" ? 1 : 1;
    set_key_nav.keyboard = false;
    set_key_nav.x = direction === "left" ? x_val - steps : x_val + steps;
    if (set_key_nav.x < 0) {
      set_key_nav.x = 0;
    }
    set_key_nav.y = y_val;
    setKeyNav(set_key_nav);
  };

  const slectActiveReaderKeyboard = () => {
    if (!keyNav) return;
    let { x: book_num, y: rowNum, view } = keyNav;
    if (!view) return;
    let cat =
      rowNum === -1
        ? { is_level: false, id: "continue_reading" }
        : rowNum >= categories.length
        ? { is_level: false, id: "recent_reading" }
        : categories[rowNum];

    let level_readers = [];
    if (cat.id === "continue_reading" && continue_reading) {
      level_readers = continue_reading.getContinueReading;
    } else if (cat.id === "recent_reading" && continue_reading) {
      level_readers = continue_reading.getRecentReading;
    } else {
      level_readers = readers.filter((reader) => {
        if (reader.coming_soon && !user.is_teacher) return false;
        if (cat.is_level) return reader.level_id === cat.id;
        const same_cat = reader.categories.filter(
          (category: CatItem) => category.id === cat.id
        );
        return same_cat.length >= 1;
      });
    }
    if (level_readers.length < 1) return null;
    if (book_num > level_readers.length - 1) {
      ///means we are at in an infinite row position
      const lap = Math.floor(book_num / level_readers.length);
      book_num = book_num - level_readers.length * lap;
    }
    const selected_reader = level_readers[book_num];
    if (selected_reader) {
      setActiveReader(selected_reader);
      if (cat.id) {
        setActiveCat({ id: cat.id, books_num: level_readers.length });
        scrollCat(cat.id);
      }
    }
  };

  const scrollCat = (cat_id: string, tries = 0) => {
    const body = document.body;
    const cat = document.getElementById(cat_id) as HTMLHeadingElement;
    const book_info = document.getElementById("book_info") as HTMLDivElement;

    if (!cat || !book_info) {
      ///avoid infinite loop
      if (tries < 5) {
        setTimeout(() => {
          scrollCat(cat_id, tries + 1);
        }, 100);
      }
      return;
    }
    const headerOffset = book_info.offsetHeight + 65;
    const catPosition = cat.getBoundingClientRect().top;
    const offsetPosition = catPosition + window.pageYOffset - headerOffset;
    body.classList.add("scroll_lock");
    window.scrollTo({
      top: offsetPosition,
    });
  };

  const handleKeyboardNav = (key_value: string) => {
    const min_y =
      continue_reading && continue_reading.getContinueReading.length > 0
        ? -1
        : 0;
    const set_key_nav = keyNav
      ? { ...keyNav }
      : { y: min_y - 1, x: 0, view: false, keyboard: true };
    if (key_value === "enter" && set_key_nav.view === true && activeReader) {
      history.push(`/reader/${activeReader.url}/${activeReader.id}`);
      return;
    }
    set_key_nav.keyboard = true;
    if (key_value === "esc") {
      if (set_key_nav.view) {
        set_key_nav.view = false;
        setActiveReader(false);
      } else {
        set_key_nav.keyboard = false;
        setKeyNav(false);
        return;
      }
    }

    switch (key_value) {
      case "esc":
        break;
      case "enter":
        set_key_nav.view = true;
        break;
      case "down":
        set_key_nav.y++;
        break;
      case "up":
        set_key_nav.y--;
        break;
      case "right":
        set_key_nav.x++;
        break;
      case "left":
        set_key_nav.x--;
        break;

      default:
        return;
    }
    if (set_key_nav.view && keyNav && set_key_nav.y !== keyNav.y) {
      return;
    }
    //validate negative vertical value
    let total_cats = categories.length - 1;
    if (continue_reading && continue_reading.getRecentReading.length) {
      total_cats += 1;
    }
    if (!user.is_teacher) {
      total_cats += 1;
    }
    if (set_key_nav.y < min_y) {
      set_key_nav.y = min_y;
    } else if (set_key_nav.y > total_cats) {
      set_key_nav.y = total_cats;
    }
    if (keyNav) {
      const set_x_arr = [...x_arr];
      set_x_arr[keyNav.y] = set_key_nav.x;
      setXarr(set_x_arr);
      if (keyNav && set_key_nav.y !== keyNav.y) {
        set_key_nav.x = x_arr[set_key_nav.y] || 0;
      }
    }
    //validate negative horizontal value
    if (set_key_nav.x < 0) {
      set_key_nav.x = 0;
    } else if (
      keyNav &&
      keyNav.keyboard &&
      set_key_nav.x >= activeCat.books_num - 1
    ) {
      set_key_nav.x = activeCat.books_num - 1;
    }
    setKeyNav(set_key_nav);
  };

  const scrollRow = () => {
    if (!keyNav) {
      return;
    }
    const row = window.document.getElementsByClassName(`rowNum_${keyNav.y}`);
    if (!row) return;
    const active_row = row[0] as HTMLDivElement;
    const cat_length = active_row.dataset.catlength;
    if (cat_length) {
      setActiveCat({ id: activeCat.id, books_num: parseInt(cat_length) });
    }
    if (!keyNav.view && keyNav.keyboard) {
      active_row.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    const active_row_width = active_row.offsetWidth + 10;
    const books = active_row.getElementsByClassName("library_carousel_row");
    if (books) {
      const active_book = books[0] as HTMLDivElement;
      const active_book_width = active_book.offsetWidth + 10;
      const images = active_book.getElementsByClassName("reader_block_item");
      const image = images[0] as HTMLImageElement;
      if (image) {
        ///get with
        const width = image.offsetWidth + 10;
        let scroll_Value = keyNav.x * width;
        if (scroll_Value + (active_row_width - width) > active_book_width) {
          scroll_Value = active_book_width - active_row_width + width;
        }
        active_book.style.transform = `translateX(-${scroll_Value}px)`;
      }
    }
  };

  const handleBack = () => {
    const set_key_nav = keyNav
      ? { ...keyNav }
      : { y: -2, x: 0, view: false, keyboard: false };
    set_key_nav.view = false;
    set_key_nav.keyboard = false;
    setActiveCat({ id: false, books_num: 0 });
    setActiveReader(false);
    setKeyNav(set_key_nav);
  };

  let rowNum = -1;
  return (
    <main>
      <Helmet title={`${user.lang_name || ""} Library | Flangoo`} />
      <KeyboardEventHandler
        handleKeys={["enter", "esc", "down", "up", "left", "right"]}
        onKeyEvent={(key, e) => {
          handleKeyboardNav(key);
          e.preventDefault();
        }}
      />
      {activeReader ? (
        <div className="book_details_library">
          {" "}
          <BookInfo reader={activeReader} goBack={handleBack} user={user} />
        </div>
      ) : null}
      {user.show_steps ? (
        <StarterSteps discardFunction={discardFunction} />
      ) : null}
      {get_assignment && get_assignment.assignments.length > 0 ? (
        <Assigment assignment={get_assignment.assignments[0]} />
      ) : null}
      <div
        className={`${
          get_assignment && get_assignment.assignments.length > 0 ? "mt-0" : ""
        } first-container last-container container-fluid text-center books_page ${
          activeReader ? "active_reader" : ""
        }`}
      >
        {continue_reading && continue_reading.getContinueReading.length > 0 ? (
          <ReadersRow
            disableActiveRow={handleBack}
            arrowNav={arrowNav}
            is_trending={false}
            is_continue_reading={true}
            is_first={true}
            rowNum={rowNum}
            keyNav={keyNav}
            slectActiveReader={slectActiveReader}
            activeReader={activeReader ? activeReader.id : false}
            title="Continue Reading"
            hiddenRow={
              keyNav &&
              activeCat.id !== false &&
              activeCat.id !== "continue_reading" &&
              (keyNav.keyboard || keyNav.view)
                ? true
                : false
            }
            cat_id="continue_reading"
            readers={continue_reading.getContinueReading}
          />
        ) : null}
        {readers && categories
          ? categories.map((level: CatItem, index: number) => {
              const level_readers = readers.filter((reader) => {
                if (reader.coming_soon && !user.is_teacher) return false;
                if (level.is_level) return reader.level_id === level.id;
                const same_cat = reader.categories.filter(
                  (category: CatItem) => category.id === level.id
                );
                return same_cat.length >= 1;
              });
              if (level_readers.length < 1) return null;
              rowNum++;
              return (
                <ReadersRow
                  disableActiveRow={handleBack}
                  arrowNav={arrowNav}
                  key={`readers_row${level.id}`}
                  rowNum={rowNum}
                  keyNav={keyNav}
                  slectActiveReader={slectActiveReader}
                  hiddenRow={
                    keyNav &&
                    activeCat.id !== false &&
                    activeCat.id !== level.id &&
                    (keyNav.keyboard || keyNav.view)
                      ? true
                      : false
                  }
                  is_trending={level.is_trending}
                  is_first={
                    continue_reading &&
                    continue_reading.getContinueReading.length > 0
                      ? false
                      : index <= 0
                  }
                  title={level.name}
                  activeReader={activeReader ? activeReader.id : false}
                  cat_id={level.id}
                  readers={level_readers}
                />
              );
            })
          : null}
        {continue_reading && continue_reading.getRecentReading.length > 0 ? (
          <ReadersRow
            disableActiveRow={handleBack}
            arrowNav={arrowNav}
            is_trending={false}
            is_continue_reading={false}
            is_first={false}
            rowNum={rowNum + 1}
            keyNav={keyNav}
            slectActiveReader={slectActiveReader}
            activeReader={activeReader ? activeReader.id : false}
            title="Recently Read"
            hiddenRow={
              keyNav &&
              activeCat.id !== false &&
              activeCat.id !== "recent_reading" &&
              (keyNav.keyboard || keyNav.view)
                ? true
                : false
            }
            cat_id="recent_reading"
            readers={continue_reading.getRecentReading}
          />
        ) : null}
        {!user.is_teacher ? (
          <RenderComingSoon
            readers={readers}
            rowNum={
              continue_reading && continue_reading.getRecentReading.length > 0
                ? rowNum + 2
                : rowNum + 1
            }
            arrowNav={arrowNav}
          />
        ) : null}
        {!user.is_teacher && user.first_visit ? (
          <FirstModal user={user} />
        ) : null}
      </div>
    </main>
  );
};

export default Library;
