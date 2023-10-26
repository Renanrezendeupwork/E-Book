import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_READERS } from "./queries";
import { CatItem, Language, Level, ReaderImages } from "../../../models/reader";
import TitleBlock from "./title_block";
import { Helmet } from "react-helmet";

export type BooksTitlesType = {
  coming_soon: boolean;
  title: string;
  level_id: string;
  image_ver: number;
  images: ReaderImages;
  level: Level;
  language: Language;
  categories: [CatItem];
};

const TitlesPage: React.FC = () => {
  const { data: booksDB } = useQuery<{ booksTitles: BooksTitlesType[] }>(
    GET_READERS
  );
  const [langs, setLangs] = useState<Language[]>([]);

  useEffect(() => {
    if (booksDB) {
      const set_langs: any = {};
      booksDB.booksTitles.forEach((b) => {
        if (!set_langs[b.language.id]) {
          set_langs[b.language.id] = b.language;
        }
      });
      setLangs(Object.values(set_langs));
    }
  }, [booksDB]);

  return (
    <div className="titles_page front_face">
      <Helmet title="A Library of Spanish, French, and German Readers!" />
      <div
        className="hero"
        style={{
          backgroundImage: `url('${process.env.REACT_APP_CDN_IMG}flangoo-bg-books-image.png?v=1')`,
        }}
      ></div>
      <div className="container titles">
        <h1>
          A Library of Spanish, French, and German Readers, with More on the
          Way!
        </h1>
        <p>
          Best-selling readers from authors Mira Canion, Jennifer Degenhardt,
          Deb Navarre, Tom Alsop, Fabiola Canale, and many more. Flangoo also
          features Acquisition™ Readers with comprehension questions, and
          Enhanced™ Readers featuring audio, video, cultural notes, and
          comprehension questions.
        </p>
        {booksDB?.booksTitles
          ? langs.map((lang) => (
              <TitlesRow
                key={`title_Row${lang.id}`}
                lang={lang}
                titles={booksDB.booksTitles.filter(
                  (b) => b.language.id === lang.id
                )}
              />
            ))
          : null}
      </div>
    </div>
  );
};

type TitlesRowProps = {
  lang: Language;
  titles: BooksTitlesType[];
};

const TitlesRow: React.FC<TitlesRowProps> = ({ lang, titles }) => (
  <div className="books_container">
    <h2>{lang.name} Readers</h2>
    <div className="books">
      {titles.map((t) => (
        <TitleBlock key={`title_item${t.title}`} bookTitle={t} />
      ))}
    </div>
  </div>
);

export default TitlesPage;
