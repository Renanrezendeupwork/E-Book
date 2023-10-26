import { gql } from "@apollo/client";

export const GET_READERS = gql`
  query getBooks {
    booksTitles {
      title
      coming_soon
      image_ver
      images {
        thumb
      }
      language {
        id
        name
      }
    }
  }
`;
