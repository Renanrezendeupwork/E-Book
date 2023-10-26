import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query {
    classes {
      value: id
      txt: name
      students
      created
    }
  }
`;

export const GET_ASSIGNMENTS = gql`
  query getAssignments($class_id: ID) {
    assignments(class_id: $class_id) {
      id
      class_id
      class {
        name
      }
      title
      start_time
      end_time
      book_id
      message
      book {
        title
        language {
          name
        }
      }
    }
  }
`;
