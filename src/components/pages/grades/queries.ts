import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query getStudents {
    classes {
      value: id
      txt: name
      teacher_id
      students
      created
    }
    books {
      id
      title
      language {
        name
      }
    }
  }
`;

export const GET_GRADES = gql`
  query getGrades($class_id: ID) {
    grades(class_id: $class_id, all: true) {
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
        url
        id
        chapters
        chapter_questions
        has_introduction
      }
      grades {
        chapter
        grade
        past
        question_num
        disabled
        requested_retake
      }
      overall {
        grade
        question_num
      }
    }
  }
`;
