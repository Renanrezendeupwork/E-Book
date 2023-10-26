import { gql } from "@apollo/client";

export const GETPAGESETTING = gql`
  query getPageSetting($types: [String!]) {
    pageSettings(types: $types) {
      id
      type
      description
    }
  }
`;
