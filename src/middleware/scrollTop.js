import { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { AnalyticsContext } from "../context/analytics-context";

const ScrollToTop = (props) => {
  const analyticsContext = useContext(AnalyticsContext);
  const [prevLocation, setLocation] = useState(null);
  useEffect(() => {
    ///send analytics view
    if (props.location.pathname !== prevLocation) {
      analyticsContext.view(props.location.pathname);
      window.scrollTo(0, 0);
      setLocation(props.location.pathname);
    }
    // eslint-disable-next-line
  }, [props]);
  return props.children;
};

export default withRouter(ScrollToTop);
