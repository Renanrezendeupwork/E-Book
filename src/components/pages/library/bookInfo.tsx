import React, { useEffect, useRef, useState, useContext } from "react";
import { AnalyticsContext } from "../../../context/analytics-context";
import { Link } from "react-router-dom";
import { ReaderItem } from "../../../models/reader";
import { UserItem } from "../../../models/user";
import { renderBuyText } from "../../../middleware/common-functions";
import { LoaderSpin } from "../../../middleware/main_loader";
import useInterval from "../../../hooks/useInterval";

type BookInfoProps = {
  reader: ReaderItem;
  goBack: any;
  playVideo?: any;
  user: UserItem;
};

const BookInfo: React.FC<BookInfoProps> = ({ reader, goBack, user }) => {
  const video_ref = useRef<HTMLVideoElement>(null);
  const [video, setVideo] = useState({ play: false });
  const [viewTimer, setViewTimer] = useState(0);
  const [bgimage, setBgImage] = useState<undefined | false | string>(false);
  const analyticsContext = useContext(AnalyticsContext);

  useEffect(() => {
    // save event to google analytics
    const event = {
      category: "Reader",
      action: "LibraryView",
      label: `${reader.id}`,
      value: 1,
    };
    analyticsContext.event(event);
    setBgImage(false);
    ////image loader
    if (reader.images?.poster) {
      const image = new Image();
      image.src = reader.images.poster;
      const showloader = setTimeout(() => {
        setBgImage(undefined);
      }, 1500);
      image.onload = function () {
        clearTimeout(showloader);
        setBgImage(image.src);
      };
      image.onerror = function () {
        clearTimeout(showloader);
        setBgImage(false);
      };
    }

    return () => {
      // save event to google analytics
      const event = {
        category: "Reader",
        action: "TimeSpentLibrary",
        label: `${reader.id}`,
        value: viewTimer,
      };
      if (viewTimer) {
        analyticsContext.event(event);
      }
      setViewTimer(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reader]);

  useInterval(() => {
    if (document.hasFocus()) {
      setViewTimer((viewTimer) => viewTimer + 1);
    }
  }, 1000);

  const handlePlayVideo = () => {
    const set_video = { ...video };
    set_video.play = !set_video.play;
    if (set_video.play && video_ref.current) {
      video_ref.current.play();
    }
    setVideo(set_video);
  };

  const triggerClick = (ev: any) => {
    const action = ev.target.dataset.action;
    if (!action) return;
    const event = {
      category: "Reader",
      action: action,
      label: `${reader.id}`,
      value: 1,
    };
    analyticsContext.event(event);
  };

  return (
    <div className="book_info" id="book_info">
      <div className="row">
        <div className="col-lg-4">
          <div className="book_cover">
            {bgimage ? (
              <img src={reader.images?.thumb} alt="Reader Cover" />
            ) : bgimage === false ? null : (
              <LoaderSpin full={true} align="center" />
            )}
          </div>
        </div>
        <div className="col-lg-8 p-1 px-3">
          <div className="d-flex justify-content-beetween">
            <button className="btn back_btn mr-auto" onClick={goBack}>
              <i className="fa fa-angle-left" aria-hidden="true"></i> Back
            </button>
            <Link
              to={`/rate/${reader.url}/${reader.id}`}
              className="btn text-light rate_link"
            >
              <i className="fa fa-star mr-2" aria-hidden="true"></i>
              <i className="far fa-star mr-2" aria-hidden="true"></i> Rate This Book
            </Link>
          </div>
          <h1>{reader.title}</h1>
          {reader.categories.findIndex((c) => c.id === "19") >= 0 ? (
            <h4
              style={{
                color: "#efff00",
              }}
            >
              Limited Time! Available through June 30, 2023
            </h4>
          ) : null}
          {reader.coming_soon ? (
            <div className="alert"> Coming Soon</div>
          ) : null}
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
          <div
            className="book_desc_info mt-4 custom_scrollbar"
            dangerouslySetInnerHTML={{ __html: reader.description_short }}
          ></div>
          {reader.coming_soon ? null : (
            <BookCtas reader={reader} user={user} triggerClick={triggerClick} />
          )}
          {reader.video_url ? (
            <button className="btn video_btn" onClick={handlePlayVideo}>
              <i className="fa-3x fas fa-play mb-2"></i> <br />
              Play Video Trailer
            </button>
          ) : null}
          {reader.video_url ? (
            <div className={`video_container ${video.play ? "active" : ""}`}>
              <video
                controls={true}
                onPause={handlePlayVideo}
                ref={video_ref}
                controlsList="nodownload"
              >
                <source src={reader.video_url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

type BookCtasProps = {
  reader: ReaderItem;
  user: UserItem;
  triggerClick: (ev: any) => void;
};
const BookCtas: React.FC<BookCtasProps> = ({ reader, user, triggerClick }) => (
  <div className="book_ctas">
    <Link
      to={`/reader/${reader.url}/${reader.id}${
        reader.user_chapter
          ? `/${reader.user_chapter}`
          : reader.has_prereading
          ? "/pre-reading"
          : ""
      }`}
      className="btn btn-danger btn-lg green_contain_green"
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
        className="btn text-light btn-lg green_contain_trans"
      >
        <i className="fa mr-2 fa-reply" aria-hidden="true"></i>{" "}
        <span className="xs_hidden">Start From</span> the Beginning
      </Link>
    ) : null}
    {/* <Link
      to={`/bookdetails/${reader.url}/${reader.id}${
        reader.has_prereading ? "/pre-reading" : ""
      }`}
      className="btn text-light btn-lg green_contain_trans"
    >
      <i className="mr-2 fas fa-book" aria-hidden="true"></i>{" "}
      {user.is_teacher ? "Students Data" : "View More"}
    </Link> */}

    {reader.vocab_url ? (
      <a
        href={`${process.env.REACT_APP_SITE_URL}${reader.vocab_url}`}
        download="true"
        target="_blank"
        onClick={triggerClick}
        data-action="DownloadVocabClick"
        rel="noreferrer"
        className="btn btn-primary btn-lg green_contain_trans"
      >
        <i className="fal fa-file-signature" aria-hidden="true"></i> Words to
        Know (download)
      </a>
    ) : null}
    {user.is_teacher && reader.print_url ? (
      <a
        target="_blank"
        href={reader.print_url}
        onClick={triggerClick}
        data-action="PrintUrlClick"
        rel="noreferrer"
        className="btn btn-outline-light ml-2"
      >
        {renderBuyText(reader.categories)}
      </a>
    ) : null}
  </div>
);

export default BookInfo;
