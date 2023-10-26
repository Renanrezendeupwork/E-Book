import { gql } from "@apollo/client";

export const GET_USER = gql`
  query getUser($id: ID) {
    user(id: $id) {
      id
      token
      name
      email
      main_contact
      lang_id
      profile_pic
      active
      plan {
        id
        plan_id
        status
        from
        to
        payment_method
        name
      }
    }
    languages {
      id
      name
      active
    }
    getSettings {
      hide_achievements
      block_password_change
      hide_quizzes
      allow_retakes
      angelos_show
      time_zone
      theme
    }
  }
`;

export const GET_NOTI_SETTINGS = gql`
  query getNotiSettings {
    getNotiSettings {
      retakes
      achievements
      new_books
    }
  }
`;

export const SETNOTIFPREFF = gql`
  mutation updateSettings($pref_value: String!, $pref_key: String!) {
    updateNotificationSettings(pref_key: $pref_key, pref_value: $pref_value)
  }
`;
