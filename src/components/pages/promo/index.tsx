import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useLazyQuery } from "@apollo/client";

import ApprovedVendor from "./approved_vendor";
import PromoHero from "./promo_hero";
import Section1 from "./section1";
import { GETWHOLESAER } from "./queries";
import { Wholesaler } from "../../../models/wholesaler";

const PromoPage: React.FC = () => {
  const { wholesaler_code } = useParams<{ wholesaler_code: string }>();
  const [getWholesaler, { data, loading }] = useLazyQuery<{
    getWholesaer: Wholesaler;
  }>(GETWHOLESAER, {
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    ///set cookie if utm_source is set
    if (window.location.search.includes("utm_source")) {
      setCookie("utm_source", window.location.search.split("?")[1]);
    }
    if (wholesaler_code) {
      setCookie("wholesaler_code", wholesaler_code);
      getWholesalerInfo(wholesaler_code);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wholesaler_code]);

  const getWholesalerInfo = async (wholesaler_code: string) => {
    getWholesaler({ variables: { code: wholesaler_code } });
  };

  return (
    <div className="landing_page front_face">
      <Helmet title="Redeem Invitation" />
      <PromoHero wholesaler={data?.getWholesaer} loading={loading} />
      <Section1 />
      <ApprovedVendor remove_ctas={true} />
    </div>
  );
};

function setCookie(cname: string, cvalue: string) {
  const d = new Date();
  d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export default PromoPage;
