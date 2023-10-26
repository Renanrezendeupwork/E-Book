import { gql } from "@apollo/client";

export const RESET_PASS = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`;
