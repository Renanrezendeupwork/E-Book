import { gql } from "@apollo/client";

export const LOGIN_MUTATION = gql`
  mutation Login(
    $email: String
    $pass: String
    $token: String
    $timezone: String
    $firebase_token: String
  ) {
    login(
      email: $email
      password: $pass
      token: $token
      timezone: $timezone
      firebase_token: $firebase_token
    ) {
      id
      token
      name
      email
      active
      admin
      show_steps
      lang_id
      profile_pic
      student_limit
      plan {
        id
        plan_id
        status
        from
        to
        payment_method
        name
      }
    }
  }
`;

export const STUDENT_MUTATION = gql`
  mutation StudentLogin(
    $login_code: String
    $pass: String
    $firebase_token: String
    $timezone: String!
    $token: String
  ) {
    studentLogin(
      login_code: $login_code
      password: $pass
      timezone: $timezone
      token: $token
      firebase_token: $firebase_token
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
