import { gql } from "@apollo/client";

export const GET_STUDENT = gql`
  query getStudent($id: ID!) {
    student(id: $id) {
      id
      teacher_id
      name
      first_name
      last_name
      login_code
      class_id
      last_login
      created
      lang_id
      first_visit
      minutes
      firebase_id
      semester_minutes
      class {
        id
        name
      }
      history {
        chapter
        chapter_last
        read_time
        start_time
        last_time
        score
        allow_retake
        rating {
          value
          opinion
          date
        }
        book {
          id
          title
          url
          chapters
        }
      }
    }
    classes {
      value: id
      txt: name
    }
  }
`;

export const GETRESPONSES = gql`
  query getResponses($book_id: ID!, $student_id: ID!) {
    bookQuestions(book_id: $book_id, student_id: $student_id) {
      id
      chapter
      question
      success_meme
      success_msg
      requested_retake
      fail_msg
      fail_meme
      response
      correct
      updated
      timestamp
      tries
      options {
        id
        question_id
        option_txt
        accepted
      }
    }
  }
`;

export const GET_GRADES = gql`
  query getGrades($student_id: ID) {
    grades(student_id: $student_id) {
      student {
        id
        created
        name
        login_code
        class_id
        minutes
        semester_minutes
        last_login
        class {
          name
        }
        history {
          score
          allow_retake
          request_retake
        }
      }
      book {
        title
        id
        chapters
        chapter_questions
      }
      grades {
        chapter
        grade
        question_num
        requested_retake
      }
      overall {
        grade
        question_num
      }
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation updateStudent(
    $id: ID!
    $first_name: String!
    $firebase_token: String
    $last_name: String!
    $class_id: ID!
    $password: String
  ) {
    student(
      id: $id
      first_name: $first_name
      firebase_token: $firebase_token
      last_name: $last_name
      class_id: $class_id
      password: $password
    ) {
      id
    }
  }
`;

export const REMOVE_STUDENT = gql`
  mutation deleteStudents($ids: [ID]!) {
    studentsRemove(ids: $ids)
  }
`;
