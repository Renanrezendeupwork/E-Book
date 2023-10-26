import { gql } from "@apollo/client";

export const SETLANG = gql`
  mutation setLang($lang_id: ID!) {
    setLang(lang_id: $lang_id)
  }
`;
