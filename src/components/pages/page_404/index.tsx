import React from "react";
import { IconJumbotron } from "../../common/icons";

const Page_404: React.FC = () => (
  <main className="first-container  m">
    <div className="text-center my-5">
      <IconJumbotron
        icon="fas fa-exclamation-triangle"
        txt="404"
        txt_classes="mt-3"
        help_text="Page not found"
        cta={{
          txt: "Go back to home",
          classes: "btn btn-primary",
          link: "/",
        }}
      />
    </div>
  </main>
);

export default Page_404;
