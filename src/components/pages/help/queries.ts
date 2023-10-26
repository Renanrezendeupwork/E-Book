import { gql } from "@apollo/client";

export const SENDHELP = gql`
  mutation helpSupport(
    $topic: String!
    $message: String!
    $email: String
    $name: String
  ) {
    helpSupport(topic: $topic, message: $message, email: $email, name: $name)
  }
`;
