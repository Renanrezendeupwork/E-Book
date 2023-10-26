import React from "react";
import { Helmet } from "react-helmet";
import getMainCtas from "../../../middleware/main_ctas";
import AnyDevice from "./any_device";
import EasyToUse from "./easy_to_use";
import Hero from "./hero";
import NativeSpeakers from "./native_speakers";
import Questions from "./questions";
import Save40 from "./save_40";
import StreamDigital from "./stream_digital";
import Teachers from "./teachers";
import TechSupport from "./tech_support";

const HomePage: React.FC = () => {
  const main_ctas = getMainCtas();
  return (
    <div className="home_page landing_page">
      <Helmet
        title="The Go-to World Language Digital Reader for Students | Fla
ngoo"
      />
      <Hero main_cta={main_ctas.main} />
      <StreamDigital />
      <NativeSpeakers />
      <Questions />
      <EasyToUse />
      <AnyDevice />
      <TechSupport />
      <Save40 />
      <Teachers />
      <div className=" text-center py-4">
        <a
          href="https://api.flangoo.com/cdn/files/ACTFL_standards_and_Flangoo.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          Download the ACTFL Standards Alignment
          <i className="ml-2 far fa-file-download"></i>
        </a>
        <br />
        <a
          href="https://flangoo-cdn.s3.us-east-2.amazonaws.com/docs/ESSER_Facts_E-Book.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary mt-2"
        >
          Download the ESSER Grant
          <i className="ml-2 far fa-file-download"></i>
        </a>
      </div>
    </div>
  );
};

export default HomePage;
