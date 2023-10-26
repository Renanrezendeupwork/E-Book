import { gql } from "@apollo/client";

export const SIGNUPMUTATION = gql`
  mutation teacherSignUp(
    $user: SignupUser!
    $promocode: String
    $token: String!
    $utm_source: String
    $wholesaler: String
  ) {
    teacherSignup(
      user: $user
      promocode: $promocode
      token: $token
      utm_source: $utm_source
      wholesaler: $wholesaler
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
