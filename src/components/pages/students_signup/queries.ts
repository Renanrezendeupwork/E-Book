import { gql } from "@apollo/client";

export const GET_CLASSES = gql`
  query getClasses($teacher_id: ID!, $id: ID) {
    classes(teacher_id: $teacher_id, id: $id) {
      value: id
      txt: name
    }
  }
`;

export const STUDENTSIGNUP = gql`
  mutation studentSignup(
    $first_name: String!
    $last_name: String!
    $password: String
    $firebase_token: String
    $firebase_id: String
    $group_id: ID!
    $teacher_id: ID!
    $timezone: String!
  ) {
    addStudent(
      first_name: $first_name
      last_name: $last_name
      password: $password
      firebase_token: $firebase_token
      firebase_id: $firebase_id
      class_id: $group_id
      teacher_id: $teacher_id
      timezone: $timezone
    ) {
      id
      token
      name
      lang_id
      teacher_id
      class_id
      first_visit
      first_name
      last_name
      login_code
      last_login
    }
  }
`;
