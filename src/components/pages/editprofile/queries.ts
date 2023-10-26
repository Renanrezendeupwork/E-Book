import { gql } from "@apollo/client";

export const UPDATEUSER = gql`
  mutation userUpdate(
    $email: String
    $main_contact: String
    $new_password: String
    $name: String
    $old_password: String
  ) {
    updateUser(
      email: $email
      main_contact: $main_contact
      new_password: $new_password
      name: $name
      password: $old_password
    )
  }
`;
