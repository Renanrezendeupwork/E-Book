import gql from "graphql-tag";

export const GET_NOTIFICATIONS = gql`
  query getNotifications($limit: Int) {
    notifications(limit: $limit) {
      id
      readed
      message
      created_at
      key_string
      action
      cta {
        text
        mutation
        variables
        called
        text_done
      }
      type
    }
  }
`;

export const GET_NOTIFICATIONS_COUNT = gql`
  query notificationsUnread {
    notificationsUnread
  }
`;

export const NOTIFICATION_READ = gql`
  mutation readNotification($id: ID, $called: Boolean) {
    readNotification(id: $id, called: $called)
  }
`;
