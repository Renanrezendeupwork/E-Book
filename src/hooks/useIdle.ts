import { useEffect, useState } from "react";
import createActivityDetector from "activity-detector";

type Options = {
  timeToIdle?: number;
  initialState?: "idle" | "active";
  autoInit?: boolean;
  activityEvents?: ActivityEvents[];
  inactivityEvents?: InactivityEvents[];
  ignoredEventsWhenIdle?: ActivityEvents[];
};

type ActivityEvents =
  | "click"
  | "mousemove"
  | "keydown"
  | "DOMMouseScroll"
  | "mousewheel"
  | "mousedown"
  | "touchstart"
  | "touchmove"
  | "focus";
type InactivityEvents = "blur" | "visibilitychange";

function useIdle(options: Options) {
  const [isIdle, setIsIdle] = useState(false);
  useEffect(() => {
    const activityDetector = createActivityDetector(options);
    activityDetector.on("idle", () => setIsIdle(true));
    activityDetector.on("active", () => setIsIdle(false));
    return () => activityDetector.stop();
  }, [options]);
  return isIdle;
}

export default useIdle;
