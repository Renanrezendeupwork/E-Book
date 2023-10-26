import { gql } from "@apollo/client";

export const GET_STUDENTS = gql`
  query getStudents($class_id: ID, $week_numer: Int) {
    students(class_id: $class_id, week_numer: $week_numer) {
      id
      created
      name
      last_name
      login_code
      class_id
      minutes
      semester_minutes
      last_login
      class {
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
    studentsTransfer {
      type
      students_count
      teacher {
        name
      }
    }
  }
`;

export const CREATE_CLASS = gql`
  mutation createClass($name: String!, $id: ID) {
    classGroup(name: $name, id: $id) {
      id
    }
  }
`;

export const REMOVE_CLASS = gql`
  mutation removeClass($id: ID!, $remove_students: Boolean) {
    classGroupRemove(id: $id, remove_students: $remove_students)
  }
`;

export const REMOVE_STUDENTS = gql`
  mutation studentsRemove($ids: [ID]!) {
    studentsRemove(ids: $ids)
  }
`;

export const TRANSFER_STUDENTS = gql`
  mutation transferStudents($ids: [ID!], $teacher_email: String!) {
    transferStudents(students_ids: $ids, teacher_email: $teacher_email)
  }
`;
