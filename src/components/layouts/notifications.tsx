import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { GET_NOTIFICATIONS_COUNT } from "../pages/notifications/queries";

const Notifications: React.FC = () => {
  const { data: notifications } = useQuery(GET_NOTIFICATIONS_COUNT);
  const location = useLocation();
  const history = useHistory();
  const [unread, setUnread] = useState<null | string>(null);

  useEffect(() => {
    if (notifications && notifications.notificationsUnread) {
      setUnread(notifications.notificationsUnread);
    }
  }, [notifications]);

  const handleHref = () => {
    if (location.pathname === "/notifications") {
      if (history.length < 1) {
        history.push({
          pathname: `/`,
        });
      } else {
        history.goBack();
      }
      return;
    }
    history.push({
      pathname: `/notifications`,
    });
  };

  return (
    <button
      className="btn nav-item dropdown notifications no_focus"
      onClick={handleHref}
    >
      <i className="far fa-bell"></i>
      <span
        className="notifications_badge badge badge-danger"
        id="notifications_badge"
      >
        {unread !== "0" ? unread : null}
      </span>
    </button>
  );
};

export default Notifications;
