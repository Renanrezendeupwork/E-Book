import React from "react";
import { Link } from "react-router-dom";
import { renderBuyText } from "../../../middleware/common-functions";
import { ReaderItem } from "../../../models/reader";
import { UserItem } from "../../../models/user";
import { RatingStars } from "../../common/icons";

type BookInfoProps = {
  reader: ReaderItem;
  goBack: any;
  playVideo?: any;
  user: UserItem;
};

const BookInfo: React.FC<BookInfoProps> = ({
  reader,
  goBack,
  user,
  playVideo,
}) => (
  <div className="book_info" id="book_info">
    <div className="row">
      <div className="col-lg-4">
        <div className="book_cover">
          <img
            src={reader.images?.thumb}
            className="book_cover_xs"
            alt="Reader Cover"
          />
        </div>
      </div>
      <div className="col-lg-8 px-3">
        <div className="d-flex justify-content-between">
          <button className="btn back_btn" onClick={goBack}>
            <i className="fa fa-angle-left" aria-hidden="true"></i> Back
          </button>
          <div className="d-flex">
            {user.is_teacher ? (
              <div className="rating_group">
                <RatingStars
                  gold={false}
                  id="teacher_rating"
                  value={reader.rating_teachers}
                />
                Teacher's Rating{" "}
              </div>
            ) : null}
            {user.is_teacher ? (
              <div className="rating_group teachers">
                <RatingStars
                  gold={false}
                  id="students_rating"
                  value={reader.rating_students}
                />
                My students{" "}
              </div>
            ) : null}
            <div className="rating_group teachers">
              <RatingStars gold={false} id="students_rating" value={reader.rating} />
              Global
            </div>
          </div>

        </div>
        <div>
          <h1>{reader.title}</h1>
          <span className="badge badge-dark">{reader.level.name}</span>
          <span className="badge badge-dark">{reader.chapters} Chapters</span>
          {user.is_teacher &&
          reader.chapter_questions &&
          reader.chapter_questions > 1 ? (
            <span className="badge badge-dark">
              {reader.chapter_questions} Quiz Questions
            </span>
          ) : null}
          <span className="badge badge-dark">{reader.language.name}</span>
          <div className="book_desc_info custom_scrollbar mt-1" dangerouslySetInnerHTML={{ __html: reader.description_short }}></div>
        </div>
        <div className="book_ctas">
          <Link
            to={`/reader/${reader.url}/${reader.id}${
              reader.user_chapter
                ? `/${reader.user_chapter}`
                : reader.has_prereading
                ? "/pre-reading"
                : ""
            }`}
            className="btn btn-danger green_contain_green"
          >
            <b>
              <span>
                {reader.user_chapter ? (
                  <i className="mr-2 fas fa-bookmark"></i>
                ) : (
                  <i className="mr-2 fas fa-book"></i>
                )}
              </span>{" "}
              {reader.user_chapter ? "Continue " : "Start "}
              <span className="xs_hidden">Reading</span>
            </b>
          </Link>
          {reader.user_chapter ? (
            <Link
              to={`/reader/${reader.url}/${reader.id}${
                reader.has_prereading ? "/pre-reading" : ""
              }`}
              className="btn text-light green_contain_gray"
            >
              <i className="fa mr-2 fa-reply" aria-hidden="true"></i>{" "}
              <span className="xs_hidden">Start From</span> the Beginning
            </Link>
          ) : null}
          <Link
            to={`/rate/${reader.url}/${reader.id}`}
            className="btn text-light rate_link green_contain_gray"
          >
            <i className="fa fa-star mr-2" aria-hidden="true"></i> Rate This Book
          </Link>
          {reader.vocab_url ? (
            <a
              href={`${process.env.REACT_APP_SITE_URL}${reader.vocab_url}`}
              download="true"
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary green_contain_green_light"
            >
              <i className="fal fa-file-signature" aria-hidden="true"></i> Words to
              Know (download)
            </a>
          ) : null}
          {user.is_teacher && reader.print_url ? (
            <a
              target="_blank"
              href={reader.print_url}
              rel="noreferrer"
              className="btn btn-outline-light green_outline_gray"
            >
              {renderBuyText(reader.categories)}
            </a>
          ) : null}
        </div>
        {reader.video_url ? (
          <button className="btn video_btn" onClick={playVideo}>
            <i className="fa-3x fas fa-play"></i> <br />
            Play Video Trailer
          </button>
        ) : null}
      </div>
    </div>
  </div>
);
export default BookInfo;
