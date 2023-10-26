import React from "react";
import { Helmet } from "react-helmet";

const WhatPeopleSay: React.FC = () => (
  <div className="bg_gray what_people_say">
    <Helmet>
      <script
        async
        defer
        src="https://widgets.boast.io/current/components.js"
      ></script>
    </Helmet>
    <div
      data-boast-component="boast-display-widget"
      data-widget-id="5b2f80fc-07e7-48a6-b227-a12f6ec6d7b1"
    ></div>
  </div>
);

export default WhatPeopleSay;
