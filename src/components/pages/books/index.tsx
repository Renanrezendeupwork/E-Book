import React, { useEffect, useState } from "react";
import { useLazyQuery, useQuery, useMutation } from "@apollo/client";
import { useHistory, useParams } from "react-router-dom";
import { IconJumbotron } from "../../common/icons";
import { ToggleSwitch, SelectGroup } from "../../common/ui_elements";
import {
  GET_READERS,
  GET_CLASSES,
  DISABLE_BOOKS,
  TOGGLE_GLOSSARY,
} from "./queries";
import {
  LoaderDots,
  LoaderPuff,
  BlockPageLoader,
} from "../../../middleware/loaders";
import { LangItem } from "../../../models/lang";
import { CatItem, ReaderItem } from "../../../models/reader";
import ManageBooks from "./managebooks";
import useSort from "../../../hooks/useSort";

interface CatLocalItem extends CatItem {
  is_level: boolean;
  hasbooks: ReaderItem[];
  disabled: boolean | "neutral";
}
export type AllType = {
  readers: boolean | "neutral";
  glossary: boolean | "neutral";
};

const BooksPage: React.FC = () => {
  const { group_id, language_id } = useParams<{
    group_id: string;
    language_id: string;
  }>();
  const history = useHistory();
  const [sort_by, setSort] = useSort({
    by: "title",
    sort: "asc",
  });
  const languages: LangItem[] = JSON.parse(
    localStorage.getItem("local_languages") || "[]"
  );
  const categories: CatItem[] = JSON.parse(
    localStorage.getItem("local_categories") || "[]"
  );

  const { data: db_classes, loading: loading_classes } = useQuery(GET_CLASSES);
  const [fetchReaders, { data: db_readers, loading }] = useLazyQuery(
    GET_READERS,
    { fetchPolicy: "network-only" }
  );
  const [disableReaders] = useMutation(DISABLE_BOOKS);
  const [toggleGlossary] = useMutation(TOGGLE_GLOSSARY);
  const [readers, setReaders] = useState<ReaderItem[]>([]);
  const [loadingState, setLoading] = useState(false);
  const [all, setAll] = useState<AllType>({
    readers: true,
    glossary: true,
  });
  const [lang_id, setLangid] = useState<string | false>(false);
  const [class_id, setClassid] = useState<string | false>(false);
  const [by_categories, setByCategories] = useState<CatLocalItem[]>([]);
  const [by_level, setByLevel] = useState<CatLocalItem[]>([]);
  const lang_options = languages.map((item: LangItem) => {
    return { value: item.id, txt: item.name };
  });

  useEffect(() => {
    if (language_id) {
      setLangid(language_id);
    }
    if (group_id) {
      setClassid(group_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (class_id && lang_id) {
      fetchReaders({ variables: { lang_id, class_id } });
    }
    history.push({
      pathname: `/books${class_id ? `/${class_id}` : ""}${
        lang_id ? `/${lang_id}` : ""
      }`,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang_id, class_id]);

  useEffect(() => {
    if (db_readers) {
      setReaders(db_readers.books);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db_readers]);

  useEffect(() => {
    if (readers) {
      const set_by_categories: CatLocalItem[] = [];
      const set_by_level: CatLocalItem[] = [];
      let all_active: boolean | "neutral" = false;
      let all_glossary: boolean | "neutral" = false;
      categories.forEach((cat) => {
        const item: CatLocalItem = {
          ...cat,
          hasbooks: [],
          disabled: false,
        };
        if (item.is_level) {
          let disabled: boolean | string = false;
          item.hasbooks = readers.filter((book) => book.level_id === cat.id);
          item.hasbooks.forEach((book: ReaderItem) => {
            if (book.disabled) {
              disabled = true;
              all_active = true;
            } else {
              if (disabled) {
                all_active = "neutral";
                disabled = "neutral";
              }
            }
            if (all_glossary === false) {
              if (book.glossary_less) {
                all_glossary = true;
              }
            }
          });
          item.disabled = disabled;
          set_by_level.push(item);
        } else {
          let disabled: boolean | string = false;
          item.hasbooks = readers.filter((book) =>
            book.categories.find((category: CatItem) => category.id === cat.id)
          );
          item.hasbooks.forEach((book) => {
            if (book.disabled === true) {
              disabled = true;
              all_active = true;
            } else {
              if (disabled === true) {
                all_active = "neutral";
                disabled = "neutral";
              }
            }
          });
          item.disabled = disabled;
          if (item.hasbooks.length >= 1) set_by_categories.push(item);
        }
      });
      ///check if disabled cats or levels
      setByCategories(set_by_categories);
      setByLevel(set_by_level);
      setAll({
        readers: all_active,
        glossary: all_glossary,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readers]);

  const selectClass = (ev: { target: HTMLInputElement }) => {
    const selected_class = ev.target.value;
    setClassid(selected_class);
  };

  const selectLang = (ev: { target: HTMLInputElement }) => {
    const selected_lang = ev.target.value;
    setReaders([]);
    setLangid(selected_lang);
  };

  const toggleDisableBooks = (ev: { target: HTMLInputElement }) => {
    const { id: book_id } = ev.target.dataset;
    if (!book_id || loadingState) return;
    const current_readers = [...readers];
    const selected_index = current_readers.findIndex(
      (book) => book.id === book_id
    );
    const selected_reader = current_readers[selected_index];
    selected_reader.disabled = !selected_reader.disabled;
    disableHandle([book_id], selected_reader.disabled);
    setReaders(current_readers);
  };

  const toggleGlossaryHandle = (ev: { target: HTMLInputElement }) => {
    const { id: book_id } = ev.target.dataset;
    if (!book_id) return;
    const current_readers = [...readers];
    const selected_index = current_readers.findIndex(
      (book) => book.id === book_id
    );
    const selected_reader = current_readers[selected_index];
    selected_reader.glossary_less =
      selected_reader.glossary_less === undefined ||
      selected_reader.glossary_less === null
        ? false
        : !selected_reader.glossary_less;

    toggleGlossary({
      variables: {
        books_ids: [book_id],
        class_id,
        show_less: selected_reader.glossary_less,
      },
    });
    setReaders(current_readers);
  };

  const disableHandle = async (books_ids: string[], disable: boolean) => {
    if (loadingState) return;
    setLoading(true);
    await disableReaders({ variables: { books_ids, class_id, disable } });
    setLoading(false);
  };

  const toggleBy = (type: string, ev: { currentTarget: HTMLInputElement }) => {
    if (!type || loadingState) return false;
    const { id: group_id } = ev.currentTarget.dataset;
    const current_readers = [...readers];
    const current_categories = [...by_categories];
    const current_level = [...by_level];
    let books_ids;
    let disable = true;
    if (type === "level") {
      books_ids = readers
        .filter((book) => book.level_id === group_id)
        .map((item) => {
          if (item.disabled) {
            disable = false;
          }
          return item.id;
        });
      const finded = current_level.findIndex((level) => level.id === group_id);
      if (finded >= 0) {
        current_level[finded].disabled = disable;
      }
    } else if (type === "categories") {
      books_ids = readers
        .filter((book) => {
          const finded = book.categories.filter((cat) => cat.id === group_id);
          return finded.length > 0;
        })
        .map((item) => {
          if (item.disabled) {
            disable = false;
          }
          return item.id;
        });
      const finded = current_categories.findIndex(
        (level) => level.id === group_id
      );
      if (finded >= 0) {
        current_categories[finded].disabled = disable;
      }
    } else if (type === "all") {
      books_ids = readers.map((item) => {
        if (item.disabled) {
          disable = false;
        }
        return item.id;
      });
    }
    if (!books_ids || books_ids.length < 1) {
      return false;
    }
    ///update reader state
    books_ids.forEach((book_id) => {
      const selected_index = current_readers.findIndex(
        (book) => book.id === book_id
      );
      const selected_reader = current_readers[selected_index];
      selected_reader.disabled = disable;
    });
    setReaders(current_readers);
    disableHandle(books_ids, disable);
    setByCategories(current_categories);
    setByLevel(current_level);
  };

  const toggleAllGlossary = (active: boolean = false) => {
    const current_readers = [...readers];
    let books_ids;

    books_ids = readers.map((item) => item.id);
    if (!books_ids || books_ids.length < 1) {
      return false;
    }
    ///update reader state
    books_ids.forEach((book_id) => {
      const selected_index = current_readers.findIndex(
        (book) => book.id === book_id
      );
      const selected_reader = current_readers[selected_index];
      selected_reader.glossary_less = active;
    });
    toggleGlossary({
      variables: {
        books_ids: books_ids,
        class_id,
        show_less: active,
      },
    });
    setReaders(current_readers);
  };

  const handleSort = (ev: { currentTarget: HTMLElement }) => {
    const set_sort = { ...sort_by };
    const sort_id = ev.currentTarget.dataset.id;
    if (!sort_id) {
      return;
    }
    if (set_sort.by === sort_id) {
      set_sort.sort = set_sort.sort === "desc" ? "asc" : "desc";
    }
    set_sort.by = sort_id;
    setSort(set_sort);
  };

  return (
    <main className="first-container last-container no_padding">
      {loading || loading_classes ? <LoaderPuff fixed /> : null}
      {loadingState ? <BlockPageLoader text="Saving" /> : null}
      <div className="title_part">
        <div className="container text-center">
          <h1>Manage Books</h1>
          <p>Give your students access only to the books they need.</p>
        </div>
      </div>
      <div className="container data_part">
        <div className="row">
          {db_classes && (
            <SelectGroup
              id="selectClass"
              changeFun={selectClass}
              options={db_classes.classes}
              placeholder="Select a Class Group"
              selected={class_id || undefined}
              title="Manage by Class Group"
            />
          )}
          {class_id && (
            <SelectGroup
              id="selectLang"
              changeFun={selectLang}
              options={lang_options}
              placeholder="Select a Language"
              selected={lang_id || undefined}
              title="Manage by Language"
            />
          )}
        </div>
        {categories.length > 0 && readers.length > 0 ? (
          <GroupToggle
            categories={by_categories}
            level={by_level}
            toggleDisabled={toggleBy}
          />
        ) : null}
        {!class_id && (
          <IconJumbotron
            txt="Please select a class group."
            classes="mt-5 mb-3"
            icon="fal fa-users"
          />
        )}
        {!lang_id && class_id ? (
          <IconJumbotron
            txt="Please select a language to manage."
            classes="mt-5 mb-3"
            icon="fas fa-globe-americas"
          />
        ) : null}
        {readers.length > 0 ? (
          <ManageBooks
            readers={readers}
            toggleAll={toggleBy}
            toggleAllGlossary={toggleAllGlossary}
            toggleDisabled={toggleDisableBooks}
            toggleGlossary={toggleGlossaryHandle}
            loading={loading}
            sort_by={sort_by}
            handle_sort={handleSort}
            all={all}
          />
        ) : (
          loading && <LoaderDots display="large" />
        )}
      </div>
    </main>
  );
};

const GroupToggle = ({
  categories,
  level,
  toggleDisabled,
}: {
  categories: CatLocalItem[];
  level: CatLocalItem[];
  toggleDisabled: any;
}) => (
  <React.Fragment>
    {categories && categories.length ? (
      <TogglerRow
        data={categories}
        title="Toggle Books by Category"
        id="categories-row"
        toggleDisabled={toggleDisabled.bind(this, "categories")}
      />
    ) : null}
    {level && level.length ? (
      <TogglerRow
        data={level}
        title="Toggle Books by Level"
        id="level-row"
        toggleDisabled={toggleDisabled.bind(this, "level")}
      />
    ) : null}
  </React.Fragment>
);

const TogglerRow = ({
  data,
  title,
  id,
  toggleDisabled,
}: {
  data: CatLocalItem[];
  title: string;
  id: string;
  toggleDisabled: any;
}) => (
  <div className="toggler_row mt-3">
    <h5>{title}</h5>
    <div className="row flex-row">
      {data.map((item) => (
        <div
          className="col-md-2 d-flex justify-content-between flex-column"
          key={`${id}_${item.id}`}
        >
          <p>{item.name} Readers</p>
          <ToggleSwitch
            disabled={item.disabled}
            click={toggleDisabled}
            id={item.id}
            lables={false}
          />
        </div>
      ))}
    </div>
  </div>
);

export default BooksPage;
