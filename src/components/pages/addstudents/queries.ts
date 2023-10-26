import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query getClasses {
    classes {
      value: id
      txt: name
      students
    }
  }
`;

export const SAVE_STUDENT = gql`
  mutation saveStudent(
    $first_name: String!
    $last_name: String!
    $class_id: ID!
  ) {
    addStudent(
      first_name: $first_name
      last_name: $last_name
      class_id: $class_id
    ) {
      id
      name
      last_name
      login_code
    }
  }
`;
