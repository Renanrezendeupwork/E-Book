import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import "./style.css";

import { getPost } from "../../../middleware/wordpress_api";

type StaticPageProps = {
  post_id: string;
};
const StaticPages: React.FC<StaticPageProps> = ({ post_id }) => {
  const [pageInfo, setPageInfo] = useState("");
  useEffect(() => {
    getPost(post_id).then((data) => {
      setPageInfo(data.content.rendered);
    });
  }, [post_id]);

  return (
    <div className="pt-5 static">
      <Helmet>
        <title>Angelos</title>
      </Helmet>
      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: pageInfo,
        }}
      ></div>
    </div>
  );
};

export default StaticPages;
