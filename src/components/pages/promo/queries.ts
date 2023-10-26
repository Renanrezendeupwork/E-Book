import { gql } from "@apollo/client";

export const GETWHOLESAER = gql`
  query GetWholeSale($code: String!) {
    getWholesaer(code: $code) {
      id
      name
      code
      cover
      valid_thru
    }
  }
`;
