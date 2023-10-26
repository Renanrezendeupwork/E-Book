import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { GETSEARCH } from "./queries";
import { useLazyQuery } from "@apollo/client";
import { ReaderItem } from "../../../models/reader";
import { LoaderDots } from "../../../middleware/loaders";
import { IconJumbotron } from "../../common/icons";

const SearchPage: React.FC = () => {
  const { search_string } = useParams<{ search_string: string }>();
  const [getSearch, { data, loading }] = useLazyQuery(GETSEARCH, {
    fetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (search_string) {
      getSearch({ variables: { search: search_string } });
    }
  }, [search_string, getSearch]);

  return (
    <main className="first-container last-container search_page">
      <div className="container mt-3">
        <h1>Search Results for "{search_string}"</h1>
        <hr />
        {loading ? (
          <LoaderDots />
        ) : data && data.getSearch.length > 0 ? (
          <RenderSearch readers={data.getSearch} />
        ) : (
          <IconJumbotron
            icon="far fa-file-search"
            txt="We couldn't find any reader with your search query"
            classes="py-5"
          />
        )}
      </div>
    </main>
  );
};

type RenderSearchProps = {
  readers: ReaderItem[];
};

const RenderSearch: React.FC<RenderSearchProps> = ({ readers }) => {
  const clearSearch = () => {
    const search_input = document.getElementById(
      "search_input"
    ) as HTMLInputElement;
    const search_btn = document.getElementById(
      "search_btn"
    ) as HTMLButtonElement;
    if (search_input) {
      search_input.value = "";
    }
    if (search_btn && search_btn.classList.contains("active")) {
      search_btn.click();
    }
  };
  return (
    <div className="row book_results">
      {readers.map((reader, key) => (
        <div className="col-md-3 mt-3" key={`key_${reader.id}_${key}`}>
          <ReaderBlock reader={reader} onClick={clearSearch} />
        </div>
      ))}
    </div>
  );
};

type ReaderBlockProps = {
  reader: ReaderItem;
  onClick: any;
};

const ReaderBlock: React.FC<ReaderBlockProps> = ({ reader, onClick }) => {
  return (
    <Link to={`/bookdetails/${reader.url}/${reader.id}`} onClick={onClick}>
      <img
        src={reader.images?.cover}
        className="img-fluid"
        style={{borderRadius: "8px"}}
        alt={`${reader.title}`}
      />
    </Link>
  );
};

export default SearchPage;
