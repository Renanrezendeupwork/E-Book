import { gql } from "@apollo/client";

export const GET_KEYS = gql`
  query getReaders($lang_id: ID!) {
    books(lang_id: $lang_id, published_only: true, order: "level_id") {
      id
      title
      url
      print_url
      keys_url
      guide_url
      level {
        id
        name
      }
    }
  }
`;
