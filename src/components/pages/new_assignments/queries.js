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
  query getAssignments($class_id: ID!, $id: ID) {
    assignments(class_id: $class_id, id: $id) {
      id
      class_id
      title
      start_time
      end_time
      book_id
      message
      book {
        title
      }
      class {
        name
      }
    }
  }
`;

export const SET_ASSIGNMENTS = gql`
  mutation setAssignments(
    $classes_id: [ID!]
    $title: String!
    $start_time: DateTime!
    $end_time: DateTime!
    $book_id: ID!
    $id: ID
    $message: String
  ) {
    assignment(
      classes_id: $classes_id
      title: $title
      start_time: $start_time
      end_time: $end_time
      book_id: $book_id
      id: $id
      message: $message
    )
  }
`;

export const REMOVE_ASSIGNMENT = gql`
  mutation removeAssignments($id: ID!) {
    removeAssignment(id: $id)
  }
`;

export const GET_READERS = gql`
  query getBooks {
    books {
      id
      title
      level_id
      level {
        id
        name
      }
      language {
        id
        name
      }
    }
  }
`;
