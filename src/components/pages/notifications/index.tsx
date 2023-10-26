import React, { useEffect, useState } from "react";

import { gql, useMutation, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

import { NotificationType } from "../../../models/notifications";
import { GET_NOTIFICATIONS, NOTIFICATION_READ } from "./queries";
import { IconJumbotron } from "../../common/icons";
import { timeAgo } from "../../../middleware/dates";
import { LoaderDots } from "../../../middleware/loaders";

type NotificationQueryType = {
  notifications: NotificationType[];
  refetch: any;
};

const Notifications: React.FC = () => {
  const history = useHistory();
  const [unread_num, setUnreadNum] = useState(0);

  const {
    data: notifications,
    refetch,
    loading,
  } = useQuery<NotificationQueryType>(GET_NOTIFICATIONS, {
    variables: { limit: 100 },
    fetchPolicy: "no-cache",
  });
  const [readNotification] = useMutation(NOTIFICATION_READ);

  useEffect(() => {
    updateBadge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifications]);

  const updateBadge = (num: number = 0) => {
    if (!notifications) return false;
    let notifications_num = notifications.notifications.filter(
      (n) => n.readed === false
    ).length;
    const notifications_badge = document.getElementById(
      "notifications_badge"
    ) as HTMLElement;

    notifications_num = notifications_num - num;
    setUnreadNum(notifications_num);
    if (notifications_num > 0) {
      notifications_badge.innerHTML = notifications_num.toLocaleString();
    } else {
      notifications_badge.innerHTML = "";
    }
  };

  const redirect = (action: string, time: number = 500) => {
    updateBadge(1);
    setTimeout(() => {
      history.push(action);
    }, time);
  };

  const markAsRead = (ev: {
    currentTarget: HTMLDivElement | HTMLButtonElement;
    target: HTMLDivElement | HTMLButtonElement;
  }) => {
    const target_el = ev.target;
    ///avoid running on click on the button cta
    if (target_el.tagName === "BUTTON") return;

    const type = ev.currentTarget.dataset.type;
    const action = ev.currentTarget.dataset.action;
    const notification_id = ev.currentTarget.dataset.notification_id;
    readNotification({ variables: { id: notification_id } });
    if (!type || !action) {
      return;
    }

    switch (type) {
      case "link":
        redirect(action);
        break;
      case "read_only":
      default:
        refetch();
        break;
    }
  };

  const markAll = async () => {
    await readNotification();
    refetch();
  };

  return (
    <main>
      <div className="container first-container last-container justify-content-center d-flex">
        <div className="notifications-container list-group">
          <h2 className="d-flex justify-content-between">
            Notifications{" "}
            <button
              className="btn btn-link "
              onClick={markAll}
              disabled={unread_num === 0}
            >
              Mark all as read
            </button>
          </h2>

          {notifications && notifications.notifications.length > 0 ? (
            notifications.notifications.map(
              (notification: NotificationType) => {
                if (!notification.cta || !notification.cta.mutation) {
                  return (
                    <NotificationButton
                      notification={notification}
                      markAsRead={markAsRead}
                    />
                  );
                }
                return (
                  <NotificationItem
                    key={`notification.id_${notification.id}`}
                    notification={notification}
                    markAsRead={markAsRead}
                    refetch={refetch}
                  />
                );
              }
            )
          ) : loading ? (
            <LoaderDots text="Loading notifications" />
          ) : (
            <IconJumbotron
              txt="No notifications"
              icon="far fa-bell-slash"
              classes="my-4"
            />
          )}
        </div>
      </div>
    </main>
  );
};

const NotificationItem: React.FC<{
  notification: NotificationType;
  markAsRead: any;
  refetch: any;
}> = ({ notification, markAsRead, refetch }) => {
  const CTAMUTATION = gql`
    ${notification.cta!.mutation}
  `;
  const [readNotification] = useMutation(NOTIFICATION_READ);
  const [runCta, { loading }] = useMutation(CTAMUTATION);

  const runMutation = async () => {
    const variables = JSON.parse(notification.cta!.variables);
    runCta({ variables });
    await readNotification({
      variables: { id: notification.id, called: true },
    });
    refetch();
  };

  return (
    <NotificationButton
      notification={notification}
      markAsRead={markAsRead}
      mutation={runMutation}
      loading={loading}
    />
  );
};

const NotificationButton: React.FC<{
  notification: NotificationType;
  markAsRead: any;
  mutation?: any;
  loading?: boolean;
}> = ({ notification, markAsRead, mutation, loading }) => {
  return (
    <div
      onClick={markAsRead}
      data-action={notification.action}
      data-notification_id={notification.id}
      data-type={notification.type}
      className={`list-group-item hovered list-group-item-light  ${
        notification.readed ? "" : "active"
      }  notification_item`}
    >
      <div className="d-flex w-100 justify-content-between align-items-center">
        <i
          className={`far mr-3 fa-circle ${
            notification.readed ? "opacity_0" : ""
          }`}
        ></i>
        <p
          className={`text-left w-100 m-0 ${
            notification.readed ? "text-dark" : ""
          }`}
        >
          {notification.message}
        </p>
        <div className="ctas_time">
          <small className="text-nowrap opacity_7">
            | {timeAgo(notification.created_at)}
          </small>
          {notification.cta && mutation ? (
            <button
              className={`btn ${
                notification.cta.called
                  ? "disabled btn-outline-danger"
                  : "btn-danger"
              } btn_cta btn-sm`}
              disabled={notification.cta.called || loading}
              onClick={mutation}
            >
              {loading
                ? "Sending..."
                : notification.cta.called
                ? notification.cta.text_done
                : notification.cta.text}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
