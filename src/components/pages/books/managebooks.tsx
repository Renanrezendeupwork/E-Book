import React from "react";
import { Link } from "react-router-dom";

import { ToggleSwitch } from "../../common/ui_elements";
import { IconTootip, RatingStars } from "../../common/icons";
import { ReaderItem } from "../../../models/reader";
import { AllType } from ".";
import { sortArray, SortBy } from "../../../hooks/useSort";
import { ThSort } from "../../common/ui_elements";

type ManageBooksProps = {
  readers: ReaderItem[];
  loading: boolean;
  toggleDisabled: any;
  toggleAll: any;
  toggleAllGlossary: any;
  toggleGlossary: any;
  all: AllType;
  handle_sort: any;
  sort_by: SortBy;
};
const ManageBooks: React.FC<ManageBooksProps> = ({
  readers,
  toggleDisabled,
  toggleAll,
  toggleAllGlossary,
  all,
  toggleGlossary,
  loading,
  handle_sort,
  sort_by,
}): JSX.Element => {
  const data: ReaderItem[] = sortArray(readers, sort_by.by, sort_by.sort);
  return (
    <table
      className={`animate_all table bg-light books_table mt-8 table-hover ${
        loading ? "opacity_8 un_clicked" : ""
      }`}
    >
      <thead>
        <tr>
          <ThSort
            handle_sort={handle_sort}
            title="Title"
            id="title"
            colSpan={2}
            type={sort_by.by === "title" ? sort_by.sort : undefined}
          />
          <ThSort
            handle_sort={handle_sort}
            title="Level"
            id="level.name"
            type={sort_by.by === "level.name" ? sort_by.sort : undefined}
            colSpan={1}
          />
          <ThSort
            handle_sort={handle_sort}
            title="Rating"
            id="rating"
            type={sort_by.by === "rating" ? sort_by.sort : undefined}
            colSpan={1}
          />
          <th colSpan={1}>
            Active{" "}
            <IconTootip
              id="Active"
              icon="far fa-info-circle"
              tooltip_txt="Show/Hide book for this class group"
            />
            <ToggleSwitch
              classes="ml-2"
              lables={false}
              small
              inline
              disabled={all.readers}
              click={toggleAll.bind(this, "all")}
              id={"35465"}
            />
          </th>
          <th colSpan={1}>
            Glossary{" "}
            <IconTootip
              id="Glossary"
              icon="far fa-info-circle"
              tooltip_txt="Choose either a basic list of underlined translations or a more robust option for beginning readers"
            />
            <ToggleSwitch
              classes="ml-2"
              lables={false}
              small
              inline
              colored={false}
              disabled={all.glossary}
              click={toggleAllGlossary.bind(
                this,
                all.glossary === false || all.glossary === "neutral"
                  ? true
                  : false
              )}
              id={"354543"}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((reader) => (
          <ReaderRow
            key={`reader_row_${reader.id}`}
            reader={reader}
            toggleDisabled={toggleDisabled}
            toggleGlossary={toggleGlossary}
          />
        ))}
      </tbody>
    </table>
  );
};

const ReaderRow = ({
  reader,
  toggleDisabled,
  toggleGlossary,
}: {
  reader: ReaderItem;
  toggleDisabled: any;
  toggleGlossary: any;
}) => (
  <tr>
    <td className="img_td">
      <img src={reader.images.thumb} alt={reader.title} draggable="false" />
    </td>
    <td>
      <Link
        to={`/bookdetails/${reader.url}/${reader.id}`}
        className="text-dark"
      >
        {reader.title}
      </Link>
    </td>
    <td>{reader.level.name}</td>
    <td>
      <RatingStars value={reader.rating} id={`rating_${reader.id}`} />{" "}
    </td>
    <td>
      <ToggleSwitch
        disabled={reader.disabled}
        click={toggleDisabled}
        id={reader.id}
        lables={false}
      />
    </td>

    <td>
      <ToggleSwitch
        disabled={
          reader.glossary_less === undefined || reader.glossary_less === null
            ? true
            : reader.glossary_less
        }
        click={toggleGlossary}
        id={reader.id}
        lables={false}
        lables_txt={{ disabled: "Less", enabled: "More" }}
        colored={false}
      />
    </td>
  </tr>
);

export default ManageBooks;
