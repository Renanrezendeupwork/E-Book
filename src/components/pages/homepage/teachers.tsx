import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

type teachersDataType = {
  id: number;
  image: string;
  captions: string;
  video: string;
  title: string;
  langs: string[];
  place?: string;
};

type videoType = {
  video: HTMLVideoElement;
  item: HTMLDivElement;
};

const Teachers: React.FC = () => {
  const [video, setVideo] = useState<videoType | null>(null);
  const [loop, setLoop] = useState<boolean>(true);

  const teachers_data: teachersDataType[] = [
    {
      id: 693595273,
      image: process.env.REACT_APP_CDN_IMG + "Testimonial_Diana_Website.png",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Diana_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/testimonial_diana.mp4",
      title: "Teacher Testimonial | Diana",
      place: "",
      langs: ["Spanish"],
    },
    {
      id: 686054539,
      image: process.env.REACT_APP_CDN_IMG + "Testimonial_Kelly.png",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Kelly_Website.vtt",
      video:
        "https://tupuedes.b-cdn.net/flg/testimonial_kelly_website_.mp4.mp4",
      title: "Teacher Testimonial | Kelly",
      place: "",
      langs: ["Spanish"],
    },
    {
      id: 684359394,
      image: process.env.REACT_APP_CDN_IMG + "Martha.png",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Martha_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/testimonial_martha_flangoo.mp4",
      title: "Teacher Testimonial | Martha",
      place: "",
      langs: ["Spanish"],
    },
    {
      id: 591142054,
      image: process.env.REACT_APP_CDN_IMG + "Connie.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Connie_Website.vtt",
      video:
        "https://tupuedes.b-cdn.net/flg/testimonial_connie_website.mp4.mp4",
      title: "Teacher Testimonial | Connie",
      place: "Brevard, North Carolina",
      langs: ["Spanish"],
    },
    {
      id: 591143990,
      image: process.env.REACT_APP_CDN_IMG + "Dagnah.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Dagnah_Website.vtt",
      video:
        "https://tupuedes.b-cdn.net/flg/testimonial_dagnah_website.mp4.mp4",
      title: "Teacher Testimonial | Dagnah",
      place: "Carrollton, Georgia",
      langs: [],
    },
    {
      id: 591144491,
      image: process.env.REACT_APP_CDN_IMG + "Tania.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Tania_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/testimonial_tania_website.mp4.mp4",
      title: "Teacher Testimonial | Tania",
      place: "",
      langs: [],
    },
    {
      id: 586414439,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_1.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Angie_T_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_angie.mp4",
      title: "Teacher Testimonial | Angie",
      place: "Iowa",
      langs: ["Spanish"],
    },
    {
      id: 586415307,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_2.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Bess_K_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_bess.mp4",
      title: "Teacher Testimonial | Bess",
      place: "Virginia",
      langs: ["Spanish"],
    },
    {
      id: 586416282,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_3.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Christa_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_christa.mp4",
      title: "Teacher Testimonial | Christy",
      place: "Bay City, Mi",
      langs: ["French", "Michigan"],
    },
    {
      id: 586416915,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_4.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Kem_O_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_kem.mp4",
      title: "Teacher Testimonial | Kem",
      langs: ["Spanish"],
    },
    {
      id: 586417674,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_5.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Kim_M_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_kim.mp4",
      title: "Teacher Testimonial | Kim",
      langs: ["Spanish"],
    },
    {
      id: 586418409,
      image: process.env.REACT_APP_CDN_IMG + "Rectangle_6.jpg",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Lynne_H_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/teacher_testimonial_lynne.mp4",
      title: "Teacher Testimonial | Lynne",
      langs: ["German"],
    },
    {
      id: 605835917,
      image: process.env.REACT_APP_CDN_IMG + "Beth.png",
      captions:
        process.env.PUBLIC_URL + "/captions/Testimonial_Beth_Website.vtt",
      video: "https://tupuedes.b-cdn.net/flg/testimonial_beth_website.mp4",
      title: "Teacher Testimonial | Beth",
      langs: ["Spanish"],
    },
  ];

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
      slidesToSlide: 3,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      partialVisibilityGutter: 30,
    },
  };
  const showVideo = (video_id: number) => {
    setLoop(false);
    const set_video = {
      video: document.getElementById(
        "home_video_" + video_id
      ) as HTMLVideoElement,
      item: document.getElementById("video_item_" + video_id) as HTMLDivElement,
    };
    set_video.item.classList.add("active");
    document.getElementById("video_container_full")?.classList.add("active");
    document.getElementsByTagName("body")[0].classList.add("no-scroll");
    set_video.video.play();
    set_video.video.textTracks[0].mode = "showing";
    setVideo(set_video);
  };

  const hideVideo = () => {
    setLoop(true);
    if (!video) return;
    video.item.classList.remove("active");
    video.video.pause();
    document.getElementsByTagName("body")[0].classList.remove("no-scroll");
    document.getElementById("video_container_full")?.classList.remove("active");
  };
  return (
    <div className="section teachers_section py-4" id="teachers_section">
      <div className="container-fluid">
        <h3 className="mt-0">Hear What World Language Teachers Are Saying</h3>
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={loop}
          containerClass="carousel"
          removeArrowOnDeviceType={["tablet", "mobile"]}
          draggable={true}
        >
          {teachers_data.map((item) => (
            <div className="px-2 hovered" key={`teacher_image${item.id}`}>
              <img
                src={item.image}
                className="w-100 hovered"
                alt="teacher profile"
                onClick={showVideo.bind(this, item.id)}
              />
            </div>
          ))}
        </Carousel>

        <p className="text-center">Click on the teacher picture to watch </p>
      </div>
      <div
        className="video_container_full animate_all "
        id="video_container_full"
      >
        <button className="btn close" onClick={hideVideo}>
          <i className="fal fa-times text-white fa-2x" aria-hidden="true"></i>
        </button>
        <TeacherVideos teachers_data={teachers_data} hideVideo={hideVideo} />
      </div>
    </div>
  );
};

type TeacherVideosProps = {
  teachers_data: teachersDataType[];
  hideVideo: any;
};

const TeacherVideos: React.FC<TeacherVideosProps> = ({
  teachers_data,
  hideVideo,
}) => {
  const videos: any[] = [];
  teachers_data.forEach((item: any) => {
    videos.push(
      <div
        className="video_item hover"
        id={`video_item_${item.id}`}
        key={item.id}
      >
        <video id={`home_video_${item.id}`} onClick={hideVideo}>
          <source src={item.video} type="video/mp4" />
          <track
            label="English"
            kind="subtitles"
            srcLang="en"
            src={item.captions}
            default={true}
          />
          Your browser does not support the video tag.
        </video>
        <h3>{item.title}</h3>
        <p>{item.place}</p>
        {item.langs.map((lang: string) => (
          <span
            className="badge badge-primary mr-1"
            key={`lang_${lang}_${item.id}`}
          >
            {lang}{" "}
          </span>
        ))}
      </div>
    );
  });
  return <div className="videos">{videos}</div>;
};

export default Teachers;
