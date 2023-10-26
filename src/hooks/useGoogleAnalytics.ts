import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";

const useGoogleAnalytics = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);
  const is_production: boolean = process.env.REACT_APP_PROD === "prod";

  useEffect(() => {
    if (is_production) {
      ReactGA.initialize("UA-41196061-19");
      setInitialized(true);
    }
    console.log("useGoogleAnalytics.ts:15 | is_production", is_production);
  }, [is_production]);

  useEffect(() => {
    if (initialized && location) {
      ReactGA.pageview(location.pathname + location.search);
    }
  }, [initialized, location]);
};

export default useGoogleAnalytics;
