import { gql } from "@apollo/client";

export const GET_RESPONSE = gql`
  query getBooks($book_id: ID!) {
    book(id: $book_id) {
      id
      title
      chapters
      chapter_questions
      url
      total_ratings
      coming_soon
      print_url
      vocab_url
      video_url
      level_id
      rank
      rating
      rating_teachers
      rating_students
      image_ver
      has_prereading
      user_chapter
      images {
        cover
        thumb
        poster
      }
      level {
        id
        name
      }
      description_short
      release_date
      language {
        id
        name
      }
      categories {
        id
        name
        buy_text
      }
      nav_colors {
        background
        color
      }
    }
    bookQuestions(book_id: $book_id) {
      id
      chapter
      response
      correct
      updated
      timestamp
      tries
    }
    students(book_id: $book_id) {
      id
      name
      class {
        name
        id
      }
      history {
        score
        allow_retake
        request_retake
      }
    }
    classes {
      value: id
      txt: name
      teacher_id
      students
      created
    }
  }
`;

export const GET_RESPONSE_STUDENT = gql`
  query getBooks($book_id: ID!, $student_id: ID!, $class_id: ID!) {
    book(id: $book_id, class_id: $class_id) {
      id
      title
      chapters
      url
      total_ratings
      coming_soon
      print_url
      vocab_url
      video_url
      level_id
      rank
      rating
      rating_teachers
      rating_students
      image_ver
      has_prereading
      user_chapter
      images {
        cover
        thumb
        poster
      }
      level {
        id
        name
      }
      description_short
      release_date
      language {
        id
        name
      }
      categories {
        id
        name
      }
      nav_colors {
        background
        color
      }
    }
    bookQuestions(book_id: $book_id) {
      id
      chapter
      response
      correct
      updated
      timestamp
      tries
    }
    student(id: $student_id, book_id: $book_id) {
      history {
        score
        allow_retake
        request_retake
      }
    }
  }
`;

export const REQUEST_RETAKE = gql`
  mutation requestRetake($book_id: ID!, $chapter: String) {
    requestRetake(book_id: $book_id, chapter: $chapter)
  }
`;

export const ALLOW_RETAKE = gql`
  mutation allowRetake(
    $book_id: ID!
    $student_id: ID!
    $allow: Boolean!
    $chapter: String
  ) {
    allowRetake(
      book_id: $book_id
      student_id: $student_id
      allow: $allow
      chapter: $chapter
    )
  }
`;

export const GETREVIEWS = gql`
  query getBookReviews($id: ID!, $class_id: ID) {
    bookReviews(id: $id, class_id: $class_id) {
      book_id
      user_id
      is_teacher
      rating
      opinion
      timestamp
    }
  }
`;
