import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useLazyQuery } from "@apollo/client";
import { BarLoader } from "react-spinners";

import { Wholesaler } from "../../../models/wholesaler";
import Page404 from "../page_404";
import { GETWHOLESAER } from "../promo/queries";

const redirects = [
  {
    from: "/purchaseplan",
    to: "/signin",
  },
  {
    from: "/youraccount",
    to: "/signin",
  },
  {
    from: "/editprofile",
    to: "/signin",
  },
];

const SmartRedirect: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [getWholesaler, { data, loading: gettingWholesaler, called }] =
    useLazyQuery<{
      getWholesaer: Wholesaler;
    }>(GETWHOLESAER, {
      fetchPolicy: "no-cache",
    });
  useEffect(() => {
    const wholesaler_code = window.location.pathname.split("/").join("");
    getWholesaler({ variables: { code: wholesaler_code } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (data) {
      history.push({
        pathname: `/invite/${data.getWholesaer.code}`,
      });
    } else if (gettingWholesaler === false && called) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, gettingWholesaler, called]);

  ///check if url is in redirects
  const redirect = redirects.find((i) => i.from === window.location.pathname);
  if (redirect) {
    history.push({
      pathname: redirect.to,
    });
    return null;
  }

  if (loading) {
    return (
      <main className="smart_redirect first-container full_page_loader">
        <img
          src="https://flangoo-cdn.s3.us-east-2.amazonaws.com/Flangoo_logo_white512.png"
          alt="Flangoo Logo"
        />
        <p>Loading</p>
        <BarLoader color={"#fff"} />
      </main>
    );
  }
  return <Page404 />;
};

export default SmartRedirect;
