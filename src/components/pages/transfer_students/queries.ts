import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query getStudents {
    studentsTransfer {
      type
      teacher {
        id
        name
        email
      }
      students {
        id
        name
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

export const HANDLE_STUDENTS = gql`
  mutation handleStudents(
    $students_ids: [ID!]
    $action: HandleTransferAction
    $class_id: ID
  ) {
    transferHandle(
      students_ids: $students_ids
      action: $action
      class_id: $class_id
    )
  }
`;

export const CANCEL_TRANSFER = gql`
  mutation transferCancel($teacher_id: ID!) {
    transferCancel(teacher_id: $teacher_id)
  }
`;
