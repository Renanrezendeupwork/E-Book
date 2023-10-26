import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { prevVideoType } from "./models";
import Rewatch from "./previous";

type VideoType = {
  id: string;
  image: string;
  title: string;
  date: string;
  time: number;
  start?: number;
};

const videos: VideoType[] = [
  {
    id: `XV_BgVizK1U`,
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/angelos_samalayuca.png",
    title: "Quest #4: Sandboarding Samalayuca ",
    date: "February 28, 2023",
    time: 1677614137,
  },
  {
    id: `NK-FOvVWeuw`,
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/angelos_chapa_corso.png",
    title: "Quest #3: Los Parachicos",
    date: "January 27, 2023",
    time: 1671109100000,
  },
  {
    // Part 4
    id: "zpM6I1nPQrQ",
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/Angelos_Quest_Christmas_Part_4.png",
    title: "Procession from Santo Niño to El Santuario",
    date: "December 12, 2022",
    time: 1671131040000, // December 15, 2022 12:51:24 AM EST
    // time: 1671076560000, // Testing time
  },
  {
    // Part 3
    id: "b2Ex8wizRcc",
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/Angelos_Quest_Christmas_Part_3.png",
    title: "Santuario of Our Lady of Guadalupe",
    date: "December 11, 2022",
    time: 1671122280000, // December 15, 2022 11:38 AM AM EST
    // time: 1671074580000, // Testing time
  },
  {
    // Part 2
    id: "4seJPN_5SzQ",
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/Angelos_Quest_Christmas_Part_2.png",
    title: "Guadalupe fair with vendors",
    date: "December 10, 2022",
    time: 1671117240000, // December 15, 2022 10:14:30 AM EST
    // time: 1671074400000, // Testing time
  },
  {
    // Part 1
    id: "APivz7tF-0Q",
    image:
      "https://flangoo-cdn.s3.us-east-2.amazonaws.com/clean/Angelos_Quest_Christmas_Part_1.png",
    title: "Opening and Los Matachines",
    date: "December 08, 2022",
    time: 1671109200000, // December 15, 2022 8:00 AM EST
    // time: 1671074280000, // Testing time
  },
];
type VideoComponentProps = {
  url: string | false;
};
const VideoComponent: React.FC<VideoComponentProps> = ({ url }) => {
  const [prevVideos, setPrevVideos] = useState<prevVideoType[] | null>(null);
  const videoHeight = isMobile ? 240 : 590;
  ///current timestamp in minutes
  useEffect(() => {
    getActiveVideo();
  }, []);
  const getActiveVideo = () => {
    ///get latest video from videos const accorting to current time
    const getPastVideo = videos
      .sort((a, b) => (a.time > b.time ? 1 : -1))
      .map((video) => {
        return {
          to: `https://youtu.be/${video.id}`,
          image: video.image,
          title: video.title,
          date: video.date,
        };
      });
    if (getPastVideo) setPrevVideos(getPastVideo);
  };

  return (
    <>
      {" "}
      <Iframe
        videoHeight={videoHeight}
        src={`https://www.youtube.com/embed/${
          url ? url : "RlSygH-qPc4"
        }?controls=0&autoplay=1&origin=${process.env.REACT_APP_DOMAIN}`}
      />
      {prevVideos?.length ? (
        <Rewatch
          prevVideos={prevVideos}
          title="Check past broadcasts"
          subtitle=""
        />
      ) : null}
    </>
  );
};

type IframeProps = {
  videoHeight: number;
  width?: string;
  src: string;
};
const Iframe: React.FC<IframeProps> = ({
  videoHeight,
  src,
  width = "100%",
}) => (
  <iframe
    src={src}
    title="A live stream of Teachers Discovery"
    height={videoHeight}
    width={width}
    allowFullScreen
    frameBorder="0"
  ></iframe>
);

export default VideoComponent;
