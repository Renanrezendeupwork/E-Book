import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { LoaderBar } from "../../../middleware/loaders";
import { GET_KEYS } from "./queries";
import { LangItem } from "../../../models/lang";
import { UserItem } from "../../../models/user";
import { ReaderItem } from "../../../models/reader";
import { Helmet } from "react-helmet";

type keyItem = {
  title: string;
  books: ReaderItem[];
};

type hadnleLangsFun = (ev: React.SyntheticEvent<EventTarget>) => boolean;

const AnswerKeys: React.FC = () => {
  const languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "{}"
  );
  const user: UserItem = JSON.parse(localStorage.getItem("user") || "{}");
  const [keys, setKeys] = useState<keyItem[]>([]);
  const [lang, setLang] = useState<string>(user.lang_id || "1");
  const [fetchKeys, { data: answerkeys, loading }] = useLazyQuery(GET_KEYS, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    fetchKeys({
      variables: { lang_id: lang },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    if (answerkeys && answerkeys.books) {
      getAnswerRows(answerkeys.books);
    }
  }, [answerkeys]);

  const handleLangs: hadnleLangsFun = (ev) => {
    // If event target not an HTMLButtonElement, exit
    if (!(ev.currentTarget instanceof HTMLButtonElement)) {
      return false;
    }
    const lang_id = ev.currentTarget.dataset.lang_id;
    if (!lang_id) return false;
    setLang(lang_id);
    return true;
  };

  const getAnswerRows = (books: ReaderItem[]) => {
    const response_rows: { [k: string]: keyItem } = {};
    books
      .sort((a, b) => (a.title > b.title ? 1 : -1))
      .forEach((book) => {
        if (!response_rows[book.level.id]) {
          response_rows[book.level.id] = {
            title: book.level.name,
            books: [],
          };
        }
        response_rows[book.level.id].books.push(book);
      });
    setKeys(Object.values(response_rows));
  };

  if (!user.plan || user.plan.payment_method === "FREE") {
    return (
      <main className="first-container">
        <Helmet title="Answer Keys" />
        <div className="container my-5 py-5">
          <h4>
            Answer keys are only available on paid accounts. This is done to
            prevent students from signing up as a teacher to access them.
          </h4>
          <Link to="/youraccount" className="my-2 btn btn-primary green_contain_green">
            Upgrade Membership
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="first-container">
      {loading && <LoaderBar />}
      <div className="container">
        <h1>Answer Keys</h1>
        <h3>Click title to download your answer key.</h3>
        <Langs
          languages={languages}
          selected={lang}
          handleLangs={handleLangs}
        />
        {keys && <KeysData data={keys} />}
      </div>
    </main>
  );
};

const KeysData = ({ data }: { data: keyItem[] }) => (
  <div className="row mb-5">
    {data.map((item) => {
      return (
        <Columns
          books={item.books}
          title={item.title}
          key={`columns_${item.title}`}
        />
      );
    })}
  </div>
);

const Columns = ({ title, books }: { title: string; books: ReaderItem[] }) => (
  <div className="col">
    <h4>{title}</h4>
    {books.map((item) => (
      <div className="key_cont" key={`key_cont_${item.id}`}>
        {item.keys_url ? (
          <a
            href={`${process.env.REACT_APP_SITE_URL}${item.keys_url}`}
            target="_blank"
            rel="noreferrer"
            download
          >
            {item.title} - Answer Key
          </a>
        ) : (
          <p className="text-muted">{item.title} </p>
        )}
        <span className="additional_key">
          {item.guide_url && (
            <a className="small text-muted" href={item.guide_url} download>
              Buy the Teacher's Guide
            </a>
          )}
          {item.print_url && (
            <a className="small text-muted" href={item.print_url} download>
              Buy Printed Books
            </a>
          )}
        </span>
      </div>
    ))}
  </div>
);

const Langs = ({
  languages,
  selected,
  handleLangs,
}: {
  languages: LangItem[];
  selected: string;
  handleLangs: hadnleLangsFun;
}) => (
  <div className="row my-5 border-bottom pb-1">
    {languages &&
      languages.map((item) => (
        <div className="col" key={`lang_btn_${item.id}`}>
          <button
            data-lang_id={item.id}
            className={`btn-block btn ${
              selected === item.id ? "active btn-danger green_contain_green_light" : "btn-link"
            }`}
            onClick={handleLangs}
          >
            {item.name}
          </button>
        </div>
      ))}
  </div>
);

export default AnswerKeys;
