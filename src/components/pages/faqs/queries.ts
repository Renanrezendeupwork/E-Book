import { gql } from "@apollo/client";

export const GET_FAQS = gql`
  query {
    fqs {
      id
      question
      answer
    }
  }
`;
