import { useLazyQuery } from "@apollo/client";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams } from "react-router-dom";
import { LoaderBar } from "../../../middleware/loaders";
import { LoaderDots } from "../../../middleware/main_loader";
import { PageSettingItem } from "../../../models/pageSettings";
import { IconJumbotron } from "../../common/icons";
import { GETPAGESETTING } from "./queries";

const GeneralPages: React.FC = () => {
  const { setting_name } = useParams<{ setting_name: string }>();
  const [getSettings, { data, loading }] = useLazyQuery<{
    pageSettings: PageSettingItem[];
  }>(GETPAGESETTING);
  useEffect(() => {
    const document_body = document.getElementsByTagName("body")[0];
    if (document_body) {
      document_body.classList.add("white_bg");
    }
    return () => {
      document_body.classList.remove("white_bg");
    };
  }, []);
  useEffect(() => {
    if (setting_name) {
      const type_value = getType(setting_name);
      getSettings({ variables: { types: [type_value] } });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting_name]);

  const getType = (type: string) => {
    switch (type) {
      case "privacypolicy":
        return "privacy_policy";
      case "refundpolicy":
        return "refund_policy";
      case "cookienote":
        return "cookie_note";
      case "cookiepolicy":
        return "cookie_policy";
      default:
        return type;
    }
  };

  if (!data || loading) {
    return (
      <>
        <LoaderBar fixed={true} />
        <LoaderDots standAlone={true} />
      </>
    );
  }
  if (data.pageSettings.length < 1) {
    return (
      <div className="container first-container last-container">
        <IconJumbotron
          icon="fal fa-debug"
          txt="Something went wrong"
          cta={{
            link: "/",
            txt: "Go to back",
            classes: "btn btn-primary ",
          }}
        />
      </div>
    );
  }
  console.log("index.tsx:21 | data", data);

  return (
    <>
      <Helmet title="Digital Spanish, French, and German Readers | Flangoo" />
      <div
        className="container first-container last-container"
        dangerouslySetInnerHTML={{ __html: data.pageSettings[0].description }}
      ></div>
    </>
  );
};

export default GeneralPages;
