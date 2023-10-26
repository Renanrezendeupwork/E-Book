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
  }
`;

export const UPDATELANG = gql`
  mutation updateLang($langs: [ID]) {
    languages(actives: $langs) {
      id
      name
      active
    }
  }
`;

export const SETHOW = gql`
  mutation setHow($how: String!) {
    setHow(how: $how)
  }
`;
export const GETANGELOSPREFF = gql`
  query {
    getSetting(pref_key: "angelos_show")
  }
`;
export const SETANGELOSPREFF = gql`
  mutation updateSettings($pref_value: String!) {
    updateSettings(
      pref_key: "angelos_show"
      pref_value: $pref_value
      is_global: true
    )
  }
`;

export const SETPREFF = gql`
  mutation updateSettings(
    $pref_value: String!
    $pref_key: String!
    $is_global: Boolean!
  ) {
    updateSettings(
      pref_key: $pref_key
      pref_value: $pref_value
      is_global: $is_global
    )
  }
`;
