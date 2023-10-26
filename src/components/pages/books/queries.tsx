import { gql } from "@apollo/client";

export const GET_READERS = gql`
  query getReaders($lang_id: ID!, $class_id: ID!) {
    books(
      lang_id: $lang_id
      class_id: $class_id
      published_only: true
      order: "level_id"
    ) {
      id
      disabled
      glossary_less
      title
      url
      total_ratings
      print_url
      level_id
      rank
      rating
      rating_teachers
      rating_students
      images {
        thumb
      }
      level {
        id
        name
      }
      language {
        id
        name
      }
      categories {
        id
        name
      }
    }
  }
`;

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

export const DISABLE_BOOKS = gql`
  mutation disableBooks(
    $books_ids: [ID!]!
    $class_id: ID!
    $disable: Boolean!
  ) {
    disableBooks(books_id: $books_ids, class_id: $class_id, disable: $disable)
  }
`;

export const TOGGLE_GLOSSARY = gql`
  mutation glssaryToggle(
    $show_less: Boolean!
    $books_ids: [ID]!
    $class_id: ID!
  ) {
    glssaryToggle(
      show_less: $show_less
      class_id: $class_id
      books_id: $books_ids
    )
  }
`;
