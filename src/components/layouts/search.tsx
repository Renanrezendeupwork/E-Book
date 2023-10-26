import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const SearchInput: React.FC = () => {
  const [active, setActive] = useState(false);
  const [searchString, setSearchString] = useState<undefined | string>();
  const { search_string } = useParams<{ search_string: string }>();
  const history = useHistory();

  useEffect(() => {
    if (search_string) {
      setActive(true);
      // setSearchString(search_string);
    }
  }, [search_string]);

  const toggleActive = () => {
    const set_active = !active;
    setActive(set_active);
    if (set_active) {
      document.getElementById("search_input")?.focus();
    } else {
      setTimeout(() => {
        if (window.location.pathname.includes("search")) {
          history.push({
            pathname: `/`,
          });
        }
      }, 200);
    }
  };

  const searchReadersPromnt = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    var code = ev.keyCode || ev.which;
    if (code === 13 && searchString) {
      const url = encodeURI(searchString);
      history.push({
        pathname: `/search/${url}`,
      });
    }
  };

  const handleType = (ev: { target: HTMLInputElement }) => {
    const target = ev.target as HTMLInputElement;
    const txt = target.value;
    console.log("search.tsx:28 | txt", txt);
    setSearchString(txt);
  };

  return (
    <div
      className={`navbar-form ml-auto navbar-right nav_search ${
        active ? "active" : ""
      }`}
    >
      <div className="cleared_input ">
        <input
          type="text"
          id="search_input"
          className="form-control search_key"
          placeholder="Search Readers"
          value={searchString}
          onKeyUp={searchReadersPromnt}
          onChange={handleType}
        />
      </div>
      <button
        className={`btn no_focus search_btn ${active ? "active" : ""}`}
        onClick={toggleActive}
        id="search_btn"
      >
        <i
          className={active ? "fas fa-times " : "far fa-search"}
          aria-hidden="true"
        ></i>
      </button>
    </div>
  );
};

export default SearchInput;
