import React from "react";
import { prevVideoType } from "./models";

type RewatchProps = {
  prevVideos: prevVideoType[];
  title: string;
  subtitle: string;
};
const Rewatch: React.FC<RewatchProps> = ({ prevVideos, title, subtitle }) => {
  ///make an arrays of arrays of 5
  const prevVideosArr = [];
  let tempArr = [];
  for (let i = 0; i < prevVideos.length; i++) {
    tempArr.push(prevVideos[i]);
    if (tempArr.length === 7 || i === prevVideos.length - 1) {
      prevVideosArr.push(tempArr);
      tempArr = [];
    }
  }

  return (
    <>
      <hr className="text-white" />
      <div className="card ">
        <div className="card-body bg-white rounded">
          <h4 className="card-title ">{title}:</h4>
          <h6 className="card-text ">{subtitle}</h6>
          {prevVideosArr.map((videos, key) => (
            <div className="card-deck mb-3" key={`card_deck_video${key}`}>
              {videos.map((item, key) => (
                <PrevVideo video={item} key={`PrevVideo_${key}`} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

type PrevVideoProps = {
  video: prevVideoType;
};
const PrevVideo: React.FC<PrevVideoProps> = ({ video }) => (
  <div className="card ">
    <a
      className="btn video-link p-0"
      target={"_blank"}
      rel="noopener noreferrer"
      href={video.to}
    >
      <i className="fas fa-play-circle"></i>
      <img src={video.image} className="card-img-top" alt={video.title} />
    </a>
    <div className="card-body">
      <p className="text-dark m-0">{video.title}</p>
    </div>
    <div className="card-footer">
      <small className="card-text">{video.date}</small>
    </div>
  </div>
);

export default Rewatch;
