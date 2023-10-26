import { gql } from "@apollo/client";

export const GETASSIGNMENT = gql`
  query getAssignment($id: ID!, $class_id: ID!) {
    assignments(class_id: $class_id, id: $id) {
      id
      class_id
      title
      start_time
      end_time
      book_id
      message
      book {
        id
        title
        url
        chapter_questions
        chapters
        images {
          cover
        }
      }
      class {
        value: id
        name
      }
      history {
        chapter
        chapter_last
        score
        read_time
        start_time
        last_time
        allow_retake
        request_retake
        student {
          id
          first_name
          last_name
        }
      }
    }
  }
`;
